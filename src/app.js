const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors(
    {
        origin: `${process.env.CLIENT_URL}`,
        credentials: true
    }
));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.listen(process.env.PORT, () => {
    console.log(`⚙️ Server is running on port ${process.env.PORT}`);
});