
var express = require('express'),
    userRouter = express.Router();

const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const contactController = require('../controllers/contact');


/**
* API keys and Passport configuration.
*/
const passportConfig = require('../config/passport');

/**
* Primary userRouter routes.
*/

userRouter.get('/', homeController.index);
userRouter.get('/login', userController.getLogin);
userRouter.post('/login', userController.postLogin);

userRouter.get('/logout', userController.logout);
userRouter.get('/forgot', userController.getForgot);

userRouter.post('/forgot', userController.postForgot);
userRouter.get('/reset/:token', userController.getReset);
userRouter.post('/reset/:token', userController.postReset);

userRouter.get('/signup', userController.getSignup);
userRouter.post('/signup', userController.postSignup);

userRouter.get('/contact', contactController.getContact);
userRouter.post('/contact', contactController.postContact);

userRouter.get('/account', passportConfig.isAuthenticated, userController.getAccount);

userRouter.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
userRouter.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
userRouter.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);

userRouter.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

userRouter.get('/user/photos',passportConfig.isAuthenticated,userController.getUserMedias);
userRouter.get('/user/details',userController.userDetail);
userRouter.post('/user/postPhotosToBlog',passportConfig.isAuthenticated,userController.postPhotostoBlog);
userRouter.get('/user/blogPhotos',userController.getUserBlogPhotos);



module.exports = userRouter;