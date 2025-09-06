import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to DB !!");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listing to port ${envVars.PORT}`);

        })
    } catch (error) {
        console.log(error);

    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()



process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected... Server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)

})
process.on("uncaughtException", (err) => {
    console.log("Unhandled exception detected... Server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)

})
process.on("SIGTERM", (err) => {
    console.log("Sigterm signal detected... Server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)

})
process.on("SIGINT", (err) => {
    console.log("Sigint signal detected... Server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)

})