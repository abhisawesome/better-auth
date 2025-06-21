import express, { Request, Response } from "express";
import 'dotenv/config'
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

app.get("/health-check", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running"
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});