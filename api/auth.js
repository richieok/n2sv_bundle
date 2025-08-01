import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { DB_URI } from './initDB.js'
import { User } from './models/user.js'

mongoose.set('strictQuery', false)

export const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
        // return res.redirect('/login') // Redirect to login if no token is provided
    }
    try {

        console.log("Pre verify");
        // Add this debug line temporarily
        // console.log("JWT_SECRET:", JWT_SECRET ? "defined" : "undefined");
        // console.log("JWT_SECRET length:", JWT_SECRET?.length);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Post verify");
        // console.log(decoded);

        req.user = { username: decoded.username, email: decoded.email }
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' })
        // return res.redirect('/login')
    }
}

export const login = async (req, res) => {
    let { username, password } = req.body

    try {
        await mongoose.connect(DB_URI)

        const user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        }).select('+password')

        if (!user) {
            return res.status(400).json({ status: "error", message: "User not found." });
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // console.log("User logged in:", user.toJSON());

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            status: "success",
            message: "User logged in successfully.",
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            token
        })

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const registerUser = async (req, res) => {
    let { username, firstName, lastName, email, password } = req.body
    // console.log({ username, firstName, lastName, email, password });

    try {
        // Validate input
        if (!username || !firstName || !lastName || !email || !password) {
            return res.status(400).json({ status: "error", message: "All fields are required." });
        }
        await mongoose.connect(DB_URI)

        const existingUser = await User.findOne({
            email: email
        })

        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already exists." });
        }

        // Create new user
        const newUser = new User({
            username,
            firstName,
            lastName,
            email,
            password
        });

        const verificationToken = newUser.generateVerificationToken()
        await newUser.save()
        console.log("New user created:", newUser)
        res.json({
            status: "success",
            message: "User registered successfully.",
            user: newUser,
            verificationToken: verificationToken
        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}