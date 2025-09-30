import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputComLabel = React.forwardRef(({ label, flex, ...props }, ref) => (
  <View style={[styles.container, { flex: flex }]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      ref={ref}
      style={styles.input}
      keyboardType="numeric"
      placeholderTextColor="#94a3b8"
      {...props}
    />
  </View>
));

const styles = StyleSheet.create({
  // CORREÇÃO: Adicionamos um container principal com justifyContent
  container: {
    justifyContent: 'flex-end', // Alinha o conteúdo (label + input) na base do container
  },
  inputLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    textAlign: 'center',
    borderRadius: 6,
  },
});

export default InputComLabel;
