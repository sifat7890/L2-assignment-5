/* eslint-disable no-unexpected-multiline */
import express, { Request, Response } from "express";
import cors from "cors"
// import passport from "passport"
import cookieParser from "cookie-parser"
import expressSession from "express-session"
import { router } from "./app/routes";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { envVars } from "./app/config/env";


const app = express()
app.use(cors())
app.use(express.json());
app.use(expressSession({
    secret:envVars.EXPRESS_SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
// app.use(passport.initialize())
// app.use(passport.session())
app.use(cookieParser())
app.use(cors({
   origin:envVars.FRONTEND_URL,
    credentials:true
}))


app.use("/api",router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json
        ({
            message: "Welcome to Ride booking system backend"
        })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app