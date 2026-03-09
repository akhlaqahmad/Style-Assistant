import { Text, type TextProps, StyleSheet } from 'react-native';

import { Typography } from '@/constants/typography';
import { C } from '@/constants/colors';

export type ThemedTextProps = TextProps & {
  variant?: keyof typeof Typography;
  color?: string;
};

export function ThemedText({
  style,
  variant = 'bodyM',
  color = C.text,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        Typography[variant],
        { color },
        style,
      ]}
      {...rest}
    />
  );
}
