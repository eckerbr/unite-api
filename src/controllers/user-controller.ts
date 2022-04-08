import { Response, Request, NextFunction, json } from "express";
import { IResult } from "mssql";
import { queryDB } from "../services/data-access";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const key: string = process.env["JWT_KEY"] || "";
    if (key === "" || key === null || key === undefined) {
        throw { message: "ERROR CODE: 0xBAADBEEF" };
    }

    const { userName, password } = req.body;

    try {
        const idPasswordResult: any = await queryDB(
            `SELECT Id, PasswordHash FROM Users WHERE UserName='${userName}'`
        );

        if (idPasswordResult !== null && idPasswordResult !== undefined) {
            if (idPasswordResult.recordset.length > 0) {
                const { Id: userId, PasswordHash: passwordHash } =
                    idPasswordResult.recordset[0];

                const passwordMatch: boolean = await bcrypt.compare(
                    password,
                    passwordHash
                );

                if (passwordMatch === true) {
                    const userData: IResult<any> | null = await queryDB(
                        `SELECT Id, UserName, Email, Admin=(SELECT COUNT(*) AS IsAdmin
                                                              FROM UserRoles 
                                                             WHERE UserId='${userId}'
                                                               AND RoleId=(SELECT Id FROM Roles WHERE Name='Admin')) 
                           FROM Users WHERE Id='${userId}'`
                    );

                    if (
                        userData?.recordset !== null &&
                        userData?.recordset !== undefined
                    ) {
                        if (userData.recordset.length > 0) {
                            var user = userData.recordset[0];

                            const token: string = await jwt.sign(
                                JSON.stringify(user),
                                key
                            );
                            return res.status(200).json({
                                token: token,
                                userName: user.UserName,
                                email: user.Email,
                                id: user.Id,
                                isAdmin: user.Admin,
                            });
                        }
                    }
                }
            }
        }

        return res.status(401).json({
            message: "Invalid login attempt",
        });
    } catch (error: any) {
        console.log(error.message);

        return res.status(500).json({
            error: error.message,
        });
    }
};
