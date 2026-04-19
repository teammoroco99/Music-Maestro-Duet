import React, { useEffect, useRef, useState } from "react";
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
import { PairBoard } from "@/data/songs";

interface Props {
  board: PairBoard;
  boardIndex: number;
  totalBoards: number;
  onNext: () => void;
  onComplete: () => void;
}

type CellStatus = "idle" | "selected" | "flash_correct" | "flash_wrong" | "matched";

const CORRECT = "#58CC02";
const WRONG = "#FF4B4B";

function shuffleIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PairMatchGame({
  board,
  boardIndex,
  totalBoards,
  onNext,
  onComplete,
}: Props) {
  const colors = useColors();

  const [selectedFr, setSelectedFr] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [flashCorrect, setFlashCorrect] = useState<number | null>(null);
  const [flashWrong, setFlashWrong] = useState<{ fr: number; ar: number } | null>(null);
  const [arOrder, setArOrder] = useState<number[]>([]);
  const [boardDone, setBoardDone] = useState(false);

  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSelectedFr(null);
    setMatched(new Set());
    setFlashCorrect(null);
    setFlashWrong(null);
    setArOrder(shuffleIndices(board.pairs.length));
    setBoardDone(false);
    successAnim.setValue(0);
  }, [board]);

  const isLocked = flashCorrect !== null || flashWrong !== null || boardDone;

  const handleFrTap = (pairIdx: number) => {
    if (matched.has(pairIdx) || isLocked) return;
    setSelectedFr(pairIdx === selectedFr ? null : pairIdx);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleArTap = (pairIdx: number) => {
    if (matched.has(pairIdx) || isLocked || selectedFr === null) return;

    if (selectedFr === pairIdx) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFlashCorrect(pairIdx);
      setSelectedFr(null);

      setTimeout(() => {
        setFlashCorrect(null);
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(pairIdx);
          if (next.size === board.pairs.length) {
            setBoardDone(true);
            Animated.timing(successAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setTimeout(() => {
                if (boardIndex + 1 >= totalBoards) onComplete();
                else onNext();
              }, 600);
            });
          }
          return next;
        });
      }, 550);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFlashWrong({ fr: selectedFr, ar: pairIdx });
      setTimeout(() => {
        setFlashWrong(null);
        setSelectedFr(null);
      }, 450);
    }
  };

  const getFrStatus = (idx: number): CellStatus => {
    if (matched.has(idx)) return "matched";
    if (flashCorrect === idx) return "flash_correct";
    if (flashWrong?.fr === idx) return "flash_wrong";
    if (selectedFr === idx) return "selected";
    return "idle";
  };

  const getArStatus = (idx: number): CellStatus => {
    if (matched.has(idx)) return "matched";
    if (flashCorrect === idx) return "flash_correct";
    if (flashWrong?.ar === idx) return "flash_wrong";
    return "idle";
  };

  const surface = colors.isDark ? (colors as any).surface ?? "#1E1E32" : colors.card;

  const cellBg = (s: CellStatus) => {
    switch (s) {
      case "selected": return colors.primary;
      case "flash_correct": return CORRECT;
      case "flash_wrong": return WRONG;
      default: return surface;
    }
  };

  const cellBorder = (s: CellStatus) => {
    switch (s) {
      case "selected": return colors.primary;
      case "flash_correct": return CORRECT;
      case "flash_wrong": return WRONG;
      case "matched": return "transparent";
      default: return colors.border;
    }
  };

  const cellText = (s: CellStatus) =>
    ["selected", "flash_correct", "flash_wrong"].includes(s) ? "#fff" : colors.foreground;

  const progress = (boardIndex / totalBoards) * 100;
  const matchedCount = matched.size;

  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>
        <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
            Tableau {boardIndex + 1} / {totalBoards}
          </Text>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
            {matchedCount} / {board.pairs.length} associés
          </Text>
        </View>
      </View>

      <View style={[styles.instrRow]}>
        <Feather name="info" size={13} color={colors.mutedForeground} />
        <Text style={[styles.instr, { color: colors.mutedForeground }]}>
          Clique sur un mot français puis sur son équivalent arabe
        </Text>
      </View>

      <View style={[styles.zone, { borderColor: colors.border, backgroundColor: surface + "88" }]}>
        <View style={styles.zoneLabelRow}>
          <Text style={styles.zoneFlag}>🇫🇷</Text>
          <Text style={[styles.zoneLabel, { color: colors.mutedForeground }]}>Français</Text>
        </View>
        <View style={styles.bubblesWrap}>
          {board.pairs.map((pair, idx) => {
            const s = getFrStatus(idx);
            return (
              <TouchableOpacity
                key={`fr-${idx}`}
                onPress={() => handleFrTap(idx)}
                disabled={s === "matched"}
                activeOpacity={0.75}
                style={[
                  styles.bubble,
                  {
                    backgroundColor: s === "matched" ? "transparent" : cellBg(s),
                    borderColor: cellBorder(s),
                    opacity: s === "matched" ? 0 : 1,
                  },
                ]}
              >
                <Text style={[styles.bubbleFr, { color: cellText(s) }]}>
                  {pair.fr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Feather name="link-2" size={16} color={colors.mutedForeground} />
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={[styles.zone, { borderColor: colors.border, backgroundColor: surface + "88" }]}>
        <View style={styles.zoneLabelRow}>
          <Text style={styles.zoneFlag}>🇸🇦</Text>
          <Text style={[styles.zoneLabel, { color: colors.mutedForeground }]}>Arabe</Text>
        </View>
        <View style={styles.bubblesWrap}>
          {arOrder.map((pairIdx) => {
            const s = getArStatus(pairIdx);
            return (
              <TouchableOpacity
                key={`ar-${pairIdx}`}
                onPress={() => handleArTap(pairIdx)}
                disabled={s === "matched" || selectedFr === null}
                activeOpacity={0.75}
                style={[
                  styles.bubble,
                  {
                    backgroundColor: s === "matched" ? "transparent" : cellBg(s),
                    borderColor: cellBorder(s),
                    opacity: s === "matched" ? 0 : 1,
                  },
                ]}
              >
                <Text style={[styles.bubbleAr, { color: cellText(s) }]}>
                  {board.pairs[pairIdx].ar}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.dotsRow}>
        {board.pairs.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: matched.has(i) ? CORRECT : colors.border },
            ]}
          />
        ))}
      </View>

      {boardDone && (
        <Animated.View
          style={[
            styles.nextBanner,
            {
              backgroundColor: CORRECT + "18",
              borderColor: CORRECT,
              opacity: successAnim,
              transform: [{ scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            },
          ]}
        >
          <Feather name="check-circle" size={18} color={CORRECT} />
          <Text style={[styles.nextBannerText, { color: CORRECT }]}>
            Tableau terminé !
            {boardIndex + 1 < totalBoards
              ? ` Tableau suivant : ${boardIndex + 2} / ${totalBoards}`
              : " Chanson complète !"}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  progressSection: { gap: 6 },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  instrRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  instr: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  zone: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  zoneLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  zoneFlag: { fontSize: 14 },
  zoneLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  bubblesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  bubbleFr: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  bubbleAr: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    writingDirection: "rtl",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nextBanner: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  nextBannerText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
});
