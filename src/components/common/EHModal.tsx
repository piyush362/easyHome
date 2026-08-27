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

export interface EHModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHModal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  style,
  testID,
}: EHModalProps) {
  const {colors, borderRadius, elevation} = useTheme();

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dialog,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.xl,
                  borderColor: colors.border,
                  ...elevation.high,
                },
                style,
              ]}>
              {(title || showCloseButton) && (
                <View style={styles.headerRow}>
                  {title ? (
                    <EHText variant="heading2" weight="700" style={styles.title}>
                      {title}
                    </EHText>
                  ) : (
                    <View />
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                      activeOpacity={0.7}
                      accessibilityLabel="Close modal">
                      <EHText
                        variant="heading2"
                        color={colors.textSecondary}
                        weight="600">
                        ✕
                      </EHText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={styles.body}>{children}</View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 6,
    marginLeft: 12,
  },
  body: {
    width: '100%',
  },
});
