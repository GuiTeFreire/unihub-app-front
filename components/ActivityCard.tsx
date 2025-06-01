import React, { useRef } from "react";
import { Text, StyleSheet, Pressable, Animated } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { PanGestureHandler } from "react-native-gesture-handler";

export default function ActivityCard({ activity, onPress, onDragStart, onDragEnd, isDragging }: any) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleHandlerStateChange = (event: any) => {
    const { state, translationX, translationY } = event.nativeEvent;
    
    if (state === 2) {
      longPressTimer.current = setTimeout(() => {
        onDragStart && onDragStart(activity);
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      }, 800);
    } else if (state === 5) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      
      onDragEnd && onDragEnd(activity, translationX, translationY);
      

      Animated.parallel([
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else if (state === 3) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      

      Animated.parallel([
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleHandlerStateChange}
    >
      <Animated.View
        style={[
          {
            transform: [
              { translateX },
              { translateY },
              { scale }
            ],
          },
          isDragging && styles.dragging
        ]}
      >
        <Pressable
          onPress={() => !isDragging && onPress(activity)}
          style={({ pressed }) => [
            styles.card,
            { 
              backgroundColor: colors.card, 
              opacity: pressed ? 0.85 : 1,
              borderColor: isDragging ? colors.primary : 'transparent',
              borderWidth: isDragging ? 2 : 0,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{activity.title}</Text>
          <Text style={{ color: colors.mutedForeground }}>{activity.disciplina}</Text>
          <Text style={{ color: colors.mutedForeground }}>Prazo: {activity.prazo}</Text>
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  dragging: {
    zIndex: 1000,
    elevation: 8,
  },
});