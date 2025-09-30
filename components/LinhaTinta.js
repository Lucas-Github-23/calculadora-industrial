import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputComLabel from './InputComLabel';

const parseLocaleFloat = (str) => parseFloat(String(str).replace(',', '.')) || 0;

export const LinhaTinta = ({ item, onUpdate, onDelete, tintaInfo }) => {
  const resultadoLinha = useMemo(() => {
    const comprimento = parseLocaleFloat(item.comprimento);
    const largura = parseLocaleFloat(item.largura);
    const numFaces = parseLocaleFloat(item.numFaces) || 1;
    const tintaPorM2 = parseLocaleFloat(tintaInfo.tintaPorM2);
    const area = (comprimento / 1000) * (largura / 1000);
    return area * numFaces * tintaPorM2;
  }, [item, tintaInfo]);

  const handleConfirmDelete = () => { Alert.alert("Confirmar Exclusão", "Remover este item?", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", onPress: onDelete, style: "destructive" }]); };
  const larguraRef = useRef(null);
  const numFacesRef = useRef(null);

  return (
    <View style={styles.linhaContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.inputsContainer}>
          <InputComLabel label="Comprimento (mm)" flex={1} value={item.comprimento} onChangeText={(val) => onUpdate({ ...item, comprimento: val })} returnKeyType="next" onSubmitEditing={() => larguraRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={larguraRef} label="Largura (mm)" flex={1} value={item.largura} onChangeText={(val) => onUpdate({ ...item, largura: val })} returnKeyType="next" onSubmitEditing={() => numFacesRef.current.focus()} blurOnSubmit={false} />
          <InputComLabel ref={numFacesRef} label="Nº Faces" flex={0.8} value={item.numFaces} onChangeText={(val) => onUpdate({ ...item, numFaces: val })} returnKeyType="done" />
        </View>
        <Pressable onPress={handleConfirmDelete} style={styles.deleteButton}><Ionicons name="trash-outline" size={24} color="#ef4444" /></Pressable>
      </View>
      <Text style={styles.subtotalTexto}>Subtotal: {resultadoLinha.toFixed(4).replace('.', ',')} L</Text>
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
