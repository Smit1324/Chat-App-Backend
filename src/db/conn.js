const mongoose = require('mongoose');

const DB_NAME = require('../constants');

mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
    .then(() => {
        console.log("CONNECTION SUCCESSFUL");
        require('../app');
    }
    )
    .catch((err) => {
        console.log(`CONNECTION FAILED : ${err}`);
    }
    )