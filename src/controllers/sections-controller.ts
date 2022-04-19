import { IResult } from "mssql";
import { Response } from "express";
import { AuthorizedRequest } from "../services/auth-middleware";
import { queryDB } from "../services/data-access";
import { v4 as uuid } from "uuid";

// TODO: PARAMETERIZED QUERIES FOR ALL MSSQL QUERIES~!!!!!!!

export const listSubsections = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const userId = req.userData?.userId;
    const projectId = req.params.projectId;
    const sectionId = req.params.sectionId;

    // TODO: Validate userId is project admin.

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
        console.log(error.message);
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
            await queryDB(`SELECT s.Id, s.Title, s.Description, s.ParentId
                             FROM Sections AS s
                            INNER JOIN ProjectUsers AS pu
                               ON s.ProjectId=pu.ProjectId
                            WHERE s.Id='${sectionId}'
                              AND pu.UserId='${userId}'
                            ORDER BY s.OrderIndex`);

        if (result !== null && result.recordset.length > 0) {
            return res.status(200).json(result?.recordset[0]);
        }

        return res.status(404).json({
            message: "The specified subsection was not found.",
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createSubsection = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const userId = req.userData?.userId;

    // TODO: Validate userId is project admin.

    const { sectionId, projectId, title, description } = req.body;
    const subsectionId = uuid();

    let parentWhereClause = "AND ParentId IS NULL ";
    if (
        sectionId != null &&
        sectionId != undefined &&
        sectionId.trim().length > 0
    ) {
        parentWhereClause = `AND ParentId='${sectionId}'`;
    }

    try {
        const indexResponse: IResult<any> | null = await queryDB(
            `SELECT TOP (1) OrderIndex 
               FROM Sections 
              WHERE ProjectId='${projectId}'
               ${parentWhereClause}
              ORDER BY OrderIndex DESC`
        );

        let index = 0;
        if (
            indexResponse != null &&
            indexResponse != undefined &&
            indexResponse.recordset.length > 0
        ) {
            index = indexResponse.recordset[0].OrderIndex + 1;
        }

        let parentInsertValue = "NULL";
        if (
            sectionId != null &&
            sectionId != undefined &&
            sectionId.trim().length > 0
        ) {
            parentInsertValue = `'${sectionId}'`;
        }

        const result: IResult<any> | null = await queryDB(
            `INSERT INTO Sections (Id, ProjectId, ParentId, Title, Description, OrderIndex )
             VALUES ('${subsectionId}', 
                     '${projectId}', 
                      ${parentInsertValue}, 
                     '${title}', 
                     '${description}', 
                     ${index})`
        );

        return res.status(200).json({
            message: "Section was added.",
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const editSubsection = async (req: AuthorizedRequest, res: Response) => {
    const { title, description } = req.body;
    const sectionId = req.params.sectionId;

    if (
        (title == null || title == undefined || title.trim().length === 0) &&
        (description == null ||
            description == undefined ||
            description.trim().length === 0)
    ) {
        return res.status(200).json({
            message: "No changes requested",
        });
    }

    try {
        let setClauses: string[] = [];

        if (title !== null && title !== undefined && title.trim().length > 0) {
            setClauses.push(`Title='${title}'`);
        }

        if (
            description !== null &&
            description !== undefined &&
            description.trim().length > 0
        ) {
            setClauses.push(`Description='${description}'`);
        }

        const result: IResult<any> | null = await queryDB(
            `UPDATE Sections SET ${setClauses.join(
                ","
            )} WHERE Id='${sectionId}'`
        );

        return res.status(200).json({
            message: "Section updated",
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const deleteSubSection = async (
    req: AuthorizedRequest,
    res: Response
) => {
    // TODO: Should we get rid of all related stuff? Or deny the delete request if there is other related stuff.

    const sectionId = req.params.sectionId;

    try {
        const countResponse = await queryDB(
            `SELECT COUNT(*) AS Count FROM Sections WHERE Id='${sectionId}'`
        );

        if (countResponse?.recordset[0].Count === 0) {
            return res.status(404).json({
                message: "Specified subsection was not located",
            });
        }

        await queryDB(`DELETE FROM Sections WHERE Id='${sectionId}'`);

        return res.status(200).json({
            message: "Subsection deleted",
        });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const listRecords = (req: AuthorizedRequest, res: Response) => {
    return res.status(304).json({
        message: "Under construction",
    });
};
