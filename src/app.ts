import express from "express";
import cors from "cors";
import router from "./routes/authRoutes";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoute = router;

app.use("/auth",authRoute);

app.get("/",(req,res)=>{
    res.json({
        message : "Hello everynyan"
    })
})

export default app;

