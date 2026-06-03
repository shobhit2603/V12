import express from 'express';
import { startSandbox } from '../controllers/sandbox.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createProject, getUserProjects } from '../controllers/project.controller.js';

const sandboxRoutes = express.Router();

sandboxRoutes.post("/start", authMiddleware, startSandbox);
sandboxRoutes.post("/project", authMiddleware, createProject)
sandboxRoutes.get("/project", authMiddleware, getUserProjects)



export default sandboxRoutes;
