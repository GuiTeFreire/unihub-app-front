import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import ActivityCard from "./ActivityCard";

export default function ActivityColumn({ 
  title, 
  status, 
  activities, 
  onSelect, 
  onDrop,
  draggedActivity,
  onDragStart,
  onDragEnd 
}: any) {
  const { colors } = useTheme();
  const [isDropZone, setIsDropZone] = useState(false);

  const handleDragStart = (activity: any) => {
    onDragStart && onDragStart(activity);
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
        onDrop && onDrop({ ...activity, status: newStatus });
      }
    }
    
    onDragEnd && onDragEnd();
    setIsDropZone(false);
  };

  const handleLayout = (event: any) => {
    if (draggedActivity && draggedActivity.status !== status) {
      setIsDropZone(!!draggedActivity);
    } else {
      setIsDropZone(false);
    }
  };

  return (
    <View 
      style={[
        styles.column, 
        { 
          backgroundColor: isDropZone ? colors.primary + '20' : colors.card,
          borderColor: isDropZone ? colors.primary : colors.border,
          borderWidth: isDropZone ? 2 : 1,
        }
      ]}
      onLayout={handleLayout}
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
        />
      ))}
      
      {isDropZone && activities.length === 0 && (
        <View style={[styles.dropZone, { borderColor: colors.primary }]}>
          <Text style={[styles.dropText, { color: colors.primary }]}>
            Solte aqui
          </Text>
        </View>
      )}
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