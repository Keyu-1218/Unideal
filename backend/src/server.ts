import app from "./app.js";

const port = Number(process.env.PORT);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});