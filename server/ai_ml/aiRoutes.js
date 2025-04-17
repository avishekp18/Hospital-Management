import express from 'express';
import { predictData, trainModel } from './controllers/aiController.js';

const router = express.Router();

// Route to Train the Model
router.post('/train', trainModel);

// Route to Make Predictions
router.post('/predict', predictData);

export default router;
