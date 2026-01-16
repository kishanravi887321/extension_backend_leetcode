import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {router as userRoutes} from "./routes/user.routes.js";
import {router as profileRoutes} from "./routes/profile.routes.js";
import {router as questRoutes} from "./routes/quest.routes.js";

const app = express();

// Cookie parser middleware
app.use(cookieParser());

const projectOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://cpcoders.saksin.online', 
  'http://cpcoders.saksin.online',
  'https://cp.saksin.online',
  'https://leetcode.com',
  'https://www.leetcode.com',
  'http://cp.saksin.online',
  'https://www.interviewbit.com',
  'https://www.geeksforgeeks.org',
  'https://geeksforgeeks.org',
  'https://interviewbit.com'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or browser extensions)
    if (!origin) return callback(null, true);
    
    // Allow browser extension origins
    if (origin.startsWith('chrome-extension://') || 
        origin.startsWith('moz-extension://') || 
        origin.startsWith('safari-extension://')) {
      return callback(null, true);
    }
    
    if (projectOrigins.indexOf(origin) !== -1 || origin.endsWith('.leetcode.com')) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/quests", questRoutes);

app.get("/",(req,res)=>{
    res.send("server  is running... ");
});

app.post("/brute-otp",(req,res)=>{
  const data ="11234"

  console.log(req.body.otp)
  if(req.body.otp === data){
    return res.status(200).json({message:"success"})
  }else{
    return res.status(401).json({message:"failed"})
  }

})

const PORT = 3000;
export default app;