import express from "express";
import cors from "cors";
import router from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import router2 from "./routes/snippetRoutes";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoute = router;
const snipRoute = router2;

app.use("/auth",authRoute);
app.use("/snippet",snipRoute);

app.get("/",(req,res)=>{
    res.json({
        message : "Hello everynyan"
    })
})

export default app;

