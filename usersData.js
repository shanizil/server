
const mongoose = require('mongoose'),
    schema = mongoose.Schema;


    userSchema = new schema({
    firstName: {type:String, index:1,required:true},
    lastName: String,
    email: String,
    password: String
}, {collection: 'user'}),


 user= mongoose.model('user',userSchema);
module.exports=user;


console.log(`required paths: ${userSchema.requiredPaths()}`);
console.log(`indexes: ${JSON.stringify(userSchema.indexes())}`);
