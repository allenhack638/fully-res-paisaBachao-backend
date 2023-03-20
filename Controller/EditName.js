import Cryptr from "cryptr"
import dotenv from "dotenv"
import User from "../Models/User.js";

dotenv.config();

const cryptr = new Cryptr(process.env.DECRPT);

const EditName = async (req, res) => {

    const { email, password, name } = req.body;

    const users = await User.findOne({ email: email });

    if (!users) {
        res.status(403);
        res.json({
            message: "Not a user",
        })
        return;
    }
    else if (cryptr.decrypt(users.password) !== password) {
        res.status(403);
        res.json({
            message: "Invalid Details",
        })
        return;
    } else {
        users.name = name;
        res.status(200);
        res.json({
            message: "Changes Saved Successfully",
        })
        await users.save();
        return;
    }
}
export default EditName