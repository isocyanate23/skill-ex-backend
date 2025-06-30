const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


/*
TODO: Create new refresh token when refresh token used
*/
const register = async (req, res, next) => {
    const { 
        username, email, password, phone_number, name, skills, age,
        personal_description, working_professional, area_expertise, 
        work_experience
    } = req.body;

    try {
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }]});
        if (existingUser) {
            return res.status(400).json({ error: "Email or username already in use" });
        }

        const user = new User({ 
            username, 
            email,
            password, 
            phone_number, 
            name, 
            skills,
            age, 
            personal_description, 
            working_professional, 
            area_expertise: working_professional ? area_expertise:null,
            work_experience: working_professional ? work_experience: null
        });
        await user.save();

        // generating jwt for immediate logging in:
        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: '30d'
        });

        res.status(201).json({ message: "Registration successful", accessToken, refreshToken });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found!'});
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        
        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: '30d'
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: '30d'
        });
        

        res.status(201).json({ message:'Login Successful', accessToken, refreshToken });
    } catch(error) {
        next(error);
    }
};

module.exports = { register, login };