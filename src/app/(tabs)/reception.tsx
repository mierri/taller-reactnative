import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { AppHeader } from '@/components';

export default function ReceptionScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader type="Home" />
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.textStrong }]}>
          Recepción de Vehículos
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Control de ingresos e inspección inicial de bahía.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

