import express from "express";
import morgan from "morgan";
import { listFiles, readFiles, updateFiles } from "./controllers/agent.controller.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Hello from Sandbox Agent",
        status: "Success"
    });
})

/**
 * @route GET /list-files
 * @description list all the files in the WORKDIR directory recursively and return array of string(file paths) eg.
 * [
 *  "vite.config.js",
 *  "src/App.jsx",
 *  "src/App.css",
 * ]
 *
 * this exclude directories like node_modules, .git, dist, build, etc. 
 */

app.get('/list-files', listFiles);


/**
 * @route GET /read-files
 * @description read all the files provided in the query parameter "files" and return an object with file name as key and file content as value eg.
 * {
 *  "vite.config.js": "file content",
 *  "src/App.jsx": "file content",
 * }
 */

app.get('/read-files', readFiles);


/**
 * @route POST /update-files
 * @description update the files provided in the request body with the content provided in the request body. The request body should be an object with file name as key and file content as value eg.
 * {
 *  "vite.config.js": "new file content",
 *  "src/App.jsx": "new file content",
 * }
 */
app.post('/update-files', updateFiles);

export default app;