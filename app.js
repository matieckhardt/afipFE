import "module-alias/register";
import express from "express";
import cors from "cors";

import connectToDatabase from "@src/config/database";
import routes from "@src/routes";
import afipRoutes from "@src/routes/afip";
import { PORT } from "@src/config/env";

const app = express();
connectToDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/", routes);
app.use("/afip", afipRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Listen port ${PORT}`);
});
