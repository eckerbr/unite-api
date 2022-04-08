import { Router } from "express";
import { userAuth } from "../services/auth-middleware";
import * as controller from "../controllers/sections-controller";

const sectionRoutes = Router();

sectionRoutes.get(
    "/:projectId/:sectionId",
    userAuth,
    controller.listSubsections
);
sectionRoutes.get("/:sectionId", userAuth, controller.getSubsection);
sectionRoutes.post("/", userAuth, controller.createSubsection);
sectionRoutes.put("/:sectionId", userAuth, controller.editSubsection);

export default sectionRoutes;
