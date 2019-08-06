const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("a");
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        next();
    }
    catch (error) {
        console.log(req.headers.authorization);
        return res.status(404).json({
            message: 'Auth failed'
        });
    }
};