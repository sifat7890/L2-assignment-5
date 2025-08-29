/* eslint-disable no-unexpected-multiline */
import express, { Request, Response } from "express";
import cors from "cors"
import passport from "passport"
import cookieParser from "cookie-parser"


const app = express()
app.use(cors())
app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())


app.get("/", (req: Request, res: Response) => {
    res.status(200).json
        ({
            message: "Welcome to Ride booking system backend"
        })
})

export default app