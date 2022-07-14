const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const config = require('../config/config');


//------  Funtion to encrypt the password ( convert to hash form) -------

const encryptPassword = async(password) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10) ;   // salt value '10'
        return hashedPassword;
    }
    catch(error){
        console.log(error.message);
    }
}

// ------ Function to generate the token for the user authenticated / verified -------
const createToken = async(user_id, secret_key) => {
    const myToken = await jwt.sign({ _id : user_id}, secret_key );
    return myToken;
}

// -------- Loads the signup page ------------

const loadRegister = async(req, res) => {
    try {

        res.render('signup');

    }catch(error) {
        console.log(error.message);
    }
}


// ---------- Adding the new user / registeration to the database ( MonogDB ) ---------

const addUser = async(req, res) => {
    try {
        const en_password = await encryptPassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : en_password,
            image : req.file.filename,
            mobile : req.body.mobile,
        });

        const userData = await user.save();

        if(userData){
          
            res.render('signup', {message: "User added successfully !"});
        }else{
            res.render('signup', {message: "Registeration failed !"});

        }

    } catch (error){
        console.log(error.message);

    }
}

// ----------- Loads the login page ----------------

const loadLogin =  async(req, res) => {
    try{
        res.render('login')
    }
    catch(error){

    }
}

// --------- Check the user's credentials against the database -------

const verifyLogin = async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email : email});

        if(userData){

            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                req.session.user_id = userData._id; 

                // Jwt  generation
                createToken(userData._id, config.JWT_KEY);

                res.redirect('/home');
                
            }else{
                res.render('incorrectLogin');
            }

        }else{
            res.render('incorrectLogin');
        }
    }
    catch(error){
        console.log(error.message);

    }
}


// ---------- Loads the home page / " My profile " ---------------------

const loadHome =  async(req, res) => {
    try{
        const userData = await User.findById({_id : req.session.user_id});
        res.render('home', {userData});
    }
    catch(error){
        console.log(error.message);

    }
}

// -------------- Loads the root route / "/" -----------------

const loadRoot =  async(req, res) => {
    try{
        res.render('root');
    }
    catch(error){
        console.log(error.message);

    }
}

// ---------------- For user logging out --------------------

const userLogout =  async(req, res) => {
    try{
        req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        console.log(error.message);

    }
}


// ---------------- Checks if the user is allowed to edit the profile ----------

const editProfile =  async(req, res) => {
    try{
       const id = req.query.id;
       
       const userData = await User.findById({ _id : req.session.id});
       if(userData){
            res.render('editProfile', {userData:userData});
       }else{
            res.redirect('/home');
       }
    }
    catch(error){
        const id = req.query.id;
        
        const userData = await User.findById({_id : id});
        console.log(userData);

    }
}


// ----------- Allows the user to edit the profile ------------------------
const updateProfile =  async(req, res) => {
    try{
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id}, {$set:{ name : req.body.name, email : req.body.email, mobile : req.body.mobile, image: req.file.filename }})

        }else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id}, {$set:{ name : req.body.name, email : req.body.email, mobile : req.body.mobile }})
        }

        res.redirect('/home');
    }
    catch(error){
        console.log(error.message);

    }
}

// --------- Available for all, to see the list of all the users in the database ---------

const showUsers =  async(req, res) => {
    try{
        const usersData = await User.find();
        res.render('allUsers', {userData : usersData});

    }
    catch(error){
        console.log(error.message);

    }
}


// --------- Module to export -------

module.exports = {
    loadRegister,
    addUser,
    // verifymail,
    loadLogin,
    verifyLogin,
    loadHome,
    loadRoot,
    userLogout,
    editProfile,
    showUsers
}