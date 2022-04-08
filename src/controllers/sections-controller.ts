import { IResult } from "mssql";
import { Response } from "express";
import { AuthorizedRequest } from "../services/auth-middleware";
import { queryDB } from "../services/data-access";

export const listSubsections = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const userId = req.userData?.userId;
    const projectId = req.params.projectId;
    const sectionId = req.params.sectionId;

    try {
        const result: IResult<any> | null =
            await queryDB(`SELECT s.Id, s.Title, s.Description
                         FROM Sections AS s
                        INNER JOIN ProjectUsers AS pu
                           ON s.ProjectId=pu.ProjectId
                        WHERE s.ProjectId='${projectId}'
                          AND s.ParentId='${sectionId}'
                          AND pu.UserId='${userId}'
                        ORDER BY s.OrderIndex`);

        if (result !== null) {
            return res.status(200).json(result?.recordset);
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getSubsection = async (req: AuthorizedRequest, res: Response) => {
    const userId = req.userData?.userId;
    const sectionId = req.params.sectionId;

    try {
        const result: IResult<any> | null =
            await queryDB(`SELECT s.Id, s.Title, s.Description
                             FROM Sections AS s
                            INNER JOIN ProjectUsers AS pu
                               ON s.ProjectId=pu.ProjectId
                            WHERE s.Id='${sectionId}'
                              AND pu.UserId='${userId}'
                            ORDER BY s.OrderIndex`);

        if (result !== null) {
            return res.status(200).json(result?.recordset[0]);
        }
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createSubsection = async (
    req: AuthorizedRequest,
    res: Response
) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const editSubsection = async (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};
