const dotenv = require("dotenv");

dotenv.config(
    {
        path: "./.env"
    }
);

require("./db/conn")