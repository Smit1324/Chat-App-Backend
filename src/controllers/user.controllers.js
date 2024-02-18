const User = require("../models/user.model")
const uploadOnCloudinary = require("../utils/cloudinary")

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
    const { username, fullName, email, password, confirmPassword } = req.body

    if (!username || !fullName || !email || !password) return res.status(400).json({ message: "Please fill all the credentials" })

    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" })

    try {

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })

        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const avatarLocalPath = req.file?.path

        if (avatarLocalPath) {

            const avatar = await uploadOnCloudinary(avatarLocalPath)

            if (!avatar) return res.status(500).json({ message: "Failed to upload avatar" })

            await User.create({ username, fullName, avatar, email, password })

            return res.status(201).json({ message: "User created successfully" })

        }

        await User.create({ username, fullName, email, password })

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

const logout = async (req, res) => {
    try {

        await User.findByIdAndUpdate(
            req.user?._id,
            {

                $unset: {
                    refreshToken: 1
                }

            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" })

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    register,
    login,
    logout
}