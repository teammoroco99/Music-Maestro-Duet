import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  progress: number;
}

export function ProgressBar({ progress }: Props) {
  const colors = useColors();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.bg, { backgroundColor: colors.border }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: "#58CC02",
            width: `${clampedProgress}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    height: 8,
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 99,
  },
});
