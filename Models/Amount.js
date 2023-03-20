import mongoose from "mongoose";

const detailSchema = mongoose.Schema({
    userId: {
        type: String
    },
    array: [
        { text: String, offerid: String, clickId: Number, currDay: String, status: String }
    ],
    amount: { type: Number },
    details: [
        { id: String, date: String, mode: String, amount: String, ref_no: String, by: String, upi_id: String }
    ]
});
export default mongoose.model("Amount", detailSchema)