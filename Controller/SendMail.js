import nodemailer from "nodemailer";
import User from "../Models/User.js";
import dotenv from "dotenv"

import Cryptr from "cryptr"
const cryptr = new Cryptr('myTotallySecretKey');

dotenv.config();

const SendMail = async (req, res) => {

    const { email } = req.body;
    const users = await User.findOne({ email: email });

    if (!users) {
        res.status(500);
        res.json({
            message: "Not an user. Please register.",
        })
        return;
    }
    res.status(200).json({ message: "Success!!" });

    const rawPass = cryptr.decrypt(users.password);
    const { name } = users;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'allenbenny038@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        from: {
            name: 'paisabachao.com',
            address: 'allenbenny038@gmail.com'
        },
        to: email,
        replyTo: 'allenbenny038@gmail.com',
        subject: 'Important: Password Reset Request for Your paisaBachao Account',
        text: `Hello ${name},\n\nDid you forget your password?\n\nAs a precautionary measure, please ensure that you store the password in a secure location and delete this email once you no longer need it.\n\nYour password is:-\n\n\t${rawPass}\n\nThank You.\nThe paisabachao Team.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return;
}
export default SendMail