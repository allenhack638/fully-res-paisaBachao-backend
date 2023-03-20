import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../Models/User.js";
import Amount from "../Models/Amount.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const ClickStore = async (req, res) => {

    const { token } = req.body.data;

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

    const { store, offerid, currDay } = req.body.data;

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
    const available = await Amount.findOne({ userId: users._id });
    available.array.unshift({ text: store, offerid: offerid, currDay: currDay, status: "Pending" });
    await available.save();

}
export default ClickStore