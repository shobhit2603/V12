import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import sandboxRoutes from "./routes/sandbox.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res)=>{
    res.send("Hello world!")
})

app.get("/_status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});



app.use("/api/sandbox", sandboxRoutes);

export default app;