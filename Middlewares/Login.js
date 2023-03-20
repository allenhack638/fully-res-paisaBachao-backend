import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../Models/User.js";
import Amount from "../Models/Amount.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const Login = async (req, res) => {

    const { email, password } = req.body;
    const state = req.body;

    const users = await User.findOne({ email: email });
    if (!users) {
        res.status(403);
        res.json({
            message: "Not a user! Please register",
        })
        return;
    }
    if (cryptr.decrypt(users.password) !== password) {
        res.status(403);
        res.json({
            message: "Invalid Login",
        })
        return;
    }

    const token = jwt.sign(state, SUPER_KEY);
    res.json({
        token: token,
        message: "Login Success!!",
    })
}
export default Login;
