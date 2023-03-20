import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../Models/User.js";
import Amount from "../Models/Amount.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const FetchDetails = async (req, res) => {
    
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const verify = jwt.verify(token, SUPER_KEY, (err, data) => {
        if (err) {
            res.status(408).json("Oops Session Expired");
            return;
        } else
            return data;
    });

    if (verify === undefined) {
        res.status(500);
        return;
    }

    const { email, password } = verify;
    const users = await User.findOne({ email: email })

    const decryptedPass = cryptr.decrypt(users.password);

    if (!users || decryptedPass !== password) {
        res.status(403);
        res.json({
            message: "Auth Failed",
        })
        return;
    }
    const { details } = await Amount.findOne({ userId: users._id });
    res.json(details);

}
export default FetchDetails