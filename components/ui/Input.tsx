import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { C } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

export interface InputProps extends TextInputProps {
  variant?: 'underline' | 'outline';
}

export const Input = forwardRef<TextInput, InputProps>(({
  style,
  variant = 'underline',
  placeholderTextColor = C.textMuted,
  ...rest
}, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[
        variant === 'underline' ? styles.underline : styles.outline,
        style,
      ]}
      placeholderTextColor={placeholderTextColor}
      selectionColor={C.accent}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(245,240,232,0.15)',
    ...Typography.headingM,
    color: C.text,
    paddingVertical: Spacing.md,
  },
  outline: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: Spacing.md,
    ...Typography.bodyM,
    color: C.text,
  },
});
