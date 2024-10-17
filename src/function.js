const mongoose = require('mongoose');



const connect =mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

connect.then(() => {
    console.log("Connected correctly to user server");
}, (err) => { console.log("Could not connect"); });

// Define the schema
const taskSchema = new mongoose.Schema({
    date: String,
    task: String,
    status: String,
    });




// Create the model
const Tasks = mongoose.model('tasks', taskSchema);

module.exports = Tasks;