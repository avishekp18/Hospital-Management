import * as tf from '@tensorflow/tfjs-node';

/**
 * Create a Simple Neural Network Model
 */
export const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [5] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
};

/**
 * Preprocess Raw Data into Tensors
 */
export const preprocessData = (rawData) => {
  const inputs = rawData.map(item => item.features);
  const labels = rawData.map(item => item.label);

  const xs = tf.tensor2d(inputs);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  return { xs, ys };
};

/**
 * Train the Model
 */
export const trainModel = async (model, xs, ys) => {
  await model.fit(xs, ys, {
    epochs: 20,
    batchSize: 4,
    verbose: 1,
  });
  console.log('✅ Training Complete');
};

/**
 * Make Predictions
 */
export const makePrediction = (model, inputData) => {
  const inputTensor = tf.tensor2d([inputData]);
  const prediction = model.predict(inputTensor);
  prediction.print();
  return prediction;
};
