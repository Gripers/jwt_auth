const { Router } = require('express');
const router = Router();

const {
  getUsers,
  registerController,
  loginController,
  deleteUser,
} = require('../controllers/authController');

router.get('/users', getUsers);
router.post('/register', registerController);
router.post('/login', loginController);
router.delete('/users/:_id', deleteUser);

module.exports = router;
