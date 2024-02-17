const router = require("express").Router();
const upload = require("../middlewares/multer.middleware")

const { register, login } = require("../controllers/user.controllers")

router.post("/register",
    upload.single("avatar"),
    register
)
router.post("/login", login)

module.exports = router;