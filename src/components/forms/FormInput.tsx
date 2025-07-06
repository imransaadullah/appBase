import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';
import { COLORS, SIZES } from '../../utils/constants';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  rules?: object;
  error?: FieldError;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  rules = {},
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            placeholderTextColor="#999"
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
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
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    marginTop: 5,
  },
});

export default FormInput; 