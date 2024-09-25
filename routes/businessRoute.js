const {Router} = require('express');
const userSchema = require('../schemas/core/userSchema');
const { genrateUserToken, checkPassword } = require('../utils/auth');
const { businessCheckingMiddleware, verifyUserTokenMiddleware } = require('../middlewares/authMiddlewares');
const productSchema = require('../schemas/core/productSchema');
const categorySchema = require('../schemas/core/categorySchema');
const { BusinessSchema } = require('../schemas/system/businessSchema');
const { MongoConnection } = require('../db/MongoConnection');
const { SETTING_APP } = require('../constant/databseSetting');
const saleSchema = require('../schemas/core/saleSchema');

const businessRouter = Router();


businessRouter.post('/:businessName/signin', businessCheckingMiddleware , async (req, res) => {
    let { userId, password } = req.body;
    console.log('UserId: ', userId, ' password: ', password);

    try {
        
        if(!userId || !password ) {
            return  res.status(400).json({message: 'Bad data'});
        };
        userId = parseInt(userId);
        const user = await userSchema.collection(req.db).findOne({id: userId }).lean();

        if(!user || !checkPassword(password, user.password)) {
            return res.status(403).json({message: 'Invalid credentials'});
        };

        const userPayload = {
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.type
        };

        const token = genrateUserToken(userPayload);
        return res.status(200).json({token, user:userPayload});
    
    } catch (error) {

        return res.status(500).json({message: 'Server Error'})
    }

});

const Permisions = (permissions =[]) => {

    const middleware = async (req, res, next) => {
        const {user, db} = req;
        const userDoc = await userSchema.collection(db).findOne({id: user.userId});

        const allowed = userDoc.permissions
            .some(({code}) => code === permissions[0]);

        if(!allowed) {
            return res.status(403).json({message: 'you are not authorized to perform this action'})
        };

        next();
    };

    return middleware;
};

businessRouter.post('/:businessName/products', 
businessCheckingMiddleware,
verifyUserTokenMiddleware,
Permisions(['ADD_PRODUCT', ]), 
async (req, res) => {

    const { db, body } = req;

    if(!body.name || !body.description || !body.category, !body.price || !body.stock) {
        return res.status(400).json({message: 'Bad data'})
    }

    try {

        const categoryDoc = await categorySchema.collection(db).findOne({name: body.category.toUpperCase()}).lean();

        // if(!categoryDoc) {
        //     return res.status(400).json({message: 'Bad data, this category does not exist'});
        // };

        
        const doc = await productSchema.collection(db).create({
            name: body.name.toUpperCase(),
            description: body.description,
            category: categoryDoc ? categoryDoc._id.toString() : null,
            stock: parseInt(body.stock),
            minInStock: parseInt(body.minInStock),
            price: parseFloat(body.price)
        });
    
        res.status(201).json({message: 'Product created'});
    } catch (error) {
        
        console.log(error)
        return res.status(500).json({message: 'Server Error'});
    }
});

businessRouter.post('/:businessName/categories', 
businessCheckingMiddleware,
verifyUserTokenMiddleware,
Permisions(['ADD_CATEGORY', ]), 
async (req, res) => {

    const { db, body } = req;

    if( !body.name ) {
        return res.status(400).json({message: 'Bad data'})
    };

    try {
        const doc = await categorySchema.collection(db).create({
            name: body.name.toUpperCase()
        });
    
        res.status(201).json({message: 'Category crated'});
    } catch (error) {
        
        console.log(error)
        return res.status(500).json({message: 'Server Error'});
    }
});

businessRouter.get('/:businessName', async (req, res) => {

    const businessName = req.params.businessName || '';

    const db = await MongoConnection.getDatabase(SETTING_APP.APP_DB_NAME);
    const collection = BusinessSchema.collection(db);

    const business = await collection.findOne({name: businessName.toUpperCase()}).lean();


    if(!business) {
        return res.status(404).json({message: 'Business does not exist'})
    }

    return res.json({
        name: business.name

    })




});


businessRouter.get('/:businessName/products',
businessCheckingMiddleware,
verifyUserTokenMiddleware,
Permisions(['READ_PRODUCTS']),
async (req, res) => {

    try {
        const {db} = req;

    
        const products = await productSchema.collection(db).find().lean()
       
        res.json([...products]);
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Error'});
    }
});

businessRouter.get('/:businessName/products/search',
    businessCheckingMiddleware,
    verifyUserTokenMiddleware,
    Permisions(['READ_PRODUCTS']),
async (req, res) => {

    try {
        const {db, query} = req;

        if(!query.name) {
            return res.status(200).json([])
        };
  
        const filter = {
            name: query.name ?  {$regex: RegExp(query.name, 'i')} : undefined
        }
    
        const products = await productSchema.collection(db).find(filter).lean()
       
        res.json([...products]);
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server Error'});
    }
});





businessRouter.post('/:businessName/sales', 
    businessCheckingMiddleware,
    verifyUserTokenMiddleware,
    Permisions(['ADD_SALE', ]), 
async (req, res) => {

    const {body, db, user} = req;

    

    if(!body.total || body.total < 0 || !body.products || !body.products.length || !user) {
        return res.status(400).json({message: 'Bad data'})
    };

    try {

        const doc = await saleSchema.collection(db).create({
            products: body.products,
            responsable: user,
            total: body.total
    
        });
    
    
        console.log(user);
    
        return res.status(201).json({message: 'Sale registered successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Server Error, contact support'});
    }


 
});




module.exports = businessRouter;
