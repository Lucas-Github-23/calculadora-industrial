import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputMestre = forwardRef(({ label, value, onChangeText, unit, ...props }, ref) => (
  <View style={styles.inputMestreContainer}>
    <Text style={styles.inputMestreLabel}>{label}</Text>
    <View style={styles.inputMestreWrapper}>
      <TextInput
        ref={ref}
        style={styles.inputMestreField}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="0"
        {...props}
      />
      <Text style={styles.inputMestreUnit}>{unit}</Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  inputMestreContainer: { marginBottom: 10 },
  inputMestreLabel: { fontSize: 14, color: '#475569', marginBottom: 4 },
  inputMestreWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8 },
  inputMestreField: { flex: 1, padding: 12, fontSize: 16 },
  inputMestreUnit: { paddingRight: 12, fontSize: 16, color: '#64748b' },
});

export default InputMestre;
