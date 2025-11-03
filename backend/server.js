import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware: Body parsing (must come first)
app.use(express.json());

// ----------------------------------------------------
// 🌟 UPDATED CORS CONFIGURATION 🌟
// This allows your deployed Netlify frontend (CLIENT_URL) to communicate with
// your Render backend. We are now using an environment variable (CLIENT_URL)
// which you will set on the Render platform.
// ----------------------------------------------------
const allowedOrigins = [
    // This is the URL of your deployed Netlify frontend (e.g., https://billwise-frontend.netlify.app)
    process.env.CLIENT_URL, 
    // This allows local development while deploying
    "http://localhost:3000" 
];

const corsOptions = {
    // Only allow requests from the URLs defined in allowedOrigins
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// Initial route for testing the API status
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);


// Server Listener
// Use the port provided by the environment (Render) or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));