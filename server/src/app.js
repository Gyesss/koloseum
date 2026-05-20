import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api/auth", authRoute);

export default app;
