import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useTheme } from '@/theme';
import { CustomBottomNav } from '@/components';

export default function TabLayout() {
  const { colors } = useTheme();

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs
        tintColor={colors.brandPrimary}
        iconColor={{
          default: colors.textMuted,
          selected: colors.brandPrimary,
        }}
        labelStyle={{
          default: { color: colors.textMuted },
          selected: { color: colors.brandPrimary },
        }}
      >
        <NativeTabs.Trigger name="orders">
          <NativeTabs.Trigger.Label>Órdenes</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="doc.text.fill" md="receipt_long" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="cash">
          <NativeTabs.Trigger.Label>Caja</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="banknote.fill" md="payments" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="finance">
          <NativeTabs.Trigger.Label>Finanzas</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf="chart.line.uptrend.xyaxis"
            md="trending_up"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="inventory">
          <NativeTabs.Trigger.Label>Inventario</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="shippingbox.fill" md="inventory_2" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="more">
          <NativeTabs.Trigger.Label>Más</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="ellipsis" md="more_horiz" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="index" hidden />
        <NativeTabs.Trigger name="reception" hidden />
        <NativeTabs.Trigger name="invoices" hidden />
        <NativeTabs.Trigger name="bay" hidden />
      </NativeTabs>
    );
  }

  return (
    <Tabs
      initialRouteName="orders"
      tabBar={(props) => <CustomBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="orders" options={{ title: 'Órdenes' }} />
      <Tabs.Screen name="cash" options={{ title: 'Caja' }} />
      <Tabs.Screen name="finance" options={{ title: 'Finanzas' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventario' }} />
      <Tabs.Screen name="more" options={{ title: 'Más' }} />

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="reception" options={{ href: null }} />
      <Tabs.Screen name="invoices" options={{ href: null }} />
      <Tabs.Screen name="bay" options={{ href: null }} />
    </Tabs>
  );
}
