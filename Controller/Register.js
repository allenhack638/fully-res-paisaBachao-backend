import Cryptr from "cryptr"
import dotenv from "dotenv"
import User from "../Models/User.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);

const Register = async (req, res) => {

    const { email, password, name } = req.body;
    const encryptedPass = cryptr.encrypt(password);
    const users = await User.findOne({ email: email });

    if (users) {
        res.status(500);
        res.json({
            message: "User exists! Please login",
        })
        return;
    }

    const user = new User({ email: email, password: encryptedPass, name: name });
    await user.save();
    res.json({
        message: "Registration Success",
    });

}
export default Register;