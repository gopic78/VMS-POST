const jwt = require('jsonwebtoken');
const secret = '12345';

module.exports = {
    signToken: function (user) {
        const token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '1d' });
        return token;
    },
    verifyToken: (req, res, next) => {
        console.log(req.headers["x-access-token"]);
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded; 
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                message: err.message
            });
        }
    }
};
