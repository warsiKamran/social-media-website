import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

config({
    path:"backend/config/config.env"
});
const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());


//routes
import user from "./routes/userRoutes.js";
import post from "./routes/postRouter.js";

app.use("/api/v1", user);
app.use("/api/v1", post);

export default app;

