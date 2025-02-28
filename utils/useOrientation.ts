import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height 
      ? 'LANDSCAPE' 
      : 'PORTRAIT'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'LANDSCAPE' : 'PORTRAIT');
    });
    
    return () => subscription.remove();
  }, []);

  return orientation;
} 