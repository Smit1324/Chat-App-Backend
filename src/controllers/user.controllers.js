const User = require("../models/user.model")

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    }
    catch (error) {
        throw new Error(error.message)
    }
}

const register = async (req, res) => {
    const { username, email, password,confirmPassword } = req.body

    if (!username || !email || !password) return res.status(400).json({ message: "Please fill all the credentials" })

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" })

    try {

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })

        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const avatar = req.file?.path

        await User.create({ username, avatar, email, password })

        return res.status(201).json({ message: "User created successfully" })

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    const { email, username, password } = req.body

    if (!email && !username) return res.status(400).json({ message: "Please fill all the credentials" })

    if (!password) return res.status(400).json({ message: "Please fill all the credentials" })

    try {

        const user = await User.findOne({ $or: [{ email }, { username }] })

        if (!user) return res.status(400).json({ message: "User does not exist" })

        const isPasswordCorrect = await user.isPasswordCorrect(password)

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "User logged in successfully",
                    user: loggedInUser, accessToken: accessToken,
                    refreshToken: refreshToken
                }
            )

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    register,
    login
}