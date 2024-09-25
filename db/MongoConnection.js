const { connectDB } = require(".");
const { SETTING_APP } = require("../constant/databseSetting");





class MongoConnection {

    static #connection = null;

    static #businesDbs = [
        {
            businessName: SETTING_APP.APP_NAME,
            dbName: SETTING_APP.APP_DB_NAME
        }
    ]


    static async getDatabase (databseName){
        
        if(!this.#connection) {
            console.log('-----> Creando connection');
          this.#connection = await  connectDB();
        };
       
        return this.#connection.useDb(databseName);
    };

    static setDatabse(businessName, dbName) {
        this.#businesDbs.push({businessName, dbName})
    };


    static getDatabseBusinessConfig(businessName){
        const config = this.#businesDbs.find((item) => item.businessName.toUpperCase() === businessName.toUpperCase());
        return config;
    };


};

module.exports = {MongoConnection};
