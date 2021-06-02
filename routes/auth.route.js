const router = require('express').Router();
const user_controller = require('../controllers/user.controller');
const auth_middleware = require('../middlewares/auth.middlewares');


router.post('/register', user_controller.Register);
router.post('/login', user_controller.Login);
router.post('/token', auth_middleware.verifyRefreshToken, user_controller.GetAccessToken);
router.get('/logout', auth_middleware.verifyToken, user_controller.Logout);

module.exports = router;