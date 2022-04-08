import { Router } from "express";
import { adminAuth } from "../services/auth-middleware";

import * as controller from "../controllers/admin-controller";
const adminRoutes = Router();

adminRoutes.get("/users/", adminAuth, controller.listUsers);
adminRoutes.get("/users/:userId", adminAuth, controller.getUser);
adminRoutes.post("/users/", adminAuth, controller.createUser);
adminRoutes.delete("/users/:userId", adminAuth, controller.deleteUser);
adminRoutes.put("/users/:userId", adminAuth, controller.editUser);
adminRoutes.get("/projects/", adminAuth, controller.listProjects);
adminRoutes.get("/projects/:projectId", adminAuth, controller.getProject);
adminRoutes.post("/projects/", adminAuth, controller.createProject);
adminRoutes.delete("/projects/:projectId", adminAuth, controller.deleteProject);
adminRoutes.put("/projects/:projectId", adminAuth, controller.editProject);
adminRoutes.post("/users/addRole/", adminAuth, controller.addRoleToUser);
adminRoutes.post("/projects/addUser/", adminAuth, controller.addUserToProject);
adminRoutes.post(
    "/users/removeRole/",
    adminAuth,
    controller.removeRoleFromUser
);
adminRoutes.post(
    "/projects/removeUser/",
    adminAuth,
    controller.removeUserFromProject
);

export default adminRoutes;
