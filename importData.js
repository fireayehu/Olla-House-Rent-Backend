const fs = require('fs');
const mongoose = require('mongoose');
const House = require('./src/models/houseModel');
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });


mongoose.connect(process.env.LOCAL_DB_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,

    }).then(conn => {
        console.log("Database connected!")
    }).catch(e => console.log("Database connection error!"));

const file = JSON.parse(fs.readFileSync(`${__dirname}/dummyJson.json`, 'utf-8'));

const populateHouse = async () => {
    try {
        await House.create(file);
        console.log("house data inserted!");
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

const deleteHouse = async () => {
    try {
        await House.deleteMany();
        console.log("house data deleted!");
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] == "--import") {
    populateHouse();
} else if (process.argv[2] == "--delete") {
    deleteHouse();
}
