import React, { useState } from 'react';
import axios from 'axios';

function UploadPayment({ amount = 0, userId = '' }) {
  const [file, setFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a payment screenshot.');
      return;
    }

    // Prepare multipart form data
    const formData = new FormData();
    formData.append('screenshot', file); // Matches upload.single('screenshot') in backend
    formData.append('amount', amount);
    formData.append('userId', userId);
    formData.append('transactionId', transactionId);

    try {
      setLoading(true);
      setMessage('');

      const response = await axios.post('/api/payments/upload-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Payment screenshot submitted successfully!');
      setFile(null);
      setTransactionId('');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to upload payment proof.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Upload Payment Proof</h3>
      {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Transaction / Reference ID:</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. TXN12345678"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Payment Screenshot:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          {loading ? 'Uploading...' : 'Submit Payment Proof'}
        </button>
      </form>
    </div>
  );
}

export default UploadPayment;