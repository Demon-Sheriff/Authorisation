const express = require('express');
const app = express();
const z = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Define your secret

const port = process.env.PORT || 3000;

let users = new Map();
app.use(express.json());

const generateToken = () => {

    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    
    for (let i = 0; i < chars.length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    
    return token;
}

// logger middleware
const logger = (req, res, next) => {
    const method = req.method;
    const date = new Date();

    console.log(`${method} request made at date ${date.toLocaleDateString()} and time ${date.toLocaleTimeString()}`)
    next();
}

// auth middleware.
const auth = (req, res, next) => {

    const token = req.headers.token;
    const decodedInfo = jwt.verify(token, JWT_SECRET);

    // if the username is valid.
    if(decodedInfo.username){
        req.username = decodedInfo.username;
        next(); // call the next middleware.
    }
    else{
        res.json({
            message : "You are not logged in, Please login first."
        })
    }
}

app.use(logger);

// see all users
app.get('/users', (req, res) => {

    const usersObject = Object.fromEntries(users);
    res.json(usersObject);
})

// see the user info
app.get('/me', auth, (req, res) => {

    // const userName = decodedInfo.username; 

    if(users.has(req.username)){
        res.json({
            username : req.username,
            userPassWord : users.get(req.username)
        });
    }
    else{
        res.json({
            message : "User name not found please sign up first !"
        })
    }

    // We dont need to hit our database now.
    // for(let key in Object.entries(users)){

    //     if(key.token === token){
    //         foundUser = key;
    //         break;
    //     }
    // }

    // if(foundUser){
    //     res.json(users.get[foundUser]);
    // }
})

// signin route
app.post('/signin', (req, res) => {

    const body = req.body;
    username = body.username;
    password = body.password;

    if(users.has(username)){
        
        if(users.get(username).password === password){

            const newToken = jwt.sign({
                username: username
            }, JWT_SECRET); // sign the user or generate their jwt.

            res.json({
                token : newToken,
                message : "Sign-in Successful"
            })
        }
        else{
            
            res.status(403).send({
                message: "Invalid username or password"
            })
        }
    }
    else{
        res.json({
            message : "User does not exist, please sign-up first."
        })
    }
});

// signup route
app.post('/signup', (req, res) => {

    const body = req.body;
    username = body.username;
    password = body.password;

    if(users.has(username)){
        res.json("User already exists");
    }
    else{
        // const newToken = generateToken();
        users.set(username, {password});
        console.log(users);

        res.json({
            // userToken : newToken,
            message :  `Sign-in successful for user ${username}`
        })
    }
})

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})