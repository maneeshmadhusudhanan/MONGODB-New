const { Schema } = require('mongoose');
const { model } = require('mongoose');
const demo = new Schema(
    {
        VehicleID: { type: String, required: true },
        Vehicle__owner_name: { type: String, required: true },
        Service_no: { type: String, required: true },
        Vehicle_type: { type: String, required: true },
        Service_given_date: { type: String, required: true },
        Estimated_time: { type: String, required: true },
        Service_details: { type: String, required: true },

    }
);

const sample = model('sample1', demo);
module.exports = sample;
