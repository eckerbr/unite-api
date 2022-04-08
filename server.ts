import http, { Server } from "http";
import app from "./src/app";
import dotnet from "dotenv";

dotnet.config();

const server: Server = http.createServer(app);

server.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
);
