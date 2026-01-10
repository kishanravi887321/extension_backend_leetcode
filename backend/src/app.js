import express from "express";
import {router as userRoutes} from "./routes/user.routes.js";
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.get("/",(req,res)=>{
    res.send("server  is running...");
});

const PORT = 3000;
export default app;