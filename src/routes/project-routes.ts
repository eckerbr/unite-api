import { Router } from "express";
import { userAuth } from "../services/auth-middleware";
import * as controller from "../controllers/projects-controller";

const projectRoutes = Router();

projectRoutes.get("/", userAuth, controller.listProjects);
projectRoutes.get("/:projectId", userAuth, controller.getProject);

export default projectRoutes;
