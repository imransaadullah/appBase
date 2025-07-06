import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { COLORS, SIZES } from '../../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.dark,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  error: {
    fontSize: 14,
    color: COLORS.danger,
    marginTop: 5,
  },
});

export default Input; 