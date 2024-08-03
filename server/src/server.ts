import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/dbconfig"
import users from "./routes/userRoutes"

dotenv.config();
connectDb();

const port = process.env.PORT ||5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));

app.use("/api/users", users);

app.get("/", (req, res) => {
    res.send("Hello!!");
});

app.listen(port, () => {
    console.log(`Server started sucessfully on port : ${port}`);
})

console.log('JWT Secret:', process.env.JWT_SECRET);