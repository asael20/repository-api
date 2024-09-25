const {Router} = require('express');
const ApiRouter = Router();



ApiRouter.use('/owners', require('./ownerRoute'));
ApiRouter.use('/credits', require('./creditRoute'));
ApiRouter.use('/customers', require('./customerRoute'));
ApiRouter.use('/business', require('./businessRoute'));


module.exports = {
    ApiRouter
}