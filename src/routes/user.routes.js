const router = require("express").Router();
const upload = require("../middlewares/multer.middleware")

const { register, login, logout } = require("../controllers/user.controllers")
const verifyJWT = require("../middlewares/auth.middleware")

router.post("/register",
    upload.single("avatar"),
    register
)
router.post("/login", login)
router.post("/logout", verifyJWT, logout)

module.exports = router;