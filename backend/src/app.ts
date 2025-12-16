import express from "express";
import { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cors from "cors";
import { errorHandler, httpLogger } from "./middlewares/error-handler.js";

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles x-www-form-urlencoded
app.use(httpLogger);
app.use(errorHandler);  // <--------- using the errorHandler


// A route
app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});

app.get('/boom', (_req, _res) => {
  throw new Error('Kaboom!');
});

app.use("/auth", authRoutes);
app.use("/products", productsRouter);

export default app;