import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { LyricLine } from "@/data/songs";

interface Props {
  line: LyricLine;
  onCorrect: () => void;
  onComplete: () => void;
  lineIndex: number;
  totalLines: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WordBrickGame({ line, onCorrect, onComplete, lineIndex, totalLines }: Props) {
  const colors = useColors();

  const [available, setAvailable] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const shakeAnim = useState(() => new Animated.Value(0))[0];
  const scaleAnim = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    setAvailable(shuffle(line.words));
    setPlaced([]);
    setStatus("idle");
  }, [line]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const popIn = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const handlePickWord = (word: string, index: number) => {
    if (status !== "idle") return;
    const newAvailable = [...available];
    newAvailable.splice(index, 1);
    const newPlaced = [...placed, word];
    setAvailable(newAvailable);
    setPlaced(newPlaced);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newAvailable.length === 0) {
      checkAnswer(newPlaced);
    }
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (status !== "idle") return;
    const newPlaced = [...placed];
    newPlaced.splice(index, 1);
    setPlaced(newPlaced);
    setAvailable([...available, word]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const checkAnswer = (placedWords: string[]) => {
    const correct = placedWords.join(" ") === line.words.join(" ");
    if (correct) {
      setStatus("correct");
      popIn();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        if (lineIndex + 1 >= totalLines) {
          onComplete();
        } else {
          onCorrect();
        }
      }, 1000);
    } else {
      setStatus("wrong");
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setAvailable(shuffle(line.words));
        setPlaced([]);
        setStatus("idle");
      }, 800);
    }
  };

  const surfaceColor = colors.isDark ? (colors as any).surface ?? "#1E1E32" : colors.card;
  const correctColor = colors.isDark ? (colors as any).correct ?? "#58CC02" : "#58CC02";
  const incorrectColor = colors.isDark ? (colors as any).incorrect ?? "#FF4B4B" : "#FF4B4B";

  const answerBg =
    status === "correct" ? correctColor + "22" :
    status === "wrong" ? incorrectColor + "22" :
    surfaceColor;

  const answerBorder =
    status === "correct" ? correctColor :
    status === "wrong" ? incorrectColor :
    colors.border;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
          Remets les mots dans l'ordre
        </Text>
        <Text style={[styles.counter, { color: colors.mutedForeground }]}>
          {lineIndex + 1} / {totalLines}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.answerZone,
          {
            backgroundColor: answerBg,
            borderColor: answerBorder,
            transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {placed.length === 0 ? (
          <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>
            Appuie sur les mots ci-dessous...
          </Text>
        ) : (
          <View style={styles.brickRow}>
            {placed.map((word, i) => (
              <TouchableOpacity
                key={`placed-${i}`}
                onPress={() => handleRemoveWord(word, i)}
                style={[styles.brick, styles.placedBrick, { backgroundColor: colors.primary }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.brickText, { color: "#fff" }]}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {status !== "idle" && (
          <View style={styles.statusIcon}>
            <Feather
              name={status === "correct" ? "check-circle" : "x-circle"}
              size={22}
              color={status === "correct" ? correctColor : incorrectColor}
            />
          </View>
        )}
      </Animated.View>

      <View style={styles.availableZone}>
        <View style={styles.brickRow}>
          {available.map((word, i) => (
            <TouchableOpacity
              key={`avail-${i}`}
              onPress={() => handlePickWord(word, i)}
              style={[
                styles.brick,
                {
                  backgroundColor: surfaceColor,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.brickText, { color: colors.foreground }]}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  instruction: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  counter: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  answerZone: {
    minHeight: 70,
    borderRadius: 14,
    borderWidth: 2,
    padding: 12,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  placeholder: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  brickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  brick: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  placedBrick: {
  },
  brickText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    writingDirection: "rtl",
  },
  availableZone: {
    minHeight: 70,
    justifyContent: "center",
  },
  statusIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
