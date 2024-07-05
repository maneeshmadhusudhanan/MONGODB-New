const { Schema} = require('mongoose');
const { model} = require('mongoose');
const demo = new Schema(
    {
        certificateid: { type: String,required: true},
        candidatename: { type: String,required: true},
        coursename: { type: String,required: true},
        coursegrade: { type: String,required: true},
        coursedate: { type: String,required: true}
        // add another Field
    }
);

const sample = model('sample1',demo);
module.exports=sample;
