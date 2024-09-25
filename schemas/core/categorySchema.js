const mongoose = require('mongoose');


const schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique:true
    }

});


module.exports = {

    schema,
    collection: (db) => {
       return db.model('categories', schema, 'categories')
    }   
}