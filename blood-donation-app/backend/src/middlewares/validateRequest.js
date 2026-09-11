/**
 * Request Validation Middleware & Sanitization
 */

const { BLOOD_GROUPS, BLOOD_COMPONENTS, URGENCY_LEVELS, USER_ROLES } = require('../config/constants');
const { ValidationError } = require('../utils/errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9\s\-()]{7,15}$/;

const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors
      });
    }
    next();
  };
};

const validateRegister = validate((req) => {
  const errors = [];
  const { name, email, password, bloodGroup, weight, phone } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup.trim())) {
    errors.push(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}.`);
  }

  if (weight !== undefined && weight !== '' && (isNaN(weight) || Number(weight) < 45 || Number(weight) > 200)) {
    errors.push('Donor body weight must be between 45 kg and 200 kg for safety eligibility.');
  }

  if (phone && !PHONE_REGEX.test(phone.trim())) {
    errors.push('Phone number format is invalid.');
  }

  return errors;
});

const validateLogin = validate((req) => {
  const errors = [];
  const { email, password, role } = req.body || {};

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  if (role && ![USER_ROLES.DONOR, USER_ROLES.ADMIN].includes(role)) {
    errors.push(`Role must be either '${USER_ROLES.DONOR}' or '${USER_ROLES.ADMIN}'.`);
  }

  return errors;
});

const validateStockUpdate = validate((req) => {
  const errors = [];
  const { bloodGroup, component, delta, units } = req.body || {};

  if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup.trim())) {
    errors.push(`Valid blood group is required (${BLOOD_GROUPS.join(', ')}).`);
  }

  if (!component || !BLOOD_COMPONENTS.includes(component.trim())) {
    errors.push(`Valid component is required (${BLOOD_COMPONENTS.join(', ')}).`);
  }

  if (units === undefined && delta === undefined) {
    errors.push('Either "units" (absolute count) or "delta" (increment/decrement) must be provided.');
  }

  if (units !== undefined && (isNaN(units) || Number(units) < 0)) {
    errors.push('Stock units must be a non-negative number.');
  }

  if (delta !== undefined && isNaN(delta)) {
    errors.push('Stock delta must be a valid integer.');
  }

  return errors;
});

const validateEmergencyRequest = validate((req) => {
  const errors = [];
  const { patientName, bloodGroup, unitsNeeded, hospitalName, contactPhone, urgency, component } = req.body || {};

  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
    errors.push('Patient name is required (min 2 characters).');
  }

  if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup.trim())) {
    errors.push(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}.`);
  }

  if (component && !BLOOD_COMPONENTS.includes(component.trim())) {
    errors.push(`Component must be one of: ${BLOOD_COMPONENTS.join(', ')}.`);
  }

  if (!unitsNeeded || isNaN(unitsNeeded) || Number(unitsNeeded) <= 0 || Number(unitsNeeded) > 20) {
    errors.push('Units needed must be a positive number between 1 and 20.');
  }

  if (!hospitalName || typeof hospitalName !== 'string' || hospitalName.trim().length < 2) {
    errors.push('Hospital / medical institution name is required.');
  }

  if (!contactPhone || !PHONE_REGEX.test(contactPhone.trim())) {
    errors.push('A valid emergency contact phone number is required.');
  }

  if (urgency && !URGENCY_LEVELS.includes(urgency.trim())) {
    errors.push(`Urgency level must be one of: ${URGENCY_LEVELS.join(', ')}.`);
  }

  return errors;
});

const validateCreateCamp = validate((req) => {
  const errors = [];
  const { name, venue, startDate, targetUnits } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Camp name is required (min 3 characters).');
  }

  if (!venue || typeof venue !== 'string' || venue.trim().length < 3) {
    errors.push('Camp venue / address is required (min 3 characters).');
  }

  if (!startDate || typeof startDate !== 'string' || startDate.trim().length === 0) {
    errors.push('Camp start date is required (YYYY-MM-DD format).');
  }

  if (targetUnits !== undefined && (isNaN(targetUnits) || Number(targetUnits) <= 0)) {
    errors.push('Target units must be a positive number.');
  }

  return errors;
});

const validateVerifyDonation = validate((req) => {
  const errors = [];
  const { donorIdentifier, bloodGroup, component, units } = req.body || {};

  if (!donorIdentifier || typeof donorIdentifier !== 'string' || donorIdentifier.trim().length === 0) {
    errors.push('Donor ID or registered email address is required.');
  }

  if (bloodGroup && !BLOOD_GROUPS.includes(bloodGroup.trim())) {
    errors.push(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}.`);
  }

  if (component && !BLOOD_COMPONENTS.includes(component.trim())) {
    errors.push(`Component must be one of: ${BLOOD_COMPONENTS.join(', ')}.`);
  }

  if (units !== undefined && (isNaN(units) || Number(units) <= 0 || Number(units) > 5)) {
    errors.push('Units donated must be a valid number between 1 and 5.');
  }

  return errors;
});

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateStockUpdate,
  validateEmergencyRequest,
  validateCreateCamp,
  validateVerifyDonation
};
