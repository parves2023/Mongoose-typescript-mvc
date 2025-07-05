import express, { Application } from "express";
import cors from "cors";
import { bookRoutes } from "./MVC/Controller/book.controller";
import { borrowRoutes } from "./MVC/Controller/borrow.controller";

const app: Application = express();

app.use(cors());
app.use(express.json());

// controllers
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `Welcome to the Library Management System API ${process.env.NODE_ENV} mode`
    );
});

export default app;
