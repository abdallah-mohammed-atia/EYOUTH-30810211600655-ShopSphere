const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { getMongoDb } = require('../lib/mongo');
const { sendWelcomeEmail } = require('../utils/mail');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const normalizedRole = role === 'admin' ? 'admin' : 'customer';
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: normalizedRole,
      },
    });

    const token = signToken({ id: user.id, role: user.role });

    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection('activity').insertOne({
          type: 'user.registered',
          userId: user.id,
          message: `${user.name} registered`,
          createdAt: new Date(),
        });
      }
    } catch (mongoErr) {
      // Ignore Mongo logging failures so core auth flows still succeed.
    }

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailErr) {
      console.warn('Welcome email unavailable:', mailErr.message);
    }

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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, role: user.role });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({ user: req.user });
}

async function updateCurrentUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'At least one field is required.' });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Check for uniqueness if email is changing
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }
    }

    const user = await prisma.user.update({ where: { id: req.user.id }, data: updates });

    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getCurrentUser, updateCurrentUser };