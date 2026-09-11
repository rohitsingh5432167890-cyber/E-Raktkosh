const DonorProfile = require('../models/DonorProfile');
const DonationCamp = require('../models/DonationCamp');
const { generateQRCode } = require('../utils/qrGenerator');

const donorController = {
  getProfile: async (req, res, next) => {
    try {
      const profile = DonorProfile.findByUserId(req.user.id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Donor profile not found.'
        });
      }

      res.json({
        success: true,
        profile
      });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updated = DonorProfile.update(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully.',
        profile: updated
      });
    } catch (err) {
      next(err);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const history = DonorProfile.getHistory(req.user.id);
      res.json({
        success: true,
        history
      });
    } catch (err) {
      next(err);
    }
  },

  getDigitalPass: async (req, res, next) => {
    try {
      const profile = DonorProfile.findByUserId(req.user.id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Donor profile not found.'
        });
      }

      const passPayload = {
        title: 'MoHFW e-RaktKosh Verified Donor Pass',
        donorId: req.user.id,
        name: req.user.name,
        bloodGroup: profile.bloodGroup,
        eligibility: profile.eligibility.isEligible ? 'ELIGIBLE_TO_DONATE' : 'DEFERRED_TEMPORARY',
        nextEligibleDate: profile.eligibility.nextEligibleDate,
        totalDonations: profile.totalDonations,
        badge: profile.badgeLevel,
        state: profile.state,
        issuedAt: new Date().toISOString(),
        verifyPortal: 'https://eraktkosh.in/verify-pass/' + req.user.id
      };

      const qrCodeDataUrl = await generateQRCode(passPayload);

      res.json({
        success: true,
        pass: {
          ...passPayload,
          qrCode: qrCodeDataUrl
        }
      });
    } catch (err) {
      next(err);
    }
  },

  registerForCamp: async (req, res, next) => {
    try {
      const { campId } = req.params;
      const camp = DonationCamp.findById(campId);
      if (!camp) {
        return res.status(404).json({
          success: false,
          message: 'Donation camp not found.'
        });
      }

      // Add to camp
      DonationCamp.registerDonor(campId, req.user.id);

      // Add to donor profile registered camps
      const profile = DonorProfile.findByUserId(req.user.id);
      const registeredCamps = profile.registeredCamps || [];
      if (!registeredCamps.includes(campId)) {
        registeredCamps.push(campId);
        DonorProfile.update(req.user.id, { registeredCamps });
      }

      res.json({
        success: true,
        message: `Successfully registered for "${camp.name}". Slot confirmed!`,
        camp: DonationCamp.findById(campId)
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = donorController;
