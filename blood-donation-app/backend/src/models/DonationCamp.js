const { DonationCamps } = require('../config/db');

const DonationCamp = {
  find: (filter = {}) => {
    return DonationCamps.find(camp => {
      if (filter.state && camp.state.toLowerCase() !== filter.state.toLowerCase()) return false;
      if (filter.district && camp.district.toLowerCase() !== filter.district.toLowerCase()) return false;
      if (filter.status && camp.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      if (filter.bloodBankId && camp.bloodBankId !== filter.bloodBankId) return false;
      return true;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  },

  findById: (id) => {
    return DonationCamps.findOne(camp => camp.id === id);
  },

  create: (campData) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      targetUnits: 100,
      collectedUnits: 0,
      registeredDonors: [],
      status: 'UPCOMING',
      ...campData
    };
    return DonationCamps.insert(newCamp);
  },

  registerDonor: (campId, donorId) => {
    const updated = DonationCamps.update(
      c => c.id === campId,
      (current) => {
        const donors = current.registeredDonors || [];
        if (!donors.includes(donorId)) {
          donors.push(donorId);
        }
        return { registeredDonors: donors };
      }
    );
    return updated[0] || null;
  },

  updateStatus: (campId, status) => {
    const updated = DonationCamps.update(
      c => c.id === campId,
      () => ({ status })
    );
    return updated[0] || null;
  }
};

module.exports = DonationCamp;
