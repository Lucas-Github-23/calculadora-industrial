import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputComLabel from './InputComLabel';

const parseLocaleFloat = (str) => parseFloat(String(str).replace(',', '.')) || 0;

export const LinhaChapaUn = ({ item, onUpdate, onDelete, materialInfo }) => { // <-- RECEBENDO A PROP COM O NOME CORRETO
  const resultadoLinha = useMemo(() => {
    // Se a prop não chegar por algum motivo, evitamos o crash
    if (!materialInfo) return 0;

    const compPeca = parseLocaleFloat(item.comprimentoPeca);
    const largPeca = parseLocaleFloat(item.larguraPeca);
    const quantidade = parseLocaleFloat(item.quantidade);
    const compMaterial = parseLocaleFloat(materialInfo.comprimento);
    const largMaterial = parseLocaleFloat(materialInfo.largura);

    const areaMaterial = compMaterial * largMaterial;
    const areaPeca = compPeca * largPeca;

    if (areaMaterial === 0) return 0;
    
    return quantidade * (areaPeca / areaMaterial);
  }, [item, materialInfo]);

  const handleConfirmDelete = () => { Alert.alert("Confirmar Exclusão", "Remover este item?", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", onPress: onDelete, style: "destructive" }]); };
  const largPecaRef = useRef(null);
  const qtdRef = useRef(null);

  return (
    <View style={styles.linhaContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.inputsContainer}>
          <InputComLabel 
            label="Comp. Peça (mm)" 
            flex={1} 
            value={item.comprimentoPeca} 
            onChangeText={(val) => onUpdate({ ...item, comprimentoPeca: val })} 
            returnKeyType="next" 
            onSubmitEditing={() => largPecaRef.current.focus()} 
            blurOnSubmit={false} 
          />
          <InputComLabel 
            ref={largPecaRef} 
            label="Larg. Peça (mm)" 
            flex={1} 
            value={item.larguraPeca} 
            onChangeText={(val) => onUpdate({ ...item, larguraPeca: val })} 
            returnKeyType="next" 
            onSubmitEditing={() => qtdRef.current.focus()}
            blurOnSubmit={false} 
          />
          <InputComLabel 
            ref={qtdRef} 
            label="Quantidade" 
            flex={0.8} 
            value={item.quantidade} 
            onChangeText={(val) => onUpdate({ ...item, quantidade: val })} 
            returnKeyType="done" 
          />
        </View>
        <Pressable onPress={handleConfirmDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>
      <Text style={styles.subtotalTexto}>Subtotal: {resultadoLinha.toFixed(4).replace('.', ',')} chapas</Text>
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
