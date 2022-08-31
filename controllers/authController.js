const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find()
    .then(() => res.status(200).json(users))
    .catch(() =>
      res.status(500).json({ message: 'Ошибка с сервером попробуйте позже' })
    );
};

const registerController = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({ email });

  if (existUser) {
    return res
      .status(400)
      .json({ message: 'Пользователь с таким email уже существует' });
  } else if (password.length < 5) {
    return res.status(400).json({
      message: 'Пароль должен содержать как минимум 5 символов',
    });
  } else {
    const hashedPass = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email: email,
      password: hashedPass,
    });

    const user = await newUser.save();

    res.status(201).json(user);
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const compare = bcrypt.compareSync(password, user.password);

    if (compare) {
      const token = jwt.sign({ email }, 'secret_enc', {
        expiresIn: '24h',
      });

      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: 'Неверные данные' });
    }
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params._id)
    .then(() =>
      res
        .status(200)
        .json({ message: `Пользователь ${req.params._id} успешно удален` })
    )
    .catch(() =>
      res.status(500).json({ message: 'Ошибка с сервером попробуйте позже' })
    );
};

module.exports = {
  getUsers,
  registerController,
  loginController,
  deleteUser,
};
