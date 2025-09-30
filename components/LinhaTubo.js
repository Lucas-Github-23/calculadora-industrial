import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputComLabel from './InputComLabel';

const parseLocaleFloat = (str) => parseFloat(String(str).replace(',', '.')) || 0;

export const LinhaTubo = ({ item, onUpdate, onDelete, barraInfo }) => {
  const resultadoLinha = useMemo(() => {
    if (!barraInfo) return 0;
    const C6 = parseLocaleFloat(item.qtdMontagem);
    const D6 = parseLocaleFloat(item.qtdPeca);
    const E6 = parseLocaleFloat(item.compPeca);
    const I5 = parseLocaleFloat(barraInfo.comprimento);
    const J5 = parseLocaleFloat(barraInfo.peso);
    const F6 = C6 * D6 * E6;
    if (I5 === 0) return 0;
    return (F6 / I5) * J5;
  }, [item, barraInfo]);
  
  const handleConfirmDelete = () => { Alert.alert("Confirmar Exclusão", "Remover este item?", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", onPress: onDelete, style: "destructive" }]); };
  const qtdPecaRef = useRef(null);
  const compPecaRef = useRef(null);

  return (
    <View style={styles.linhaContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.inputsContainer}>
          <InputComLabel label="Qtd Montagem" flex={1} value={item.qtdMontagem} onChangeText={(val) => onUpdate({ ...item, qtdMontagem: val })} returnKeyType="next" onSubmitEditing={() => qtdPecaRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={qtdPecaRef} label="Qtd Peça" flex={1} value={item.qtdPeca} onChangeText={(val) => onUpdate({ ...item, qtdPeca: val })} returnKeyType="next" onSubmitEditing={() => compPecaRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={compPecaRef} label="Comp. Peça (mm)" flex={1} value={item.compPeca} onChangeText={(val) => onUpdate({ ...item, compPeca: val })} returnKeyType="done" />
        </View>
        <Pressable onPress={handleConfirmDelete} style={styles.deleteButton}><Ionicons name="trash-outline" size={24} color="#ef4444" /></Pressable>
      </View>
      <Text style={styles.subtotalTexto}>Subtotal: {resultadoLinha.toFixed(4).replace('.', ',')} Kg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  linhaContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  rowWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputsContainer: { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  subtotalTexto: { textAlign: 'right', marginTop: 8, fontSize: 12, fontStyle: 'italic', color: '#475569' },
  deleteButton: { marginLeft: 10, padding: 8 },
});
