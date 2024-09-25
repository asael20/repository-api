const {Router} = require('express');
const { MongoConnection } = require('../db/MongoConnection');
const { BusinessSchema } = require('../schemas/system/businessSchema');
const userSchema = require('../schemas/core/userSchema');
const { hashText } = require('../utils/auth');
const { SETTING_APP, PERMISSIONS } = require('../constant/databseSetting');


const ownerRouter = Router();


ownerRouter.post('/', async (req, res) => {

    const { id, firstName, lastName, password, phone, businessName, token  } = req.body;
    
    if(!id || !firstName || !lastName || !password || !phone || !businessName || !token){
        return res.status(400).json({message: 'Bad tada'});
    };
    
    
    try {

        const db = await MongoConnection.getDatabase(SETTING_APP.APP_DB_NAME);
        const  business = await BusinessSchema.collection(db).findOne({
            creationToken: token, 
            creationTokenStatus:'ACTIVE'
        }).lean();
    
        if(!business) {
            return res.status(403).json({mesage: 'Invalid Token'});
        };
    
        
        await BusinessSchema.collection(db).updateOne({_id:  business._id}, {
            name:businessName, 
            creationTokenStatus: 'EXPIRED' 
        });
    
        MongoConnection.setDatabse(businessName, business.dbName);
        const tenatDb = await MongoConnection.getDatabase(business.dbName);
        
        const hashedPassword = hashText(password);

        const doc = await userSchema.collection(tenatDb).create({
            id,
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            type: 'OWNER',

            permissions: PERMISSIONS
        });

        return res.status(201).json({message: 'Owner created'});

    } catch (error) {

        console.log(error);
        return res.status(500).json({message: 'Server Error, contact to Support'})
        
    };


});



module.exports = ownerRouter;
