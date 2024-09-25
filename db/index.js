const mongoose = require('mongoose');

const db_username = 'devuser';
const db_password = '9oy44S26WNoVo7Vp';






module.exports = {
    async connectDB() {

        const connection = await mongoose.createConnection(`mongodb+srv://${db_username}:${db_password}@cluster0.h84qz.mongodb.net`);
        return connection;

    },
}