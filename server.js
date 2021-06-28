const express = require("express");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const mainRouter = require("./src/index");

dotenv.config();

const app = express();
app.use(express.json());

/** connect to database */
mongodb.connect(process.env.LOCAL_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(r => {
        console.log("Database connected!")
    }).catch(e => console.log("Database connection error!"));

app.use('/api/v1', mainRouter);

const PORT = process.env.PORT || 5440;
app.listen(PORT, () => {
    console.log(`server listening on port : ${PORT}`);
});

module.exports = app;