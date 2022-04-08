import { IResult } from "mssql";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../services/auth-middleware";
import { queryDB } from "../services/data-access";

export const listProjects = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const userId: string = req.userData!.userId;

    try {
        const result: IResult<any> | null =
            await queryDB(`SELECT p.Id, p.Title, p.Description FROM Projects AS p
                            INNER JOIN ProjectUsers as pu
                               ON p.Id = pu.ProjectId
                            INNER JOIN Users AS u
                               ON pu.UserId = u.Id
                            WHERE u.Id='${userId}'
                              AND p.Active=1`);

        if (result !== null) {
            return res.status(200).json(result?.recordset);
        }
    } catch (error: any) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getProject = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const projectId: string = req.params.projectId;
    const userId: string = req.userData!.userId;
    try {
        const result: IResult<any> | null =
            await queryDB(`SELECT p.Id, p.Title, p.Description, p.Version FROM Projects AS p
                            INNER JOIN ProjectUsers AS pu
                               ON p.Id=pu.ProjectId
                            INNER JOIN Users AS u
                               ON pu.UserId=u.Id
                            WHERE u.Id='${userId}'
                              AND p.Id='${projectId}'`);

        if (result !== null) {
            if (result.recordset.length > 0) {
                return res.status(200).json(result.recordset[0]);
            }
        }

        return res.status(404).json({
            message: "Specified project not found, or no access permission",
        });
    } catch (error: any) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};
