import { Router } from "express";
import * as controller from "../controllers/user-controller";

const userRoutes = Router();

userRoutes.post("/login/", controller.login);

export default userRoutes;
