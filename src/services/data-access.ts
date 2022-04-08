import mssql, { connect } from "mssql";

export const queryDB = async (query: string) => {
    const connectionString: string =
        process.env["MSSQL_CONNECTION_STRING"] || "";

    if (connectionString.trim().length > 0) {
        try {
            const pool = await mssql.connect(connectionString);
            return await pool.request().query(query);
        } catch (error) {
            console.log("MSSQL Error: ", error);
            return null;
        }
    }

    console.log("Empty connection string provided");
    return null;
};
