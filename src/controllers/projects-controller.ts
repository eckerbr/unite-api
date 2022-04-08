import { IResult } from "mssql";
import { Response } from "express";
import { AuthorizedRequest } from "../services/auth-middleware";
import { queryDB } from "../services/data-access";

export const listProjects = async (req: AuthorizedRequest, res: Response) => {
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

export const getProject = async (req: AuthorizedRequest, res: Response) => {
    const projectId: string = req.params.projectId;
    const userId: string = req.userData!.userId;
    try {
        const result: IResult<any> | null = await queryDB(`SELECT p.Id, 
                                  p.Title,
                                  p.Description, 
                                  p.Version 
                             FROM Projects AS p
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

export const getSections = async (req: AuthorizedRequest, res: Response) => {
    const projectId: string = req.params.projectId;
    const userId: string = req.userData!.userId;

    try {
        const result: IResult<any> | null = await queryDB(`
                SELECT s.* 
                  FROM Sections AS s
                 INNER JOIN ProjectUsers AS pu
                   ON s.ProjectId=pu.ProjectId
                WHERE pu.UserId='${userId}'
                  AND s.ProjectId='${projectId}'
                  AND ParentId IS NULL
                ORDER BY s.OrderIndex`);

        if (result !== null) {
            return res.status(200).json(result.recordset);
        }

        return res.status(400).json({});
    } catch (error: any) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};

export const addProjectSection = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const editProjectSection = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const removeProjectSection = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const getProjectUsers = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const projectId: string = req.params.projectId;
    const userId: string = req.userData!.userId;

    try {
        const result: IResult<any> | null = await queryDB(`
               SELECT u.id, u.UserName, u.Email, pu.Admin 
                 FROM ProjectUsers AS pu
                INNER JOIN (SELECT p1.* 
                              FROM Projects AS p1 
			            INNER JOIN ProjectUsers pu1 
			                    ON pu1.ProjectId=p1.Id 
			                 WHERE pu1.UserId='${userId}') AS p
                   ON pu.ProjectId=p.Id
                INNER JOIN Users AS u
                   ON pu.UserId=u.Id
                WHERE p.Id='${projectId}'
                  AND u.Active=1`);

        if (result !== null) {
            return res.status(200).json(result.recordset);
        }

        return res.status(400).json({});
    } catch (error: any) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
        });
    }
};
