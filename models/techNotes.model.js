const mongoose = require("mongoose");
const autoIncrement=require('mongoose-sequence')(mongoose)

const techNotesSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
        user: { type: Number,required:true,ref:'User'},
    },
    {
        timestamps: true,
    }
);

techNotesSchema.plugin(autoIncrement,{
    inc_field:'ticket',
    id:'ticketNums',
    start_seq:500
})

module.exports = mongoose.model("techNotesSchema", techNotesSchema);