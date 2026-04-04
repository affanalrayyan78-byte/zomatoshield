const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claim.controller');

router.post('/trigger', claimController.triggerClaim);
router.get('/user/:userId', claimController.getUserClaims);
router.get('/:claimId', claimController.getClaim);

module.exports = router;