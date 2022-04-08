import { Router } from "express";
import { userAuth } from "../services/auth-middleware";
import * as controller from "../controllers/user-controller";

const userRoutes = Router();

userRoutes.post("/login/", controller.login);
userRoutes.post("/changePassword/", userAuth, controller.changePassword);
userRoutes.post("/forgotPassword/", controller.forgotPassword);
userRoutes.post("/resetPassword/", controller.resetPassword);

export default userRoutes;
