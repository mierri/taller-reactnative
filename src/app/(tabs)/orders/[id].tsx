import { WorkOrderDetailScreen } from '@/modules/work-orders';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function OrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <WorkOrderDetailScreen id={id ?? ''} />;
}

