const { Users } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: (email) => {
    return Users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findById: (id) => {
    return Users.findOne(u => u.id === id);
  },

  create: async ({ name, email, password, role = 'donor', phone, bloodBankId = null }) => {
    const existing = User.findByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      bloodBankId,
      createdAt: new Date().toISOString()
    };

    return Users.insert(newUser);
  },

  comparePassword: async (candidatePassword, hashedPassword) => {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  sanitize: (user) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
};

module.exports = User;
