import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STORAGE_KEY = '@calculos_chapas_history';

const CALC_DETAILS = {
  ChapasKg: { title: 'Chapas por Peso', unit: 'Kg' },
  TubosKg: { title: 'Tubos por Peso', unit: 'Kg' },
  ChapasUn: { title: 'Unidade de Chapas', unit: '' },
  TintaL: { title: 'Tinta por Área', unit: 'L' },
};

const HistoryItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const details = CALC_DETAILS[item.tipo] || { title: 'Cálculo', unit: '' };

  const toggleExpand = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setIsExpanded(!isExpanded); };

  const renderMasterDetails = () => {
    switch (item.tipo) {
      case 'ChapasKg':
        return <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Chapa:</Text> {item.chapaInfo.comprimento}mm x {item.chapaInfo.largura}mm | Peso: {item.chapaInfo.peso}Kg</Text>;
      case 'ChapasUn':
        // No histórico salvo, o nome da propriedade é materialInfo
        return <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Material:</Text> {item.materialInfo.comprimento}mm x {item.materialInfo.largura}mm</Text>;
      case 'TubosKg':
        return <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Barra:</Text> {item.barraInfo.comprimento}mm | Peso: {item.barraInfo.peso}Kg</Text>;
      case 'TintaL':
        return <Text style={styles.detailText}><Text style={{fontWeight: 'bold'}}>Consumo:</Text> {item.tintaInfo.tintaPorM2} L/m²</Text>;
      default:
        return null;
    }
  };

  const renderPiecesList = () => {
    const list = item.pecas || item.areas;
    if (!list || list.length === 0) return null;

    return (
      <View style={styles.pecasListContainer}>
        <Text style={styles.pecasTitle}>Itens Calculados ({list.length})</Text>
        {list.map((peca, index) => (
          <View key={peca.id || index} style={styles.pecaItemContainer}>
            {item.tipo === 'ChapasKg' && <Text style={styles.pecaText}>• Qtd: <Text style={styles.pecaValue}>{peca.qtd}</Text> | Comp: <Text style={styles.pecaValue}>{peca.comprimentoPeca}mm</Text> | Larg: <Text style={styles.pecaValue}>{peca.larguraPeca}mm</Text></Text>}
            {item.tipo === 'ChapasUn' && <Text style={styles.pecaText}>• Qtd: <Text style={styles.pecaValue}>{peca.quantidade}</Text> | Comp: <Text style={styles.pecaValue}>{peca.comprimentoPeca}mm</Text> | Larg: <Text style={styles.pecaValue}>{peca.larguraPeca}mm</Text></Text>}
            {item.tipo === 'TubosKg' && <Text style={styles.pecaText}>• Qtd M: <Text style={styles.pecaValue}>{peca.qtdMontagem}</Text> | Qtd P: <Text style={styles.pecaValue}>{peca.qtdPeca}</Text> | Comp: <Text style={styles.pecaValue}>{peca.compPeca}mm</Text></Text>}
            {item.tipo === 'TintaL' && <Text style={styles.pecaText}>• Comp: <Text style={styles.pecaValue}>{peca.comprimento}mm</Text> | Larg: <Text style={styles.pecaValue}>{peca.largura}mm</Text> | Faces: <Text style={styles.pecaValue}>{peca.numFaces}</Text></Text>}
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <Pressable onPress={toggleExpand} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.itemType}>{details.title}</Text>
          <Text style={styles.itemDate}>{new Date(item.id).toLocaleDateString('pt-BR')} às {new Date(item.id).toLocaleTimeString('pt-BR').slice(0, 5)}</Text>
        </View>
        <View style={styles.itemTotalContainer}>
          <Text style={styles.itemTotalValue}>{item.total.toFixed(4).replace('.', ',')}</Text>
          <Text style={styles.itemTotalUnit}>{details.unit}</Text>
        </View>
      </View>
      {isExpanded && (
        <View>
          <View style={styles.itemDetails}>{renderMasterDetails()}</View>
          {renderPiecesList()}
        </View>
      )}
      <View style={styles.chevronContainer}><Ionicons name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#64748b" /></View>
    </Pressable>
  );
};

export default function HistoricoScreen() {
  const [history, setHistory] = useState([]);

  useFocusEffect(useCallback(() => {
    const loadHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) setHistory(JSON.parse(jsonValue));
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
      }
    };
    loadHistory();
  }, []));

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Deseja apagar todos os registros? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar Tudo",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setHistory([]);
            } catch(e) {
              Alert.alert("Erro", "Não foi possível limpar o histórico.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Cálculos</Text>
        {history.length > 0 && (
          <Pressable onPress={handleClearHistory} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={styles.clearButtonText}>Limpar</Text>
          </Pressable>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="archive-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>Histórico Vazio</Text>
          <Text style={styles.emptySubtext}>Os cálculos que você salvar aparecerão aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HistoryItem item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  clearButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearButtonText: { color: '#ef4444', fontWeight: '500' },
  listContainer: { padding: 16 },
  itemContainer: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTextContainer: { flex: 1, marginRight: 8 },
  itemType: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  itemDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  itemTotalContainer: { alignItems: 'flex-end' },
  itemTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#0c4a6e' },
  itemTotalUnit: { fontSize: 14, color: '#0c4a6e', fontWeight: '500' },
  itemDetails: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  detailText: { fontSize: 13, color: '#334155' },
  pecasListContainer: { marginTop: 10, },
  pecasTitle: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  pecaItemContainer: { backgroundColor: '#f8fafc', borderRadius: 6, padding: 8, marginBottom: 4 },
  pecaText: { fontSize: 13, color: '#475569', flexWrap: 'wrap' },
  pecaValue: { fontWeight: '600' },
  chevronContainer: { alignItems: 'center', paddingTop: 8, marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#475569', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
});
