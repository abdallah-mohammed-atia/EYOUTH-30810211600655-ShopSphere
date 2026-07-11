const { User } = require('../models');
const { signToken } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Only allow 'admin' role via explicit seeding/promotion, not public self-registration,
    // unless explicitly permitted (kept simple here for capstone scope).
    const safeRole = role === 'admin' ? 'admin' : 'customer';

    const user = await User.create({ name, email, password, role: safeRole });
    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, role: user.role });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({ user: req.user });
}

module.exports = { register, login, getCurrentUser };
