import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 16 Pro boyutları (varsayılan tasarım boyutları)
const baseWidth = 393;
const baseHeight = 852;

// Genişliğe göre ölçeklendirme
export const wp = (size: number) => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

// Yüksekliğe göre ölçeklendirme
export const hp = (size: number) => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

// Font boyutu ölçeklendirme
export const fontSize = (size: number) => {
  const scale = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Cihaz boyutlarını kontrol etme
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414; 