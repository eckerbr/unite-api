import { Response } from "express";
import { IResult } from "mssql";
import { AuthorizedRequest } from "../services/auth-middleware";
import { queryDB } from "../services/data-access";

export const listFieldSchemas = async (
    req: AuthorizedRequest,
    res: Response
) => {
    try {
        const sectionId = req.params.sectionId;
        const queryResult: IResult<any> | null = await queryDB(
            `SELECT * FROM FieldSchemas WHERE SectionId='${sectionId}'`
        );

        if (queryResult !== null && queryResult !== undefined) {
            return res.status(200).json(queryResult.recordset);
        }

        return res.status(404).json({
            message: "Unknown section ID specified",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getFieldSchema = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const createFieldSchema = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const editFieldSchema = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};

export const deleteFieldSchema = (req: AuthorizedRequest, res: Response) => {
    return res.status(503).json({
        message: "Under construction",
    });
};
