const { Stocks } = require('../config/db');

const Stock = {
  find: (filter = {}) => {
    return Stocks.find(stk => {
      if (filter.bloodBankId && stk.bloodBankId !== filter.bloodBankId) return false;
      if (filter.state && stk.state.toLowerCase() !== filter.state.toLowerCase()) return false;
      if (filter.district && stk.district.toLowerCase() !== filter.district.toLowerCase()) return false;
      if (filter.bloodGroup && stk.bloodGroup !== filter.bloodGroup) return false;
      if (filter.component && stk.component.toLowerCase() !== filter.component.toLowerCase()) return false;
      if (filter.isLow !== undefined && stk.isLow !== filter.isLow) return false;
      return true;
    });
  },

  updateUnits: (bloodBankId, bloodGroup, component, deltaOrValue, isAbsolute = false) => {
    const updated = Stocks.update(
      stk => stk.bloodBankId === bloodBankId && stk.bloodGroup === bloodGroup && stk.component.toLowerCase() === component.toLowerCase(),
      (current) => {
        let newUnits = isAbsolute ? deltaOrValue : Math.max(0, current.units + deltaOrValue);
        return {
          units: newUnits,
          isLow: newUnits <= (current.threshold || 5),
          lastUpdated: new Date().toISOString()
        };
      }
    );
    return updated[0] || null;
  },

  setStock: (bloodBankId, bloodGroup, component, units) => {
    return Stock.updateUnits(bloodBankId, bloodGroup, component, units, true);
  },

  getMatrixForBank: (bloodBankId) => {
    const items = Stocks.find(stk => stk.bloodBankId === bloodBankId);
    return items;
  },

  getGlobalStats: () => {
    const all = Stocks.find();
    const totalUnits = all.reduce((acc, curr) => acc + (curr.units || 0), 0);
    const lowStockAlerts = all.filter(s => s.isLow).length;
    
    // Group availability
    const groupTotals = {};
    all.forEach(s => {
      groupTotals[s.bloodGroup] = (groupTotals[s.bloodGroup] || 0) + (s.units || 0);
    });

    return {
      totalUnits,
      lowStockAlerts,
      groupTotals
    };
  }
};

module.exports = Stock;
