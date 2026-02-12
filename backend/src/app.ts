import "./config.js";
import express from "express";
import { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cors from "cors";
import { errorHandler, httpLogger } from "./middlewares/error-handler.js";

const app = express();

// Enable CORS for all routes - MUST be before other middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles x-www-form-urlencoded
app.use(httpLogger);


// A route
app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});

app.get('/boom', (_req, _res) => {
  throw new Error('Kaboom!');
});

app.use("/auth", authRoutes);
app.use("/products", productsRouter);

// Error handler MUST be last
app.use(errorHandler);

export default app;