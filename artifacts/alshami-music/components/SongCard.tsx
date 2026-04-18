import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Song } from "@/data/songs";

interface Props {
  song: Song;
  onPress: () => void;
  progress?: number;
}

const DIFF_LABELS: Record<string, string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

const DIFF_COLORS: Record<string, string> = {
  easy: "#58CC02",
  medium: "#FFD700",
  hard: "#FF4B4B",
};

export function SongCard({ song, onPress, progress = 0 }: Props) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.colorBar, { backgroundColor: song.coverColor }]}>
        <Feather name="music" size={28} color="#fff" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.titleAr, { color: colors.foreground }]} numberOfLines={1}>
          {song.titleAr}
        </Text>
        <Text style={[styles.title, { color: colors.mutedForeground }]} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: DIFF_COLORS[song.difficulty] + "22" }]}>
            <Text style={[styles.badgeText, { color: DIFF_COLORS[song.difficulty] }]}>
              {DIFF_LABELS[song.difficulty]}
            </Text>
          </View>
          {progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: "#58CC02", width: `${Math.min(progress, 100)}%` },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: "hidden",
  },
  colorBar: {
    width: 64,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  titleAr: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    textAlign: "left",
  },
  title: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressBg: {
    flex: 1,
    height: 5,
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  progressText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
