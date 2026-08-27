import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Phone,
  MessageCircle,
  Camera,
  User,
  Flashlight,
  AlertTriangle,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react-native';
import {useTheme} from '../../theme';
import {
  ScreenWrapper,
  HeaderNavigation,
  EHText,
  EHButton,
  EHIconButton,
  EHCard,
  EHAvatar,
  EHListItem,
  EHSection,
  EHModal,
  EHBottomSheet,
  EHSwitch,
} from '../../components';
import {
  useAppDispatch,
  setTheme,
  setTextSize,
  setButtonSize,
  setIconSize,
  setAppearanceMode,
} from '../../store';
import {ColorTheme} from '../../types/models';
import type {RootStackScreenProps} from '../../navigation/types';

export default function ComponentShowcaseScreen({
  navigation,
}: RootStackScreenProps<'ComponentShowcase'>) {
  const {colors, spacing, themeName, appearance, textSize} = useTheme();
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const themes: ColorTheme[] = [
    'warm',
    'ocean',
    'green',
    'rose',
    'blue',
    'dark',
    'midnightBloom',
    'sunsetWave',
    'auroraCyan',
  ];

  return (
    <ScreenWrapper
      headerComponent={
        <HeaderNavigation
          label="Design System Showcase"
          subtitle="All 10 accessible components & tokens"
          onBack={() => navigation.goBack()}
        />
      }>
      <View style={[styles.container, {padding: spacing.md}]}>
        {/* Live Theme & Sizing Controls */}
        <EHSection
          title="1. Live Theme & Appearance Controls"
          subtitle="Tap to test instant theme transitions across all components">
          <EHCard style={styles.cardSpacing}>
            <EHText variant="body" weight="700" style={styles.labelMargin}>
              Active Theme: {themeName.toUpperCase()}
            </EHText>
            <View style={styles.buttonWrap}>
              {themes.map(t => (
                <EHButton
                  key={t}
                  label={t}
                  variant={themeName === t ? 'primary' : 'outline'}
                  onPress={() => dispatch(setTheme(t))}
                  style={styles.smallBtn}
                />
              ))}
            </View>

            <EHText variant="body" weight="700" style={styles.labelMarginTop}>
              Appearance Mode
            </EHText>
            <View style={styles.buttonWrap}>
              <EHButton
                label="Light Mode"
                icon={<Sun size={18} color={appearance === 'light' ? '#FFF' : colors.primary} />}
                variant={appearance === 'light' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('light'))}
                style={styles.halfBtn}
              />
              <EHButton
                label="Dark Mode"
                icon={<Moon size={18} color={appearance === 'dark' ? '#FFF' : colors.primary} />}
                variant={appearance === 'dark' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('dark'))}
                style={styles.halfBtn}
              />
            </View>

            <EHText variant="body" weight="700" style={styles.labelMarginTop}>
              Accessibility Scale: {textSize}
            </EHText>
            <View style={styles.buttonWrap}>
              <EHButton
                label="Large"
                variant={textSize === 'large' ? 'primary' : 'outline'}
                onPress={() => {
                  dispatch(setTextSize('large'));
                  dispatch(setButtonSize('large'));
                  dispatch(setIconSize('large'));
                }}
                style={styles.halfBtn}
              />
              <EHButton
                label="Extra Large"
                variant={textSize === 'extraLarge' ? 'primary' : 'outline'}
                onPress={() => {
                  dispatch(setTextSize('extraLarge'));
                  dispatch(setButtonSize('extraLarge'));
                  dispatch(setIconSize('extraLarge'));
                }}
                style={styles.halfBtn}
              />
            </View>
          </EHCard>
        </EHSection>

        {/* 2. EHText */}
        <EHSection
          title="2. EHText Typography"
          subtitle="Scales automatically with accessibility mode">
          <EHCard style={styles.cardSpacing}>
            <EHText variant="heading1">Heading 1 Typography</EHText>
            <EHText variant="heading2">Heading 2 Typography</EHText>
            <EHText variant="body">
              Body text: Everything important is right in front of you.
            </EHText>
            <EHText variant="caption">Caption text: Thursday, August 27</EHText>
            <EHText variant="button" color={colors.primary}>
              Button label typography
            </EHText>
          </EHCard>
        </EHSection>

        {/* 3. EHButton */}
        <EHSection title="3. EHButton Variants">
          <EHCard style={styles.stackSpacing}>
            <EHButton
              label="Primary Action Button"
              variant="primary"
              onPress={() => {}}
            />
            <EHButton
              label="Secondary Action Button"
              variant="secondary"
              onPress={() => {}}
            />
            <EHButton
              label="Outline Button"
              variant="outline"
              onPress={() => {}}
            />
            <EHButton
              label="Danger / Emergency Button"
              variant="danger"
              onPress={() => {}}
            />
            <EHButton
              label="Ghost Action"
              variant="ghost"
              onPress={() => {}}
            />
            <EHButton
              label="Disabled Button"
              disabled
              onPress={() => {}}
            />
            <EHButton
              label={btnLoading ? 'Processing...' : 'Toggle Loading State'}
              loading={btnLoading}
              onPress={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1500);
              }}
            />
          </EHCard>
        </EHSection>

        {/* 4. EHIconButton */}
        <EHSection
          title="4. EHIconButton Grid Tiles"
          subtitle="Large touch targets designed for home screen quick actions">
          <View style={styles.grid2}>
            <EHIconButton
              icon={<Phone size={30} color={colors.primary} />}
              label="Call"
              subtitle="Quick Dial"
              onPress={() => {}}
            />
            <EHIconButton
              icon={<MessageCircle size={30} color={colors.primary} />}
              label="WhatsApp"
              subtitle="Messages"
              badge={3}
              onPress={() => {}}
            />
            <EHIconButton
              icon={<Camera size={30} color={colors.primary} />}
              label="Photo"
              subtitle="Take Picture"
              onPress={() => {}}
            />
            <EHIconButton
              icon={<User size={30} color={colors.primary} />}
              label="Selfie"
              subtitle="Front Camera"
              onPress={() => {}}
            />
            <EHIconButton
              icon={<Flashlight size={30} color={colors.warning} />}
              label="Torch"
              subtitle="Tap to turn on"
              onPress={() => {}}
            />
            <EHIconButton
              icon={<AlertTriangle size={30} color={colors.error} />}
              label="Help"
              subtitle="Emergency SOS"
              backgroundColor={colors.errorLight}
              onPress={() => {}}
            />
          </View>
        </EHSection>

        {/* 5. EHAvatar & EHListItem */}
        <EHSection
          title="5. EHAvatar & EHListItem"
          subtitle="Family contact entries and list items">
          <EHCard style={styles.stackSpacing}>
            <View style={styles.avatarRow}>
              <EHAvatar name="Alice Daughter" />
              <EHAvatar name="Bob Son" />
              <EHAvatar name="Carol Wife" />
              <EHAvatar name="David Grandson" />
            </View>

            <EHListItem
              left={<EHAvatar name="Alice Daughter" size={48} />}
              title="Alice (Daughter)"
              subtitle="Preferred: Call • +1 (555) 019-2831"
              right={<EHText variant="body" color={colors.primary}>Call</EHText>}
              onPress={() => {}}
            />

            <EHListItem
              left={<EHAvatar name="Bob Son" size={48} />}
              title="Bob (Son)"
              subtitle="Preferred: WhatsApp • +1 (555) 014-9922"
              right={<EHText variant="body" color={colors.primary}>WhatsApp</EHText>}
              onPress={() => {}}
            />
          </EHCard>
        </EHSection>

        {/* 6. EHSwitch */}
        <EHSection title="6. EHSwitch Toggle">
          <EHCard style={styles.stackSpacing}>
            <EHSwitch
              label="Protect Settings with PIN"
              description="Requires family PIN to change layout or contacts"
              value={switchVal}
              onValueChange={setSwitchVal}
            />
            <EHSwitch
              label="Location Sharing"
              description="Share location with emergency contacts"
              value={!switchVal}
              onValueChange={() => setSwitchVal(!switchVal)}
            />
          </EHCard>
        </EHSection>

        {/* 7. EHModal & EHBottomSheet */}
        <EHSection title="7. EHModal & EHBottomSheet Dialogs">
          <EHCard style={styles.stackSpacing}>
            <EHButton
              label="Open Centered Modal Dialog"
              variant="secondary"
              onPress={() => setModalVisible(true)}
            />
            <EHButton
              label="Open Slide-up Bottom Sheet"
              variant="outline"
              onPress={() => setSheetVisible(true)}
            />
          </EHCard>
        </EHSection>
      </View>

      {/* Modal Showcase */}
      <EHModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Emergency Alert Confirmation">
        <EHText variant="body">
          This is an accessible EHModal dialog with high-contrast text and clean actions.
        </EHText>
        <View style={styles.modalBtnRow}>
          <EHButton
            label="Confirm Action"
            variant="danger"
            onPress={() => setModalVisible(false)}
            style={styles.modalBtn}
          />
          <EHButton
            label="Dismiss"
            variant="outline"
            onPress={() => setModalVisible(false)}
            style={styles.modalBtn}
          />
        </View>
      </EHModal>

      {/* BottomSheet Showcase */}
      <EHBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Contact Actions">
        <View style={styles.stackSpacing}>
          <EHButton
            label="📞 Phone Call"
            variant="primary"
            onPress={() => setSheetVisible(false)}
          />
          <EHButton
            label="💬 WhatsApp Chat"
            variant="secondary"
            onPress={() => setSheetVisible(false)}
          />
          <EHButton
            label="Cancel"
            variant="ghost"
            onPress={() => setSheetVisible(false)}
          />
        </View>
      </EHBottomSheet>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  cardSpacing: {
    padding: 16,
  },
  stackSpacing: {
    gap: 12,
    padding: 16,
  },
  labelMargin: {
    marginBottom: 8,
  },
  labelMarginTop: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallBtn: {
    flexGrow: 1,
    minWidth: 90,
  },
  halfBtn: {
    flex: 1,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
  },
});
