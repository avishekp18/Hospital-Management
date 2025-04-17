import { createModel, preprocessData, trainModel, makePrediction } from '../utils/mlEngine.js';

// Train the AI Model
export const trainModel = async (req, res) => {
  try {
    const rawData = req.body.data; // Assuming data sent in request body
    const { xs, ys } = preprocessData(rawData);

    const model = createModel();
    await trainModel(model, xs, ys);

    res.status(200).json({ message: '✅ Model trained successfully!' });
  } catch (error) {
    res.status(500).json({ error: '🚫 Training failed', details: error.message });
  }
};

// Make a Prediction
export const predictData = (req, res) => {
  try {
    const inputData = req.body.input; // Example: [1, 0, 3, 4, 5]
    const model = createModel(); // In production, load saved model
    const prediction = makePrediction(model, inputData);

    res.status(200).json({ prediction: prediction.arraySync() });
  } catch (error) {
    res.status(500).json({ error: '🚫 Prediction failed', details: error.message });
  }
};
