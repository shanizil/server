const mongoose = require('mongoose'),
    schema = mongoose.Schema;


    subEngSchema = new schema({
    name: {type:String, index:1,required:true},
    logo: String
}, {collection: 'subEng'}),


 subEng= mongoose.model('subEng',subEngSchema);
module.exports=subEng;


console.log(`required paths: ${subEngSchema.requiredPaths()}`);
console.log(`indexes: ${JSON.stringify(subEngSchema.indexes())}`);