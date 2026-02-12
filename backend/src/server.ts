import "./config.js";
import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});