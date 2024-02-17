const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: `${process.env.CLIENT_URL}`
    }
));

app.listen(process.env.PORT, () => {
    console.log(`⚙️ Server is running on port ${process.env.PORT}`);
});