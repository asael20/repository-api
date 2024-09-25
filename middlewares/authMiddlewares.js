const { SETTING_APP } = require("../constant/databseSetting");
const { MongoConnection } = require("../db/MongoConnection");
const { BusinessSchema } = require("../schemas/system/businessSchema");
const { verifyUserToken } = require("../utils/auth");


async function businessCheckingMiddleware(req, res, next) {
    const { businessName } = req.params;

    const config = MongoConnection.getDatabseBusinessConfig(businessName)

    if(config) {
        req.db = await MongoConnection.getDatabase(config.dbName);
        return next();
    };

    const appDb = await MongoConnection.getDatabase(SETTING_APP.APP_DB_NAME);
    const business = await BusinessSchema.collection(appDb).findOne({ name: businessName });

    if(!business){ 
        return res.status(404).json({message: 'This business does not exist'});
    };

    MongoConnection.setDatabse(business.name, business.dbName);
    req.db = await MongoConnection.getDatabase(business.dbName);

    return next();
};


function verifyUserTokenMiddleware(req, res, next) {

    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(403).json({message: 'Unauthenticated'})
    }

    const [_, token] = authorization.split(' ');

    try {
        const user = verifyUserToken(token);
        req.user = user;
        next();
        
    } catch (error) {
        

        switch (error.name) {
            case 'TokenExpiredError':
                 res.status(403).json({message: 'Expired Token'});
                break;
        
            default:
                console.log(error);
                res.status(500).json({message: 'Server error contact support'})
                break;
        }
    }

}





module.exports = {
    businessCheckingMiddleware,
    verifyUserTokenMiddleware
}