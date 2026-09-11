const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const BloodBank = require('../models/BloodBank');
const { generateToken } = require('../config/jwt');

const authController = {
  register: async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        bloodGroup,
        dob,
        gender,
        weight,
        state,
        district,
        city,
        pincode
      } = req.body;

      if (!name || !email || !password || !bloodGroup) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and blood group are required.'
        });
      }

      // Check existing email
      const existing = User.findByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: 'donor',
        phone
      });

      // Create initial donor profile
      const profile = DonorProfile.create({
        userId: user.id,
        name,
        bloodGroup,
        dob: dob || '',
        gender: gender || 'Not Specified',
        weight: Number(weight) || 60,
        state: state || 'Delhi',
        district: district || 'Central Delhi',
        city: city || 'New Delhi',
        pincode: pincode || '110001'
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        success: true,
        message: 'Donor account successfully registered with e-RaktKosh.',
        token,
        user: User.sanitize(user),
        profile
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const user = User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your email and password.'
        });
      }

      // Role check if specified
      if (role && user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `Account is registered as ${user.role}. Please select the correct login portal.`
        });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your email and password.'
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      let profile = null;
      let bloodBank = null;

      if (user.role === 'donor') {
        profile = DonorProfile.findByUserId(user.id);
      } else if (user.role === 'admin' && user.bloodBankId) {
        bloodBank = BloodBank.findById(user.bloodBankId);
      }

      res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: User.sanitize(user),
        profile,
        bloodBank
      });
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req, res, next) => {
    try {
      const user = req.user;
      let profile = null;
      let bloodBank = null;

      if (user.role === 'donor') {
        profile = DonorProfile.findByUserId(user.id);
      } else if (user.role === 'admin' && user.bloodBankId) {
        bloodBank = BloodBank.findById(user.bloodBankId);
      }

      res.json({
        success: true,
        user,
        profile,
        bloodBank
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
