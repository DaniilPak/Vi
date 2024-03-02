import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const deviceMetrics = {
  DEVICE_WIDTH: width,
  DEVICE_HEIGHT: height,
};
