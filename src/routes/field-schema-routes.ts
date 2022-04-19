import { Router } from "express";
import { userAuth } from "../services/auth-middleware";

import * as controller from "../controllers/field-schema-controller";
const fieldSchemaRoutes = Router();

fieldSchemaRoutes.get(
    "/list/:sectionId",
    userAuth,
    controller.listFieldSchemas
);
fieldSchemaRoutes.get("/:fieldSchemaId", userAuth, controller.getFieldSchema);
fieldSchemaRoutes.post("/", userAuth, controller.createFieldSchema);
fieldSchemaRoutes.put("/:fieldSchemaId", userAuth, controller.editFieldSchema);
fieldSchemaRoutes.delete(
    "/:fieldSchemaId",
    userAuth,
    controller.deleteFieldSchema
);

export default fieldSchemaRoutes;
