import React, { useCallback, useEffect, useRef, useState } from "react";
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

interface WordItem {
  word: string;
  wordIndex: number;
}

interface Props {
  line: LyricLine;
  onCorrect: () => void;
  onComplete: () => void;
  lineIndex: number;
  totalLines: number;
}

function shuffleItems(words: string[]): WordItem[] {
  const items: WordItem[] = words.map((w, i) => ({ word: w, wordIndex: i }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

const CORRECT_COLOR = "#58CC02";
const WRONG_COLOR = "#FF4B4B";

export function WordBrickGame({
  line,
  onCorrect,
  onComplete,
  lineIndex,
  totalLines,
}: Props) {
  const colors = useColors();

  const [available, setAvailable] = useState<WordItem[]>([]);
  const [placed, setPlaced] = useState<WordItem[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAvailable(shuffleItems(line.words));
    setPlaced([]);
    setStatus("idle");
    bannerAnim.setValue(0);
  }, [line]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const showBanner = useCallback(() => {
    Animated.spring(bannerAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [bannerAnim]);

  const handlePickWord = (item: WordItem, idx: number) => {
    if (status !== "idle") return;
    const newAvailable = [...available];
    newAvailable.splice(idx, 1);
    const newPlaced = [...placed, item];
    setAvailable(newAvailable);
    setPlaced(newPlaced);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (newAvailable.length === 0) {
      checkAnswer(newPlaced);
    }
  };

  const handleRemoveWord = (item: WordItem, idx: number) => {
    if (status !== "idle") return;
    const newPlaced = [...placed];
    newPlaced.splice(idx, 1);
    setPlaced(newPlaced);
    setAvailable([...available, item]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const checkAnswer = (placedItems: WordItem[]) => {
    const correct = placedItems.map((i) => i.word).join(" ") === line.words.join(" ");
    if (correct) {
      setStatus("correct");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showBanner();
    } else {
      setStatus("wrong");
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setAvailable(shuffleItems(line.words));
        setPlaced([]);
        setStatus("idle");
      }, 900);
    }
  };

  const handleContinue = () => {
    if (lineIndex + 1 >= totalLines) {
      onComplete();
    } else {
      onCorrect();
    }
  };

  const surfaceColor = colors.isDark
    ? (colors as any).surface ?? "#1E1E32"
    : colors.card;

  const answerBg =
    status === "correct"
      ? CORRECT_COLOR + "18"
      : status === "wrong"
      ? WRONG_COLOR + "18"
      : surfaceColor;

  const answerBorder =
    status === "correct"
      ? CORRECT_COLOR
      : status === "wrong"
      ? WRONG_COLOR
      : colors.border;

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
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        {placed.length === 0 ? (
          <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>
            Appuie sur les mots ci-dessous...
          </Text>
        ) : (
          <View style={styles.brickRow}>
            {placed.map((item, i) => (
              <TouchableOpacity
                key={`placed-${i}-${item.wordIndex}`}
                onPress={() => handleRemoveWord(item, i)}
                style={[styles.brick, { backgroundColor: colors.primary }]}
                activeOpacity={0.75}
                disabled={status !== "idle"}
              >
                <Text style={styles.brickWordLight}>{item.word}</Text>
                <Text style={styles.brickTransLight}>
                  {line.wordTranslations[item.wordIndex]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {status !== "idle" && (
          <View style={styles.statusIcon}>
            <Feather
              name={status === "correct" ? "check-circle" : "x-circle"}
              size={20}
              color={status === "correct" ? CORRECT_COLOR : WRONG_COLOR}
            />
          </View>
        )}
      </Animated.View>

      <View style={styles.availableZone}>
        <View style={styles.brickRow}>
          {available.map((item, i) => (
            <TouchableOpacity
              key={`avail-${i}-${item.wordIndex}`}
              onPress={() => handlePickWord(item, i)}
              style={[
                styles.brick,
                {
                  backgroundColor: surfaceColor,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
              activeOpacity={0.75}
            >
              <Text style={[styles.brickWord, { color: colors.foreground }]}>
                {item.word}
              </Text>
              <Text style={[styles.brickTrans, { color: colors.mutedForeground }]}>
                {line.wordTranslations[item.wordIndex]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {status === "correct" && (
        <Animated.View
          style={[
            styles.banner,
            {
              backgroundColor: CORRECT_COLOR + "15",
              borderColor: CORRECT_COLOR,
              opacity: bannerAnim,
              transform: [
                {
                  translateY: bannerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.bannerHeader}>
            <Feather name="check-circle" size={18} color={CORRECT_COLOR} />
            <Text style={[styles.bannerLabel, { color: CORRECT_COLOR }]}>
              Bonne réponse !
            </Text>
          </View>

          <Text style={[styles.bannerAr, { color: colors.foreground }]}>
            {line.text}
          </Text>
          <Text style={[styles.bannerFr, { color: colors.mutedForeground }]}>
            {line.translation}
          </Text>

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: CORRECT_COLOR }]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>
              {lineIndex + 1 >= totalLines ? "Terminer" : "Continuer"}
            </Text>
            <Feather name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
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
    minHeight: 72,
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
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
    gap: 2,
  },
  brickWord: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    writingDirection: "rtl",
  },
  brickTrans: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  brickWordLight: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    writingDirection: "rtl",
  },
  brickTransLight: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  availableZone: {
    minHeight: 72,
    justifyContent: "center",
  },
  statusIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  banner: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  bannerAr: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  bannerFr: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 4,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
});
