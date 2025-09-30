import React, { useState, useMemo, useCallback, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, LayoutAnimation, UIManager, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinhaTinta } from '../../components/LinhaTinta';
import InputMestre from '../../components/InputMestre';

const STORAGE_KEY = '@calculos_chapas_history';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LINHA_PECA_PADRAO = { id: Date.now(), comprimento: '', largura: '', numFaces: '1' };

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="file-tray-outline" size={48} color="#94a3b8" />
    <Text style={styles.emptyText}>Nenhuma área adicionada.</Text>
  </View>
);

export default function CalculoTintaScreen({ navigation }) {
  const [tintaInfo, setTintaInfo] = useState({ tintaPorM2: '0.083' });
  const [areas, setAreas] = useState([{ ...LINHA_PECA_PADRAO, id: 1 }]);

  const handleUpdateTinta = (field, value) => setTintaInfo(current => ({ ...current, [field]: value }));
  const handleUpdateArea = useCallback((areaAtualizada) => setAreas(listaAtual => listaAtual.map(p => (p.id === areaAtualizada.id ? areaAtualizada : p))), []);
  const handleAddArea = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setAreas(listaAtual => [...listaAtual, { ...LINHA_PECA_PADRAO, id: Date.now() }]); };
  const handleDeleteArea = useCallback((idParaDeletar) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setAreas(listaAtual => listaAtual.filter(p => p.id !== idParaDeletar)); }, []);

  const totalLitros = useMemo(() => {
    const tintaPorM2 = parseFloat(tintaInfo.tintaPorM2) || 0;
    if (tintaPorM2 === 0) return 0;
    return areas.reduce((total, area) => {
      const comprimento = parseFloat(area.comprimento) || 0;
      const largura = parseFloat(area.largura) || 0;
      const numFaces = parseFloat(area.numFaces) || 1;
      const areaM2 = (comprimento / 1000) * (largura / 1000);
      return total + (areaM2 * numFaces * tintaPorM2);
    }, 0);
  }, [areas, tintaInfo]);

  const handleSaveCalculation = async () => {
    if (totalLitros <= 0) { Alert.alert("Atenção", "Não é possível salvar um cálculo com resultado zero."); return; }
    const newEntry = { id: Date.now(), tipo: 'TintaL', total: totalLitros, tintaInfo, areas, };
    try {
      const existingHistory = await AsyncStorage.getItem(STORAGE_KEY);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(newEntry);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      Alert.alert("Sucesso", "Cálculo salvo no histórico!");
    } catch (e) { Alert.alert("Erro", "Não foi possível salvar o cálculo."); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#0f172a" /></Pressable>
          <Text style={styles.headerTitle}>Tinta por Área (L)</Text>
          <View style={{width: 24}}/>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados da Tinta (Mestre)</Text>
            <InputMestre label="Consumo de Tinta por m²" value={tintaInfo.tintaPorM2} onChangeText={(val) => handleUpdateTinta('tintaPorM2', val)} unit="L" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()} />
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Áreas a Calcular</Text>
              <Pressable style={styles.addButton} onPress={handleAddArea}><Ionicons name="add-circle" size={24} color="#3b82f6" /><Text style={styles.addButtonText}>Adicionar</Text></Pressable>
            </View>
            {areas.length === 0 ? <EmptyState /> : areas.map(item => <LinhaTinta key={item.id} item={item} onUpdate={handleUpdateArea} onDelete={() => handleDeleteArea(item.id)} tintaInfo={tintaInfo} />)}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValor}>{totalLitros.toFixed(4).replace('.', ',')} L</Text>
          </View>
          <Pressable style={styles.saveButton} onPress={handleSaveCalculation}><Text style={styles.saveButtonText}>Salvar</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContainer: { padding: 16, paddingBottom: 20 },
  header: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  backButton: {},
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  addButtonText: { marginLeft: 6, color: '#3b82f6', fontSize: 16, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#475569', marginTop: 16 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalContainer: { alignItems: 'flex-start' },
  totalLabel: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  totalValor: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  saveButton: { backgroundColor: '#16a34a', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 50 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
