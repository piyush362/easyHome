import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Phone, ShieldAlert} from 'lucide-react-native';
import {EHText, EHButton, EHModal} from '../../../components';
import {FamilyMember} from '../../../types/models';

export interface HomeSosModalProps {
  visible: boolean;
  primaryContact: FamilyMember | null;
  onClose: () => void;
  onConfirm: () => void;
  onConfigureContacts?: () => void;
}

export function HomeSosModal({
  visible,
  primaryContact,
  onClose,
  onConfirm,
  onConfigureContacts,
}: HomeSosModalProps) {
  return (
    <EHModal visible={visible} onClose={onClose} title="Emergency SOS">
      <View style={styles.modalContent}>
        {primaryContact ? (
          <>
            <EHText variant="body" style={styles.modalText}>
              Are you sure you want to trigger Emergency SOS? This will
              immediately call your primary contact{' '}
              <EHText variant="body" weight="700">
                {primaryContact.name} ({primaryContact.phoneNumber})
              </EHText>
              .
            </EHText>

            <EHButton
              label={`Yes, Call ${primaryContact.name}`}
              icon={<Phone size={18} color="#FFFFFF" />}
              variant="danger"
              onPress={onConfirm}
              style={styles.modalActionBtn}
            />
          </>
        ) : (
          <>
            <EHText variant="body" style={styles.modalText}>
              No emergency contact is configured yet. Tapping call will dial
              national emergency services (112).
            </EHText>

            <EHButton
              label="Call Emergency Services (112)"
              icon={<ShieldAlert size={18} color="#FFFFFF" />}
              variant="danger"
              onPress={onConfirm}
              style={styles.modalActionBtn}
            />

            {onConfigureContacts && (
              <EHButton
                label="Add Emergency Contact"
                variant="primary"
                onPress={() => {
                  onClose();
                  onConfigureContacts();
                }}
                style={styles.modalActionBtn}
              />
            )}
          </>
        )}

        <EHButton
          label="Cancel / I'm Okay"
          variant="outline"
          onPress={onClose}
          style={styles.modalActionBtn}
        />
      </View>
    </EHModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 12,
  },
  modalText: {
    marginBottom: 8,
    lineHeight: 24,
  },
  modalActionBtn: {
    minHeight: 52,
  },
});
