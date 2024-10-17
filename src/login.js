const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/');

connect.then(() => {
    console.log("Connected correctly to login server");
}, (err) => { console.log("Could not connect"); });

// Define the schema
const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});




// Create the model
const Login = mongoose.model('users', loginSchema);

module.exports = Login;