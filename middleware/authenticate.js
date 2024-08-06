const User = require("../models/authmodel")
jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const authorisation = req.headers.authorization;
    if (!authorisation || !authorisation.startsWith("Bearer ")) {
        throw new Error("Unathenticated")
    }
    const token = authorisation.split(' ')[1];

    try {
        const match = jwt.verify(token, process.env.JWT_SECRET);
        req.User = { UserID : match.UserID, name: match.name };
        next();
    }
    catch (err) {
        throw new Error(`${err}`)
    }
}

module.exports = authMiddleware;