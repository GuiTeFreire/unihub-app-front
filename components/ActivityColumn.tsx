import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import ActivityCard from "./ActivityCard";

export default function ActivityColumn({ 
  title, 
  activities, 
  onSelect, 
  onDrop,
  draggedActivity,
  onDragStart,
  onDragEnd,
  selectedActivity
}: any) {
  const { colors } = useTheme();

  const handleDragStart = (activity: any) => {
    onDragStart?.(activity);
  };

  const handleDragEnd = (activity: any, translationX: number, translationY: number) => {
    const dropThreshold = 100;
    
    if (Math.abs(translationX) > dropThreshold) {
      let newStatus = activity.status;
      
      if (translationX > dropThreshold) {
        if (activity.status === "pendente") newStatus = "emAndamento";
        else if (activity.status === "emAndamento") newStatus = "concluido";
      } else if (translationX < -dropThreshold) {

        if (activity.status === "concluido") newStatus = "emAndamento";
        else if (activity.status === "emAndamento") newStatus = "pendente";
      }
      
      if (newStatus !== activity.status) {
        onDrop?.({ ...activity, status: newStatus });
      }
    }
    
    onDragEnd?.();
  };

  return (
    <View 
      style={[
        styles.column, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        }
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.count, { color: colors.mutedForeground }]}>
        {activities.length} {activities.length === 1 ? 'item' : 'itens'}
      </Text>
      
      {activities.map((activity: any) => (
        <ActivityCard 
          key={activity.id} 
          activity={activity} 
          onPress={onSelect}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={draggedActivity?.id === activity.id}
          isSelected={selectedActivity?.id === activity.id}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    padding: 8,
    margin: 8,
    borderRadius: 8,
    minWidth: 250,
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    marginBottom: 8,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dropText: {
    fontSize: 14,
    fontWeight: '500',
  },
});