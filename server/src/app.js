import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import authRoute from "./routes/auth.route.js";
import profileRoute from "./routes/profile.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

export default app;
