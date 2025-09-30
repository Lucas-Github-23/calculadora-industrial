import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputComLabel from './InputComLabel';

const parseLocaleFloat = (str) => parseFloat(String(str).replace(',', '.')) || 0;

export const LinhaCalculo = ({ item, onUpdate, onDelete, chapaInfo }) => {
  const resultadoLinha = useMemo(() => {
    const B6 = parseLocaleFloat(item.qtd);
    const C6 = parseLocaleFloat(item.comprimentoPeca);
    const D6 = parseLocaleFloat(item.larguraPeca);
    const E6 = parseLocaleFloat(chapaInfo.peso);
    const F6 = parseLocaleFloat(chapaInfo.comprimento);
    const G6 = parseLocaleFloat(chapaInfo.largura);
    const H6 = (F6 === 0 || G6 === 0) ? 0 : ((C6 * E6) / F6) * (D6 / G6);
    const K6 = B6 * H6;
    return K6;
  }, [item, chapaInfo]);

  const handleConfirmDelete = () => { Alert.alert("Confirmar Exclusão", "Remover esta peça?", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", onPress: onDelete, style: "destructive" }]); };
  const compPecaRef = useRef(null);
  const largPecaRef = useRef(null);

  return (
    <View style={styles.linhaContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.inputsContainer}>
          <InputComLabel label="QTD" flex={0.7} value={item.qtd} onChangeText={(val) => onUpdate({ ...item, qtd: val })} placeholder="1" returnKeyType="next" onSubmitEditing={() => compPecaRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={compPecaRef} label="Comp. Peça" flex={1.15} value={item.comprimentoPeca} onChangeText={(val) => onUpdate({ ...item, comprimentoPeca: val })} placeholder="0" returnKeyType="next" onSubmitEditing={() => largPecaRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={largPecaRef} label="Larg. Peça" flex={1.15} value={item.larguraPeca} onChangeText={(val) => onUpdate({ ...item, larguraPeca: val })} placeholder="0" returnKeyType="done" />
        </View>
        <Pressable onPress={handleConfirmDelete} style={styles.deleteButton}><Ionicons name="trash-outline" size={24} color="#ef4444" /></Pressable>
      </View>
      <Text style={styles.subtotalTexto}>Subtotal: {resultadoLinha.toFixed(4).replace('.', ',')} Kg</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  linhaContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  // CORREÇÃO: Removemos o 'alignItems: flex-end'
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alinha o botão de deletar verticalmente
  },
  inputsContainer: { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'stretch' }, // alignItems stretch garante que todos os containers de input tenham a mesma altura
  subtotalTexto: { textAlign: 'right', marginTop: 8, fontSize: 12, fontStyle: 'italic', color: '#475569' },
  deleteButton: { marginLeft: 10, padding: 8 },
});
