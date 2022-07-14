const express = require('express');
const user_route = express();

const session = require("express-session");
const config = require('../config/config');
user_route.use(session({secret : config.sessionSecret}));
const auth = require('../middleware/auth');

// Setting ejs templating engine 
user_route.set('view engine','ejs');     

// Body parser to tap into any data posted through a Post Request.
const bodyParser = require('body-parser');
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use(bodyParser.json());


// Setting the server to get access to the (local)static files
user_route.use(express.static('public'));

// Multer for file uploads 
const multer = require('multer');
const path = require('path');


// --------------------Multer configurations-------------------------

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));

    },
    filename : function(req, file, cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload =  multer({storage : storage});

//--------------------------------------------------------------------

const userController = require("../controllers/userController");


//---------ROUTES-------------------    

user_route.get("/signup", auth.isLogout, userController.loadRegister);
user_route.post("/signup", upload.single('image'), userController.addUser);

user_route.get('/login', auth.isLogout, userController.loadLogin);
user_route.post('/login', userController.verifyLogin);

user_route.get('/', auth.isLogout, userController.loadRoot);

user_route.get('/home',auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

user_route.get('/edit', auth.isLogin, userController.editProfile);

user_route.get('/allUsers', userController.showUsers);





module.exports = user_route;