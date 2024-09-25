const express = require('express');
const cors = require('cors');
const { ApiRouter } = require('./routes');
const { MongoConnection } = require('./db/MongoConnection');
const { SETTING_APP } = require('./constant/databseSetting');



const app = express();

app.use(express.json())
app.use(cors());
app.use(ApiRouter);


(async function startServer(){
    await MongoConnection.getDatabase(SETTING_APP.APP_DB_NAME);
    app.listen(3000, () => {
        console.log('Server running');
    });

})();