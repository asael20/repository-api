const mongoose = require('mongoose');


const schema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,

    },

    type: {
        type: String,
        enum: ['OWNER', 'EMPLOYEE']
    },


    password:{
        type: String,
        required:true,
    },


    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE']
    }, 

    permissions:{
        type: [{
            code:{
                type: String,
                required: true,
                unique: true
            },

            description: {
                type: String,
                required: true
            }
        }]
    }



});


module.exports = {

    schema,
    collection: (db) => {
       return db.model('users', schema, 'users')
    }   
}