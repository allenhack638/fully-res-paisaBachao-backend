import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import get from "./Middlewares/Get.js";
import Login from "./Middlewares/Login.js"
import FetchDetails from "./Controller/FetchDetails.js"
import Register from "./Controller/Register.js"
import FetchArrays from "./Controller/FetchArrays.js"
import Withdraw from "./Controller/Withdraw.js"
import SendMail from "./Controller/SendMail.js"
import ClickStore from "./Controller/ClickStore.js"
import EditName from "./Controller/EditName.js"
import Reload from "./Controller/Reload.js"
import EditPass from "./Controller/EditPass.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

app.get("/amount", get);
app.post('/login', Login);
app.get('/fetch-details', FetchDetails);
app.post('/register', Register);
app.get("/arrays", FetchArrays);
app.post('/withdraw', Withdraw);
app.post("/reset", SendMail);
app.post('/click', ClickStore);
app.post('/edit-name', EditName);
app.get("/reload", Reload);
app.post("/edit-pass", EditPass);

app.listen(process.env.PORT, (console.log("Port has started at 5000")));

mongoose.set("strictQuery", false);
const url = process.env.CONNECTION_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to database successfully"))
    .catch(console.error)
    .catch(console.error)
