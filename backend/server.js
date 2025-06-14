const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();


const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'https://flowup-sable.vercel.app' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


app.use(express.json());

app.use((req, res, next) => {
    console.log(`SERVER: Incoming Request - ${req.method} ${req.url}`);
    next();
});

app.use("/api/auth", (req, res, next) => {
    next();
}, require("./routes/auth"));

app.use("/api/task", (req, res, next) => {
    next();
}, require("./routes/task"));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const startServer = async () => {
    try {
        console.log('SERVER: Attempting to connect to MongoDB...');
        await connectDB();
        console.log('SERVER: MongoDB connection successful.');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`SERVER: 🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("SERVER: ❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
