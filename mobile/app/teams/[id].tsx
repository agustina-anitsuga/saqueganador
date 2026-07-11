import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TeamContainer } from '@/components/team/TeamContainer';

export default function TeamById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TeamContainer mode="VIEW" userIdParam={id} />;
}
