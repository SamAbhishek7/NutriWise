import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;
