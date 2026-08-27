import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useTheme} from '../../theme';

export interface EHAvatarProps {
  source?: string | null;
  name: string;
  size?: number;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EHAvatar({
  source,
  name,
  size,
  accentColor,
  style,
  testID,
}: EHAvatarProps) {
  const {colors, dimensions} = useTheme();

  const avatarSize = size || dimensions.avatarSize;
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  const bg = accentColor || colors.primaryLight;
  const textColor = colors.primary;

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: bg,
    borderColor: colors.border,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <View testID={testID} style={[containerStyle, style]}>
      {source ? (
        <Image
          source={{uri: source}}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel={`Photo of ${name}`}
        />
      ) : (
        <Text
          style={[
            styles.initialsText,
            {
              fontSize: avatarSize * 0.38,
              color: textColor,
            },
          ]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initialsText: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
