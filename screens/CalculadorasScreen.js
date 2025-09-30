import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CalculatorButton = ({ title, description, icon, onPress }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#3b82f6" />
    <View style={styles.buttonTextContainer}>
      <Text style={styles.buttonTitle}>{title}</Text>
      <Text style={styles.buttonDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
  </Pressable>
);

export default function CalculadorasScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Calculadoras</Text>
        <CalculatorButton
          title="Chapas (Kg)"
          description="Calcular peso de peças com base em uma chapa mestre."
          icon="tablet-landscape-outline"
          onPress={() => navigation.navigate('CalculoChapasKg')}
        />
        <CalculatorButton
          title="Tubos e Barras (Kg)"
          description="Calcular peso de tubos e barras metálicas."
          icon="remove-circle-outline"
          onPress={() => navigation.navigate('CalculoTubos')}
        />
        <CalculatorButton
          title="Chapas (Unidade)"
          description="Calcular quantas peças cabem em uma chapa."
          icon="apps-outline"
          onPress={() => navigation.navigate('CalculoChapasUn')}
        />
        <CalculatorButton
          title="Tinta (Litro)"
          description="Calcular a quantidade de tinta necessária por m²."
          icon="color-palette-outline"
          onPress={() => navigation.navigate('CalculoTinta')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f1f5f9' },
  container: { padding: 16 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', marginBottom: 24, paddingHorizontal: 8 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, gap: 16 },
  buttonTextContainer: { flex: 1 },
  buttonTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
  buttonDescription: { fontSize: 13, color: '#64748b', marginTop: 2 },
});
