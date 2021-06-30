const mongoose = require('mongoose');
const dotenv = require("dotenv");
const app = require('./src/app');

dotenv.config({ path: './.env' });


/** connect to database */
const DB_REMOTE = process.env.REMOTE_DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(process.env.LOCAL_DB_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,

    }).then(conn => {
        console.log("Database connected!")
    }).catch(e => console.log("Database connection error!"));


const PORT = process.env.PORT || 5440;

app.listen(PORT, () => {
    console.log(`server listening on port : ${PORT}`);
});
