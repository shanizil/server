const mongoose = require('mongoose'),
    schema = mongoose.Schema;


    subEngByUserSchema = new schema({
    userID: {type:String, index:1,required:true},
    software: Number,
    chemistry: Number,
    electronic: Number,
    medical: Number,
    management: Number,
    building: Number,
    machine:Number
}, {collection: 'subEngByUser'}),


 subEngByUser= mongoose.model('subEngByUser',subEngByUserSchema);
module.exports=subEngByUser;


console.log(`required paths: ${subEngByUserSchema.requiredPaths()}`);
console.log(`indexes: ${JSON.stringify(subEngByUserSchema.indexes())}`);
