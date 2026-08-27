import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelAppDrawer, PixelAppDrawerRef} from '../../components';
import type {RootStackScreenProps} from '../../navigation/types';

export default function AppsScreen({navigation}: RootStackScreenProps<'Apps'>) {
  const drawerRef = useRef<PixelAppDrawerRef>(null);

  useEffect(() => {
    // Open drawer when screen is focused
    const timer = setTimeout(() => {
      drawerRef.current?.open();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <PixelAppDrawer
        ref={drawerRef}
        onClose={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
