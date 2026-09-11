const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBankController');
const { validateEmergencyRequest } = require('../middlewares/validateRequest');

router.get('/health', bloodBankController.getHealth);
router.get('/stats', bloodBankController.getPortalStats);
router.get('/states', bloodBankController.getStates);
router.get('/districts', bloodBankController.getDistricts);
router.get('/stock', bloodBankController.searchStock);
router.get('/blood-banks', bloodBankController.getBloodBanks);
router.get('/blood-banks/:id', bloodBankController.getBloodBankById);
router.get('/camps', bloodBankController.getCamps);
router.get('/emergency', bloodBankController.getEmergencyRequests);
router.post('/emergency', validateEmergencyRequest, bloodBankController.createEmergencyRequest);
router.get('/verify-certificate/:certificateId', bloodBankController.verifyCertificate);

module.exports = router;
