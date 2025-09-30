import React, { useState, useMemo, useCallback, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, LayoutAnimation, UIManager, Alert, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinhaTubo } from '../../components/LinhaTubo';
import InputMestre from '../../components/InputMestre';

const STORAGE_KEY = '@calculos_chapas_history';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const parseLocaleFloat = (str) => parseFloat(String(str).replace(',', '.')) || 0;

const LINHA_PECA_PADRAO = { id: Date.now(), qtdMontagem: '1', qtdPeca: '1', compPeca: '' };

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="file-tray-outline" size={48} color="#94a3b8" />
    <Text style={styles.emptyText}>Nenhum item adicionado.</Text>
  </View>
);

export default function CalculoTubosScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [barraInfo, setBarraInfo] = useState({ comprimento: '6000', peso: '' });
  const [pecas, setPecas] = useState([{ ...LINHA_PECA_PADRAO, id: 1 }]);
  const pesoBarraRef = useRef(null);

  const handleUpdateBarra = (field, value) => setBarraInfo(current => ({ ...current, [field]: value }));
  const handleUpdatePeca = useCallback((pecaAtualizada) => setPecas(listaAtual => listaAtual.map(p => (p.id === pecaAtualizada.id ? pecaAtualizada : p))), []);
  const handleAddPeca = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setPecas(listaAtual => [...listaAtual, { ...LINHA_PECA_PADRAO, id: Date.now() }]); };
  const handleDeletePeca = useCallback((idParaDeletar) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setPecas(listaAtual => listaAtual.filter(p => p.id !== idParaDeletar)); }, []);

  const totalKg = useMemo(() => {
    const H5 = pecas.reduce((total, peca) => {
      const C6 = parseLocaleFloat(peca.qtdMontagem);
      const D6 = parseLocaleFloat(peca.qtdPeca);
      const E6 = parseLocaleFloat(peca.compPeca);
      const F6 = C6 * D6 * E6;
      return total + F6;
    }, 0);

    const I5 = parseLocaleFloat(barraInfo.comprimento);
    const J5 = parseLocaleFloat(barraInfo.peso);
    
    if (I5 === 0) return 0;
    return (H5 / I5) * J5;
  }, [pecas, barraInfo]);

  const handleSaveCalculation = async () => {
    if (totalKg <= 0) { Alert.alert("Atenção", "Não é possível salvar um cálculo com resultado zero."); return; }
    const newEntry = { id: Date.now(), tipo: 'TubosKg', total: totalKg, barraInfo, pecas, };
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
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#0f172a" /></Pressable>
          <Text style={styles.headerTitle}>Tubos por Peso (Kg)</Text>
          <View style={{width: 24}}/>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados da Barra (Mestre)</Text>
            <InputMestre label="Comprimento da Barra" value={barraInfo.comprimento} onChangeText={(val) => handleUpdateBarra('comprimento', val)} unit="mm" returnKeyType="next" onSubmitEditing={() => pesoBarraRef.current.focus()} blurOnSubmit={false} />
            <InputMestre ref={pesoBarraRef} label="Peso da Barra" value={barraInfo.peso} onChangeText={(val) => handleUpdateBarra('peso', val)} unit="Kg" returnKeyType="done" onSubmitEditing={() => Keyboard.dismiss()} />
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Itens a Calcular</Text>
              <Pressable style={styles.addButton} onPress={handleAddPeca}><Ionicons name="add-circle" size={24} color="#3b82f6" /><Text style={styles.addButtonText}>Adicionar</Text></Pressable>
            </View>
            {pecas.length === 0 ? <EmptyState /> : pecas.map(item => (
              <LinhaTubo 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdatePeca} 
                onDelete={() => handleDeletePeca(item.id)}
                barraInfo={barraInfo} // <-- CORRIGIDO AQUI: A prop estava faltando
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL A SER LANÇADO</Text>
            <Text style={styles.totalValor}>{totalKg.toFixed(4).replace('.', ',')} Kg</Text>
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
  header: { backgroundColor: '#fff', paddingBottom: 12, paddingHorizontal: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between' },
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
