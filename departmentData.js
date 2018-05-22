var mongoose = require('mongoose');
var schema = mongoose.Schema;

var departmentSchema = new schema({
    // _id: {type: String, index:1, required:true},
    engName: String,            // not done
    hebName: String,            // done
    description: String,        // done
    requirements: String,       // not done
    subjects: String,           // not done
    lowSalary: String,          // not done
    highSalary: String,         // not done
}, {collection: 'Departments'});

var Department = mongoose.model('Department', departmentSchema);

module.exports = Department;