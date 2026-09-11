const BloodBank = require('../models/BloodBank');
const Stock = require('../models/Stock');
const DonationCamp = require('../models/DonationCamp');
const EmergencyRequest = require('../models/EmergencyRequest');
const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');
const { createCertificatePayload } = require('../utils/certificateHelper');

const adminController = {
  getDashboard: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const bloodBank = BloodBank.findById(bloodBankId);
      if (!bloodBank) {
        return res.status(404).json({
          success: false,
          message: 'Blood bank facility not found.'
        });
      }

      const stocks = Stock.getMatrixForBank(bloodBankId);
      const totalUnits = stocks.reduce((acc, curr) => acc + (curr.units || 0), 0);
      const lowStockAlerts = stocks.filter(s => s.isLow);

      const camps = DonationCamp.find({ bloodBankId });
      const emergencyRequests = EmergencyRequest.find({
        state: bloodBank.state,
        status: 'OPEN'
      });

      res.json({
        success: true,
        bloodBank,
        metrics: {
          totalUnits,
          lowStockCount: lowStockAlerts.length,
          upcomingCampsCount: camps.filter(c => c.status === 'UPCOMING').length,
          pendingEmergencyCount: emergencyRequests.length
        },
        lowStockAlerts,
        upcomingCamps: camps.slice(0, 5),
        urgentRequests: emergencyRequests.slice(0, 5)
      });
    } catch (err) {
      next(err);
    }
  },

  getStock: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const stocks = Stock.getMatrixForBank(bloodBankId);
      res.json({
        success: true,
        stocks
      });
    } catch (err) {
      next(err);
    }
  },

  updateStock: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const { bloodGroup, component, delta, units } = req.body;

      if (!bloodGroup || !component) {
        return res.status(400).json({
          success: false,
          message: 'Blood group and component are required.'
        });
      }

      let updated;
      if (units !== undefined) {
        // Direct set
        updated = Stock.setStock(bloodBankId, bloodGroup, component, Number(units));
      } else if (delta !== undefined) {
        // Delta adjustment (+1, -1, +5, etc)
        updated = Stock.updateUnits(bloodBankId, bloodGroup, component, Number(delta), false);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Either units or delta must be provided.'
        });
      }

      res.json({
        success: true,
        message: `Inventory updated for ${bloodGroup} (${component}). New units: ${updated.units}`,
        stock: updated
      });
    } catch (err) {
      next(err);
    }
  },

  verifyDonation: async (req, res, next) => {
    try {
      const { donorIdentifier, bloodGroup, component = 'Whole Blood', units = 1 } = req.body;
      const bloodBankId = req.user.bloodBankId;
      const bloodBank = BloodBank.findById(bloodBankId);

      if (!donorIdentifier) {
        return res.status(400).json({
          success: false,
          message: 'Donor ID or email address is required.'
        });
      }

      // Find donor by ID or email
      let donor = User.findById(donorIdentifier);
      if (!donor) {
        donor = User.findByEmail(donorIdentifier);
      }

      if (!donor || donor.role !== 'donor') {
        return res.status(404).json({
          success: false,
          message: 'Registered donor could not be found with this identifier.'
        });
      }

      const certData = await createCertificatePayload({
        donorName: donor.name,
        donorId: donor.id,
        bloodGroup: bloodGroup || 'O+',
        bloodBankName: bloodBank ? bloodBank.name : 'Central Blood Bank',
        component,
        donationDate: new Date().toISOString().split('T')[0],
        verifiedBy: req.user.name
      });

      // Record in history
      const historyRecord = DonorProfile.recordDonation({
        donorId: donor.id,
        bloodBankId,
        bloodBankName: bloodBank ? bloodBank.name : 'Central Blood Bank',
        bloodGroup: bloodGroup || 'O+',
        component,
        unitsDonated: Number(units) || 1,
        donationDate: new Date().toISOString().split('T')[0],
        certificateId: certData.certificateId,
        verifiedBy: req.user.name
      });

      // Increment inventory
      Stock.updateUnits(bloodBankId, bloodGroup || 'O+', component, Number(units) || 1, false);

      res.status(201).json({
        success: true,
        message: `Donation successfully recorded and verified for ${donor.name}!`,
        historyRecord,
        certificate: certData
      });
    } catch (err) {
      next(err);
    }
  },

  getEmergencyRequests: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const bloodBank = BloodBank.findById(bloodBankId);
      const requests = EmergencyRequest.find({
        state: bloodBank ? bloodBank.state : undefined
      });
      res.json({
        success: true,
        requests
      });
    } catch (err) {
      next(err);
    }
  },

  fulfillEmergency: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { unitsFulfilled = 1, notes, deductStock = true } = req.body;
      const bloodBankId = req.user.bloodBankId;

      const request = EmergencyRequest.findById(id);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Emergency request not found.'
        });
      }

      if (deductStock) {
        Stock.updateUnits(bloodBankId, request.bloodGroup, request.component, -Math.abs(unitsFulfilled), false);
      }

      const updated = EmergencyRequest.updateFulfillment(
        id,
        Number(unitsFulfilled),
        notes || `Dispatched by ${req.user.name}`
      );

      res.json({
        success: true,
        message: `Dispatched ${unitsFulfilled} unit(s) of ${request.bloodGroup} ${request.component}. Status: ${updated.status}`,
        request: updated
      });
    } catch (err) {
      next(err);
    }
  },

  getCamps: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const camps = DonationCamp.find({ bloodBankId });
      res.json({
        success: true,
        camps
      });
    } catch (err) {
      next(err);
    }
  },

  createCamp: async (req, res, next) => {
    try {
      const bloodBankId = req.user.bloodBankId;
      const bloodBank = BloodBank.findById(bloodBankId);

      const {
        name,
        organizer,
        venue,
        startDate,
        endDate,
        timeSlot,
        contactPerson,
        contactPhone,
        targetUnits
      } = req.body;

      if (!name || !venue || !startDate) {
        return res.status(400).json({
          success: false,
          message: 'Camp name, venue, and start date are required.'
        });
      }

      const newCamp = DonationCamp.create({
        name,
        organizer: organizer || (bloodBank ? bloodBank.name : 'Health Center'),
        bloodBankId,
        bloodBankName: bloodBank ? bloodBank.name : 'Central Blood Bank',
        state: bloodBank ? bloodBank.state : 'Delhi',
        district: bloodBank ? bloodBank.district : 'Central Delhi',
        venue,
        startDate,
        endDate: endDate || startDate,
        timeSlot: timeSlot || '09:00 AM - 05:00 PM',
        contactPerson: contactPerson || req.user.name,
        contactPhone: contactPhone || req.user.phone,
        targetUnits: Number(targetUnits) || 150
      });

      res.status(201).json({
        success: true,
        message: 'New donation camp drive scheduled successfully.',
        camp: newCamp
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
