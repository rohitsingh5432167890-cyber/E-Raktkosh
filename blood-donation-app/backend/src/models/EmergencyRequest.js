const { EmergencyRequests } = require('../config/db');

const EmergencyRequest = {
  find: (filter = {}) => {
    return EmergencyRequests.find(req => {
      if (filter.status && req.status.toLowerCase() !== filter.status.toLowerCase()) return false;
      if (filter.bloodGroup && req.bloodGroup !== filter.bloodGroup) return false;
      if (filter.state && req.state.toLowerCase() !== filter.state.toLowerCase()) return false;
      if (filter.urgency && req.urgency.toLowerCase() !== filter.urgency.toLowerCase()) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById: (id) => {
    return EmergencyRequests.findOne(req => req.id === id);
  },

  create: (reqData) => {
    const newRequest = {
      id: `sos-${Date.now()}`,
      unitsFulfilled: 0,
      status: 'OPEN',
      urgency: reqData.urgency || 'HIGH',
      createdAt: new Date().toISOString(),
      ...reqData
    };
    return EmergencyRequests.insert(newRequest);
  },

  updateFulfillment: (id, fulfilledUnitsDelta, notes = '') => {
    const updated = EmergencyRequests.update(
      req => req.id === id,
      (current) => {
        const totalFulfilled = (current.unitsFulfilled || 0) + fulfilledUnitsDelta;
        const isCompleted = totalFulfilled >= current.unitsNeeded;
        return {
          unitsFulfilled: totalFulfilled,
          status: isCompleted ? 'FULFILLED' : 'OPEN',
          lastActionNote: notes || undefined,
          updatedAt: new Date().toISOString()
        };
      }
    );
    return updated[0] || null;
  }
};

module.exports = EmergencyRequest;
