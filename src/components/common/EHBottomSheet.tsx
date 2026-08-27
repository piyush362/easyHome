import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '../../theme';
import {EHText} from './EHText';

export interface EHBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHBottomSheet({
  visible,
  onClose,
  title,
  children,
  style,
  testID,
}: EHBottomSheetProps) {
  const {colors, borderRadius, elevation} = useTheme();

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: borderRadius.xl,
                  borderTopRightRadius: borderRadius.xl,
                  borderColor: colors.border,
                  ...elevation.high,
                },
                style,
              ]}>
              {/* Drag Handle */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    {backgroundColor: colors.border},
                  ]}
                />
              </View>

              {title && (
                <View style={styles.header}>
                  <EHText variant="heading2" weight="700" align="center">
                    {title}
                  </EHText>
                </View>
              )}

              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    maxHeight: '85%',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  header: {
    marginBottom: 16,
  },
  content: {
    width: '100%',
  },
});
