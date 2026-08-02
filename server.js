import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://lavishloom.vercel.app' // Replace with your actual Vercel live domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));