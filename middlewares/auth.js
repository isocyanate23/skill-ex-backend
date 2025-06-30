const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({ message: 'Authentication required'});
    }

    try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
        const user = await User.findById(decodedAccessToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }

        req.user = {
            id: user._id, 
            role: user.role, 
            username: user.username,
            name: user.name,
            email: user.email,
            age: user.age,
            phone_number: user.phone_number,
            skills: user.skills,
            personal_description: user.personal_description,
            working_professional: user.working_professional,
            area_expertise: user.area_expertise,
            work_experience: user.work_experience
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token has expired'});
        }
        res.status(401).json({ message: 'Invalid Access token' });
    }
};

const refreshTokenHandler = async (req, res) => {
    const refreshToken = req.headers['authorization']?.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token Not Found' });
    }

    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const user = await User.findById(decodedRefreshToken.userId);

        const accessToken = jwt.sign(
            { userId: decodedRefreshToken.userId },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: decodedRefreshToken.userId },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: '30d' },
        );

        res.status(201).json({message: 'New Tokens Created', accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        if ( error.name === 'TokenExpiredError' ) {
            return res.status(401).json({ message: 'Refresh token Expired' });
        }

        res.status(401).json({ message: error.name });
    }

};

module.exports = { authenticate, refreshTokenHandler };