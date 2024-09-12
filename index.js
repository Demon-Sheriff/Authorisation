const express = require('express');
const app = express();
const z = require('zod');

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

// see all users
app.get('/users', (req, res) => {

    const usersObject = Object.fromEntries(users);
    
    // Send the JSON response
    res.json(usersObject);
})

// signin route
app.post('/signin', (req, res) => {
    const body = req.body;
    username = body.username;
    password = body.password;

    if(users.has(username)){
        
        if(users.get(username).password === password){

            const newToken = generateToken();
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
})

// signup route
app.post('/signup', (req, res) => {

    const body = req.body;
    username = body.username;
    password = body.password;

    if(users.has(username)){
        res.json("User already exists");
    }
    else{
        const newToken = generateToken();
        users.set(username, {password, newToken});
        console.log(users);

        res.json({
            userToken : newToken,
            message :  `Sign-in successful for user ${username}`
        })
    }
})

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})