const { BloodBanks } = require('../config/db');

const BloodBank = {
  findAll: () => {
    return BloodBanks.find();
  },

  findById: (id) => {
    return BloodBanks.findOne(bb => bb.id === id);
  },

  find: (filter = {}) => {
    return BloodBanks.find(bb => {
      if (filter.state && bb.state.toLowerCase() !== filter.state.toLowerCase()) {
        return false;
      }
      if (filter.district && bb.district.toLowerCase() !== filter.district.toLowerCase()) {
        return false;
      }
      if (filter.query) {
        const q = filter.query.toLowerCase();
        const matchesName = bb.name.toLowerCase().includes(q);
        const matchesCity = (bb.city || '').toLowerCase().includes(q);
        const matchesAddr = bb.address.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesAddr) return false;
      }
      return true;
    });
  },

  getStates: () => {
    const all = BloodBanks.find();
    const states = [...new Set(all.map(bb => bb.state))].sort();
    return states;
  },

  getDistricts: (state) => {
    const all = BloodBanks.find(bb => !state || bb.state.toLowerCase() === state.toLowerCase());
    const districts = [...new Set(all.map(bb => bb.district))].sort();
    return districts;
  }
};

module.exports = BloodBank;
