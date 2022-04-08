import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin-routes";
import userRoutes from "./routes/user-routes";
import projectRoutes from "./routes/project-routes";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "*",
        allowedHeaders:
            "Origin,X-Requested-With,Content-Type,Accept,Authorization",
        methods: "POST,PUT,GET,DELETE",
        optionsSuccessStatus: 200,
    })
);

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = {
        message: "Not found",
        status: 404,
    };
    next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
        message: error.message,
    });
});

export default app;
