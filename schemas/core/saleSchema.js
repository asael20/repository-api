const mongoose = require('mongoose');


const schema = new mongoose.Schema({

    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },

    responsable: {
        type: {
            firstName: String,
            lastName: String,
            userId: Number
        },
        required: true
    },

    products: {
        type: Array,
        required: true
    },

    total: {
        type: Number,
        required: true
    }


});


module.exports = {

    schema,
    collection: (db) => {
       return db.model('sales', schema, 'sales')
    }   
}