import Cryptr from "cryptr"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from 'crypto';

import User from "../Models/User.js";
import Amount from "../Models/Amount.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);
const SUPER_KEY = process.env.TEST;

const Withdraw = async (req, res) => {

    const { amount, upi } = req.body;

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
        res.status(500).json({ message: "Auth failed Please login and try again.." })
        return;
    }

    const { email, password } = verify;

    if (req.body.email !== email || req.body.password !== password) {
        res.status(500).json({ message: "Auth failed Please login and try again.." })
        return;
    }

    const users = await User.findOne({ email: email });
    if (!users) {
        res.status(403);
        res.json({
            message: "No User exsists",
        })
        return;
    }
    const decryptedPass = cryptr.decrypt(users.password);
    if (decryptedPass !== password) {
        res.status(403);
        res.json({
            message: "Invalid Credentials",
        })
        return;
    }
    const cost = await Amount.findOne({ userId: users._id });

    if (amount > cost.amount) {
        res.status(403).json({ message: "Invalid Amount" });
        return;
    }

    // refernce num
    function randomValueHex(len) {
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex')
            .slice(0, len).toUpperCase();
    }
    var string = randomValueHex(3) + randomValueHex(3) + randomValueHex(3);
    // date
    const dat = new Date().toLocaleDateString('en-US', { day: "numeric", year: "numeric", month: "short" });
    // 

    //id generator
    const id = Date.now().toString().substring(5);
    //

    const newPayment = {
        id: id,
        date: dat,
        mode: "UPI",
        amount: amount,
        ref_no: string,
        by: "earnkaro.com",
        upi_id: upi
    }
    cost.details.unshift(newPayment);
    cost.amount -= amount;
    cost.save();
    res.status(200).json({ message: "Success" });

}
export default Withdraw