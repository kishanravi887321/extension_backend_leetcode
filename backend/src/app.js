import express from "express";
import cors from "cors";
import {router as userRoutes} from "./routes/user.routes.js";

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://cp.saksin.online', 'http://cpcoders.saksin.online'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use("/api/users", userRoutes);
app.get("/",(req,res)=>{
    res.send("server  is running... ");
});

const PORT = 3000;
export default app;