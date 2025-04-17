import * as tf from '@tensorflow/tfjs-node';

export const preprocessData = (rawData) => {
  const inputs = rawData.map(item => item.features); // Example: [1, 2, 3, 4, 5]
  const labels = rawData.map(item => item.label);    // Example: 1 or 0

  const xs = tf.tensor2d(inputs);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  return { xs, ys };
};
