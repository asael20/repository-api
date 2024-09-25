const mongoose = require('mongoose');


const schema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        require: true,
        default : 0
    },

    stock: {
        type: Number,
        required: true,
        default: 0,

    },

    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: false,
    },

    minInStock: {
        type: String,
        default: 1
    },

    status: {
        type: String,
        emun: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },

    createdAt: {
        type: Date,
        default: new Date()
    }


});


module.exports = {

    schema,
    collection: (db) => {
       return db.model('products', schema, 'products')
    }   
}