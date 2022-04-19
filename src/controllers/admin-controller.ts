import { Request, Response } from "express";
import { IResult } from "mssql";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { queryDB } from "../services/data-access";
import { AuthorizedRequest } from "../services/auth-middleware";

export const listUsers = async (req: AuthorizedRequest, res: Response) => {
    let query: string = "SELECT Id, UserName, Email, Active FROM Users";

    if (req.query.showInactive !== "1") {
        query = query + " WHERE Active=1";
    }

    try {
        const result: IResult<any> | null = await queryDB(query);
        if (result !== null && result?.recordset.length > 0) {
            return res.status(200).json(result?.recordset);
        }
        return res.status(404).json({
            message: "No users found",
        });
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getUser = async (req: AuthorizedRequest, res: Response) => {
    const userId: string = req.params.userId;
    try {
        const queryResult: IResult<any> | null = await queryDB(
            `SELECT TOP 1 * FROM Users WHERE Id='${userId}'`
        );

        if (queryResult !== null && queryResult?.recordset.length > 0) {
            return res.status(200).json(queryResult?.recordset[0]);
        }
        return res.status(404).json({
            message: "The specified user was not found",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createUser = async (req: AuthorizedRequest, res: Response) => {
    const userId: string = uuid();
    const { userName, email, password } = req.body;

    try {
        const hashResult: string = await bcrypt.hash(password, 10);
        const query: string = `INSERT INTO Users (Id, UserName, Email, Active, PasswordHash, RequirePasswordChange)
                  VALUES ('${userId}', '${userName}', '${email}', 1, '${hashResult}', 1)`;
        await queryDB(query);
        return res.status(201).json({
            message: "Success",
            url: `/admin/users/${userId}`,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const editUser = async (req: AuthorizedRequest, res: Response) => {
    const userId: string = req.params.userId;
    const { email, userName, active } = req.body;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count FROM Users WHERE Id='${userId}'`
        );

        if (existResult === null || existResult.recordset.length === 0) {
            if (existResult?.recordset[0].Count === 0) {
                return res.status(404).json({
                    message: "Specified user not found",
                });
            }
        }

        if (!userName && !email && !active) {
            return res.status(200).json({
                message: "No changed properties specified",
            });
        }

        let sets: string[] = [];

        if (userName && userName.length > 0) {
            sets.push(`UserName='${userName}'`);
        }
        if (email) {
            sets.push(`Email='${email}'`);
        }
        if (active !== null) {
            sets.push(`Active='${active}'`);
        }

        let updateQuery: string = `UPDATE Users SET ${sets.join(
            ","
        )} WHERE Id='${userId}'`;

        const updateResults: IResult<any> | null = await queryDB(updateQuery);

        //TODO: Validate query ???

        return res.status(200).json({
            message: "User updated",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteUser = async (req: AuthorizedRequest, res: Response) => {
    const userId = req.params.userId;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count FROM Users WHERE Id='${userId}'`
        );

        if (existResult === null || existResult.recordset.length === 0) {
            if (existResult?.recordset[0].Count === 0) {
                return res.status(404).json({
                    message: "Specified user not found",
                });
            }
        }

        const deleteResult = await queryDB(
            `DELETE FROM Users WHERE Id='${userId}'`
        );

        return res.status(200).json({
            message: "User deleted.",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const listProjects = async (req: AuthorizedRequest, res: Response) => {
    let query: string = "SELECT * FROM Projects";

    if (req.query.showInactive !== "1") {
        query = query + " WHERE Active=1";
    }

    try {
        const result: IResult<any> | null = await queryDB(query);
        if (result !== null && result?.recordset.length > 0) {
            return res.status(200).json(result?.recordset);
        }
        return res.status(404).json({
            message: "No projects found",
        });
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getProject = async (req: AuthorizedRequest, res: Response) => {
    const projectId: string = req.params.projectId;
    try {
        const queryResult: IResult<any> | null = await queryDB(
            `SELECT TOP 1 Id, Title, Description FROM Projects WHERE Id='${projectId}'`
        );

        if (queryResult !== null && queryResult?.recordset.length > 0) {
            return res.status(200).json(queryResult?.recordset[0]);
        }
        return res.status(404).json({
            message: "The specified project was not found",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createProject = async (req: AuthorizedRequest, res: Response) => {
    const projectId: string = uuid();
    const { title, description } = req.body;

    try {
        await queryDB(`INSERT INTO Projects (Id, Title, Description, Active, Version)
                  VALUES ('${projectId}', '${title}', '${description}', 1, '0.0')`);
        return res.status(201).json({
            message: "Success",
            url: `/admin/projects/${projectId}`,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const editProject = async (req: AuthorizedRequest, res: Response) => {
    const projectId: string = req.params.projectId;
    const { title, description, active } = req.body;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count FROM Projects WHERE Id='${projectId}'`
        );

        if (existResult === null || existResult.recordset.length === 0) {
            if (existResult?.recordset[0].Count === 0) {
                return res.status(404).json({
                    message: "Specified user not found",
                });
            }
        }

        const hasActive: boolean = active !== null && active !== undefined;

        if (!title && !description && !hasActive) {
            return res.status(200).json({
                message: "No changed properties specified",
            });
        }

        let sets: string[] = [];

        if (title && title.length > 0) {
            sets.push(`Title='${title}'`);
        }
        if (description) {
            sets.push(`Description='${description}'`);
        }

        if (active !== null && active !== undefined) {
            sets.push(`Active='${active}'`);
        }

        const updateResults: IResult<any> | null = await queryDB(
            `UPDATE Projects SET ${sets.join(",")} WHERE Id='${projectId}'`
        );

        return res.status(200).json({
            message: "Project updated",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteProject = async (req: AuthorizedRequest, res: Response) => {
    const projectId = req.params.projectId;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count FROM Users WHERE Id='${projectId}'`
        );

        if (existResult === null || existResult.recordset.length === 0) {
            if (existResult?.recordset[0].Count === 0) {
                return res.status(404).json({
                    message: "Specified user not found",
                });
            }
        }

        const deleteResult = await queryDB(
            `DELETE FROM Projects WHERE Id='${projectId}'`
        );

        return res.status(200).json({
            message: "User deleted.",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const listRoles = async (req: Request, res: Response) => {
    try {
        const result: IResult<any> | null = await queryDB(
            `SELECT Id, Name, Description From Roles`
        );
        if (
            result != null &&
            result != undefined &&
            result.recordset.length > 0
        ) {
            return res.status(200).json(result?.recordset);
        }

        return res.status(204).json({});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const isAdmin = async (req: AuthorizedRequest, res: Response) => {
    const userId = req.params.userId;

    try {
        const result: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS IsAdmin FROM Users AS u
              INNER JOIN UserRoles AS ur
                 ON u.Id=ur.UserId
              INNER JOIN Roles AS r
                 ON ur.RoleId=r.Id
              WHERE r.Name='Admin'
                AND u.Id='${userId}'`
        );

        if (result === null || result === undefined) {
            return res.status(200).json({
                isAdmin: 0,
            });
        }

        return res.status(200).json({
            isAdmin: result.recordset[0].IsAdmin,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addRoleToUser = async (req: AuthorizedRequest, res: Response) => {
    const { userId, roleId } = req.body;
    const id = uuid();

    try {
        const result: IResult<any> | null = await queryDB(
            `INSERT INTO UserRoles (Id, UserId, RoleId) VALUES('${id}', '${userId}', '${roleId}')`
        );

        return res.status(200).json({
            message: "Role applied to user",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const removeRoleFromUser = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const { userId, roleId } = req.body;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count FROM UserRoles WHERE UserId='${userId}' AND RoleId='${roleId}'`
        );

        if (
            existResult == null ||
            existResult == undefined ||
            existResult.recordset[0].Count === 0
        ) {
            return res.status(404).json({
                message: "Specified user/role combination not located",
            });
        }

        const result: IResult<any> | null = await queryDB(
            `DELETE FROM UserRoles WHERE UserId='${userId}' AND RoleId='${roleId}'`
        );

        return res.status(200).json({
            message: "Role removed from user",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const addUserToProject = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const { userId, projectId, admin } = req.body;
    const id = uuid();

    try {
        const existResult: IResult<any> | null = await queryDB(
            `INSERT INTO ProjectUsers (Id, ProjectId, UserId, Admin)
             VALUES ('${id}', '${projectId}', '${userId}', ${admin})`
        );

        return res.status(200).json({
            message: "User added to the project",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const removeUserFromProject = async (
    req: AuthorizedRequest,
    res: Response
) => {
    const { projectId, userId } = req.body;

    try {
        const existResult: IResult<any> | null = await queryDB(
            `SELECT COUNT(*) AS Count 
            FROM ProjectUsers 
            WHERE ProjectId='${projectId}' 
            AND UserId='${userId}'`
        );

        if (
            existResult == null ||
            existResult == undefined ||
            existResult.recordset[0].Count === 0
        ) {
            return res.status(404).json({
                message: "Specified user/role combination not located",
            });
        }

        const result: IResult<any> | null = await queryDB(
            `DELETE FROM ProjectUsers WHERE UserId='${userId}' AND ProjectId='${projectId}'`
        );

        return res.status(200).json({
            message: "User removed from project.",
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
