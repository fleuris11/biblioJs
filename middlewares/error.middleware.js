export const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err && err.stack ? err.stack : err);

  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error");

  res.status(status).json({ message });
};

 
