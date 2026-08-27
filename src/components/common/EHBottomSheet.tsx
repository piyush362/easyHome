import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {EHText} from './EHText';

export interface EHBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string; // e.g. '85%', 'auto'
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  headerComponent,
  footerComponent,
  children,
  height = 'auto',
  scrollable = true,
  style,
  testID,
}: EHBottomSheetProps) {
  const {colors, borderRadius, elevation} = useTheme();
  const insets = useSafeAreaInsets();

  const isFixedHeight = height !== 'auto' && height !== undefined;

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
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
                  ...(isFixedHeight ? {height} : {maxHeight: '90%'}),
                  ...elevation.high,
                },
                style,
              ]}>
              {/* 1. Sticky Header */}
              <View
                style={[
                  styles.stickyHeader,
                  {
                    borderBottomColor: colors.border,
                    backgroundColor: colors.surface,
                  },
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

                {headerComponent ? (
                  headerComponent
                ) : title ? (
                  <View style={styles.headerTitleBox}>
                    <EHText variant="heading2" weight="700" align="center">
                      {title}
                    </EHText>
                    {subtitle ? (
                      <EHText
                        variant="caption"
                        color={colors.textSecondary}
                        align="center"
                        style={styles.subtitle}>
                        {subtitle}
                      </EHText>
                    ) : null}
                  </View>
                ) : null}
              </View>

              {/* 2. Middle Content */}
              {scrollable ? (
                <KeyboardAwareScrollView
                  style={styles.scrollContent}
                  contentContainerStyle={[
                    styles.scrollContainer,
                    !footerComponent && {
                      paddingBottom: Math.max(insets.bottom + 16, 32),
                    },
                  ]}
                  enableOnAndroid={true}
                  enableAutomaticScroll={true}
                  extraScrollHeight={Platform.OS === 'ios' ? 60 : 100}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}>
                  {children}
                </KeyboardAwareScrollView>
              ) : (
                <View
                  style={[
                    styles.staticContent,
                    isFixedHeight && {flex: 1},
                    !footerComponent && {
                      paddingBottom: Math.max(insets.bottom + 16, 32),
                    },
                  ]}>
                  {children}
                </View>
              )}

              {/* 3. Sticky Footer (With Bottom Safe Area Inset) */}
              {footerComponent && (
                <View
                  style={[
                    styles.stickyFooter,
                    {
                      borderTopColor: colors.border,
                      backgroundColor: colors.surface,
                      paddingBottom: Math.max(insets.bottom + 10, 18),
                    },
                  ]}>
                  {footerComponent}
                </View>
              )}
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
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  stickyHeader: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  headerTitleBox: {
    marginTop: 2,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  staticContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
