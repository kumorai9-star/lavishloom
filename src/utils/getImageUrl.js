const API_BASE_URL = import.meta.env.VITE_API_URL || "https://lavishloom-backend.onrender.com";

export const getImageUrl = (imagePath) => {
  // 1. Return fallback if no path provided
  if (!imagePath) return "/placeholder.png";

  // 2. If path is a full URL starting with localhost, replace it with Render URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath.replace("http://localhost:5000", API_BASE_URL);
  }

  // 3. For relative paths (e.g. "/uploads/image.png" or "uploads/image.png")
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};