const   mongoose = require('mongoose'),
        subEng = require('./subEngData'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };

module.exports={

    getAllSubEng(){
        return subEng.find();
    }
}    