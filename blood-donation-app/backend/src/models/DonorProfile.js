const { DonorProfiles, DonationHistory } = require('../config/db');

const calculateEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleDate: new Date().toISOString().split('T')[0]
    };
  }

  const lastDate = new Date(lastDonationDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 90); // 90 days standard interval

  const now = new Date();
  const diffTime = nextDate - now;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleDate: new Date().toISOString().split('T')[0]
    };
  }

  return {
    isEligible: false,
    daysRemaining,
    nextEligibleDate: nextDate.toISOString().split('T')[0]
  };
};

const determineBadge = (donationCount) => {
  if (donationCount >= 10) return 'Platinum Hero';
  if (donationCount >= 5) return 'Gold Champion';
  if (donationCount >= 3) return 'Silver LifeSaver';
  if (donationCount >= 1) return 'Bronze Supporter';
  return 'Registered Donor';
};

const DonorProfile = {
  findByUserId: (userId) => {
    const profile = DonorProfiles.findOne(p => p.userId === userId);
    if (!profile) return null;

    const eligibility = calculateEligibility(profile.lastDonationDate);
    const badge = determineBadge(profile.totalDonations || 0);

    return {
      ...profile,
      eligibility,
      badgeLevel: badge
    };
  },

  create: (profileData) => {
    const existing = DonorProfiles.findOne(p => p.userId === profileData.userId);
    if (existing) {
      throw new Error('Donor profile already exists for this user.');
    }

    const newProfile = {
      id: `dp-${Date.now()}`,
      totalDonations: 0,
      lastDonationDate: null,
      eligibilityStatus: 'ELIGIBLE',
      badgeLevel: 'Registered Donor',
      registeredCamps: [],
      ...profileData
    };

    return DonorProfiles.insert(newProfile);
  },

  update: (userId, updateData) => {
    const updated = DonorProfiles.update(
      p => p.userId === userId,
      () => updateData
    );
    return updated[0] || null;
  },

  getHistory: (userId) => {
    return DonationHistory.find(dh => dh.donorId === userId)
      .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
  },

  recordDonation: (donationRecord) => {
    const record = {
      id: `dh-${Date.now()}`,
      status: 'VERIFIED',
      ...donationRecord
    };
    DonationHistory.insert(record);

    // Update donor stats
    DonorProfiles.update(
      p => p.userId === donationRecord.donorId,
      (current) => {
        const count = (current.totalDonations || 0) + 1;
        return {
          totalDonations: count,
          lastDonationDate: donationRecord.donationDate,
          badgeLevel: determineBadge(count)
        };
      }
    );

    return record;
  }
};

module.exports = DonorProfile;
