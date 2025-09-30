import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Telas principais
import CalculadorasScreen from './screens/CalculadorasScreen';
import HistoricoScreen from './screens/HistoricoScreen';

// Telas das calculadoras - CAMINHOS CORRIGIDOS
import CalculoChapasKgScreen from './screens/calculators/CalculoChapasKgScreen';
import CalculoTubosScreen from './screens/calculators/CalculoTubosScreen';
import CalculoChapasUnScreen from './screens/calculators/CalculoChapasUnScreen';
import CalculoTintaScreen from './screens/calculators/CalculoTintaScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente para a Pilha de Navegação das Calculadoras
function CalculadorasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalculadorasMenu" component={CalculadorasScreen} />
      <Stack.Screen name="CalculoChapasKg" component={CalculoChapasKgScreen} />
      <Stack.Screen name="CalculoTubos" component={CalculoTubosScreen} />
      <Stack.Screen name="CalculoChapasUn" component={CalculoChapasUnScreen} />
      <Stack.Screen name="CalculoTinta" component={CalculoTintaScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Calculadoras') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Histórico') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      })}
    >
      <Tab.Screen name="Calculadoras" component={CalculadorasStack} options={{tabBarLabel: 'Calculadoras'}}/>
      <Tab.Screen name="Histórico" component={HistoricoScreen} options={{tabBarLabel: 'Histórico'}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
