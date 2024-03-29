const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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
app.use(cookieParser())

const userRoutes = require("./routes/user.routes");

app.use("/api/v1/user", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`⚙️ Server is running on port ${process.env.PORT}`);
});