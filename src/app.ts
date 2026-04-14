import express from "express"


import cors from "cors"

import {taskRouter} from "./routes/task.routes"

import {errorMiddleware} from "./middleware/error.middleware"
const app = express();

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRouter);

// we are using error middleware at last because we want to catch all the errors that might occur in the 
// routes and controllers.
app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;