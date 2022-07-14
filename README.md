# User-Authentication--Iraitech
A user authentication system using nodejs, expressjs, mongodb

# Features
- A user can register / login and make a profile.
- Only the logged in user is allowed to make changes to the profile / edit profile.
- The user can add a profile picture too.
- Sessions are maintained with every login activity by the user.
- A public api has been created to show all the users registerd in the database.

# Tech Stack Used
- Node JS
- Express JS
- MongoDB

# NPM Packages used
- bcrypt            : To encrypt the passwords into hash form.
- body-parser       : To tap into the data over post reqeusts.
- ejs               : Embedded JavaScript Templates, as a templating engine.
- express-session   : To maintain the sessions for login activity by the users.
- jsonwebtoken      : For securely transmitting information JSON objects.
- mongoose          : To Connect the web-framework ( express ) and database ( mongoDB ).
- multer            : For file uploads
