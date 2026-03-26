import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173'],
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true,
}))

//console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || 'not set');

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//app.options("*", cors());
//routes import
import userRouter from './routes/user.routes.js'
import businessRouter from './routes/business.routes.js'
import invoiceRouter from './routes/invoice.routes.js'
import purchaseRouter from './routes/purchase.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/business", businessRouter)
app.use("/api/v1/invoice", invoiceRouter)
app.use("/api/v1/purchase", purchaseRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app };

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
