import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../Models/User.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const EditPass = async (req, res) => {

    const { curr, conPass, token } = req.body.body;

    const verify = jwt.verify(token, SUPER_KEY, (err, data) => {
        if (err) {
            res.status(408).json("Oops Session Expired");
            return;
        } else
            return data;
    });
    if (verify === undefined) {
        res.status(408);
        return;
    }
    const { email } = verify;
    const users = await User.findOne({ email: email });

    if (!users) {
        res.status(403).json("Not a user");
        return;
    }
    else if (cryptr.decrypt(users.password) !== curr) {
        res.status(403).json("Incorrect old password");
        return;
    } else {

        users.password = cryptr.encrypt(conPass);
        res.status(200).json("Password set successfully");
        await users.save();
        return;
    }
}
export default EditPass