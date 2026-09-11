const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const {
  validateStockUpdate,
  validateVerifyDonation,
  validateCreateCamp
} = require('../middlewares/validateRequest');

// All admin routes require auth and admin role
router.use(authMiddleware);
router.use(roleGuard('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/stock', adminController.getStock);
router.put('/stock', validateStockUpdate, adminController.updateStock);
router.post('/verify-donation', validateVerifyDonation, adminController.verifyDonation);
router.get('/emergency', adminController.getEmergencyRequests);
router.put('/emergency/:id/fulfill', adminController.fulfillEmergency);
router.get('/camps', adminController.getCamps);
router.post('/camps', validateCreateCamp, adminController.createCamp);

module.exports = router;
