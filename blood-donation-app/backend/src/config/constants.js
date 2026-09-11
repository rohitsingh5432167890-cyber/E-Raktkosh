/**
 * e-RaktKosh Connect - Central Domain Constants & Enums
 */

const BLOOD_GROUPS = Object.freeze([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
]);

const BLOOD_COMPONENTS = Object.freeze([
  'Whole Blood',
  'PRBC',
  'FFP',
  'Platelets',
  'SDP',
  'Cryoprecipitate'
]);

const USER_ROLES = Object.freeze({
  DONOR: 'donor',
  ADMIN: 'admin'
});

const URGENCY_LEVELS = Object.freeze([
  'CRITICAL',
  'HIGH',
  'MEDIUM'
]);

const EMERGENCY_STATUSES = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED'
});

const CAMP_STATUSES = Object.freeze({
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
});

const ELIGIBILITY_INTERVAL_DAYS = Object.freeze({
  MALE: 90,
  FEMALE: 120,
  DEFAULT: 90
});

const BADGE_LEVELS = Object.freeze({
  BRONZE: 'Bronze Supporter',
  SILVER: 'Silver Hero',
  GOLD: 'Gold Champion',
  PLATINUM: 'Platinum Lifesaver'
});

const DEFAULT_PAGINATION = Object.freeze({
  PAGE: 1,
  LIMIT: 20
});

module.exports = {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  USER_ROLES,
  URGENCY_LEVELS,
  EMERGENCY_STATUSES,
  CAMP_STATUSES,
  ELIGIBILITY_INTERVAL_DAYS,
  BADGE_LEVELS,
  DEFAULT_PAGINATION
};
