const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');

// All donor routes require auth and donor role
router.use(authMiddleware);
router.use(roleGuard('donor'));

router.get('/profile', donorController.getProfile);
router.put('/profile', donorController.updateProfile);
router.get('/history', donorController.getHistory);
router.get('/pass', donorController.getDigitalPass);
router.post('/camps/:campId/register', donorController.registerForCamp);

module.exports = router;
