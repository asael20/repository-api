const mongoose = require('mongoose');



const schema = mongoose.Schema({

    name: {
        type: String,
        unique: true,
        required: true,
        default: 'NOTNAME'
    },

    dbName: {
        type: String,
        required: true,
        unique: true
    },


    creationToken: {
        type: String,
        required: true,
        unique: true
    },

    creationTokenStatus: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'EXPIRED']
    },

});




const BusinessSchema = {

    schema,
    collection: (db) => {
       return db.model('business', schema, 'business');
    }

};


module.exports = {BusinessSchema}