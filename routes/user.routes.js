const router = require('express').Router();
const auth_middleware = require('../middlewares/auth.middlewares');

router.post('/dashboard', auth_middleware.verifyToken, (req, res) => {
    return res.json({status: true, message: "Hello from Dashboard"});
});

module.exports = router;