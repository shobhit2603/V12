import express from "express"
import morgan from "morgan"

const app = express();
app.use(morgan("dev"));

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

app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid();

    await createService(sandboxId);

    res.status(201).json({
        message: "Sandbox environment created successfully",
        sandboxId,
        preview: `${sandboxId}.preview.localhost`
    });
    
})

export default app;