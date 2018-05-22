
const mongoose = require('mongoose'),
    schema = mongoose.Schema;


    institutesSchema = new schema({
    name: {type:String, index:1,required:true},
    pic: String,
    logo: String,
    type: String,
    location: String,
    uniSalary: String,
    dorms: String,
    subEng: [String],
    latitude: Number ,
    longitude: Number

}, {collection: 'institutes'}),

institutes= mongoose.model('institutes',institutesSchema);
module.exports=institutes;


console.log(`required paths: ${institutesSchema.requiredPaths()}`);
console.log(`indexes: ${JSON.stringify(institutesSchema.indexes())}`);
