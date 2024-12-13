import * as tf from '@tensorflow/tfjs';

// Define and train a simple linear regression model
export async function trainModel(data: { x: number[]; y: number[] }) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 16, activation: 'relu' })); // Hidden layer
  model.add(tf.layers.dense({ units: 1 })); // Output layer

  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  const xs = tf.tensor2d(data.x, [data.x.length, 1]);
  const ys = tf.tensor2d(data.y, [data.y.length, 1]);

  await model.fit(xs, ys, { epochs: 50 });

  return model;
}

// Predict using the trained model
export async function predict(model: tf.LayersModel, xValues: number[]) {
  const xs = tf.tensor2d(xValues, [xValues.length, 1]);
  const predictions = model.predict(xs) as tf.Tensor;
  return Array.from(predictions.dataSync());
}
