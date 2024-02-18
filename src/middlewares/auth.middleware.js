const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const verifyJWT = async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) return res.status(401).json({ message: "Unauthorized Request" })

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) return res.status(401).json({ message: "Invalid Access Token" })

        req.user = user

        next()

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = verifyJWT