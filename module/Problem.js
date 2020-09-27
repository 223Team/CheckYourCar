const mongoose = require("mongoose")

var problemSchema = new mongoose.Schema(
    {
        carModel: {
            type: String,
            required: [true]
        },
        carWork: {
            type: String,
        },
        issue: {
            type: String,
            required: [true]
        },
    }
)


module.exports = mongoose.model("Problem", problemSchema)
