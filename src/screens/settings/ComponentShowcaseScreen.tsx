import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, StatusBar} from 'react-native';
import {useTheme} from '../../theme';
import {
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
  useAppSelector,
  setTheme,
  setTextSize,
  setButtonSize,
  setIconSize,
  setAppearanceMode,
} from '../../store';
import {ColorTheme, SizeScale} from '../../types/models';
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

  const themes: ColorTheme[] = ['ocean', 'green', 'rose', 'warm', 'blue', 'dark'];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {padding: spacing.md, paddingBottom: 60},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <EHButton
            label="← Back to Settings"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
          <EHText variant="heading1" weight="800">
            Design System Showcase
          </EHText>
          <EHText variant="caption" color={colors.textSecondary}>
            Interactive verification of all 10 EasyHome accessible components
          </EHText>
        </View>

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
                label="☀️ Light Mode"
                variant={appearance === 'light' ? 'primary' : 'outline'}
                onPress={() => dispatch(setAppearanceMode('light'))}
                style={styles.halfBtn}
              />
              <EHButton
                label="🌙 Dark Mode"
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
              icon="📞"
              label="Call"
              subtitle="Quick Dial"
              onPress={() => {}}
            />
            <EHIconButton
              icon="💬"
              label="WhatsApp"
              subtitle="Messages"
              badge={3}
              onPress={() => {}}
            />
            <EHIconButton
              icon="📸"
              label="Photo"
              subtitle="Take Picture"
              onPress={() => {}}
            />
            <EHIconButton
              icon="🤳"
              label="Selfie"
              subtitle="Front Camera"
              onPress={() => {}}
            />
            <EHIconButton
              icon="🔦"
              label="Torch"
              subtitle="Tap to turn on"
              onPress={() => {}}
            />
            <EHIconButton
              icon="🆘"
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
      </ScrollView>

      {/* Modal Demo */}
      <EHModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Sample Modal Dialog">
        <EHText variant="body" style={styles.modalText}>
          This is an accessible modal with high contrast, background overlay,
          and close triggers.
        </EHText>
        <EHButton
          label="Got It"
          onPress={() => setModalVisible(false)}
          style={styles.modalBtn}
        />
      </EHModal>

      {/* Bottom Sheet Demo */}
      <EHBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Contact Daughter">
        <EHText variant="body" style={styles.modalText}>
          Choose how you want to reach out:
        </EHText>
        <View style={styles.stackSpacing}>
          <EHButton
            label="📞 Normal Phone Call"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 36,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  cardSpacing: {
    gap: 12,
  },
  stackSpacing: {
    gap: 12,
  },
  labelMargin: {
    marginBottom: 4,
  },
  labelMarginTop: {
    marginTop: 12,
    marginBottom: 4,
  },
  buttonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  halfBtn: {
    flex: 1,
    minHeight: 48,
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
  modalText: {
    marginBottom: 16,
  },
  modalBtn: {
    marginTop: 8,
  },
});
