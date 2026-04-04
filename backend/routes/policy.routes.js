const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');

router.post('/calculate-premium', policyController.calculatePremium);
router.post('/buy', policyController.buyPolicy);
router.get('/user/:userId', policyController.getUserPolicies);
router.get('/:policyId', policyController.getPolicy);

module.exports = router;