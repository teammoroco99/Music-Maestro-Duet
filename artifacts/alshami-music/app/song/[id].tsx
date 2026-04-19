import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/context/ProgressContext";
import { SONGS } from "@/data/songs";
import { PairMatchGame } from "@/components/PairMatchGame";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ProgressBar } from "@/components/ProgressBar";
import * as Haptics from "expo-haptics";

export default function SongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setProgress } = useProgress();

  const song = useMemo(() => SONGS.find((s) => s.id === id), [id]);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Chanson introuvable</Text>
      </View>
    );
  }

  const boardProgress = (currentBoardIndex / song.boards.length) * 100;

  const handleNext = useCallback(() => {
    const next = currentBoardIndex + 1;
    setCurrentBoardIndex(next);
    const pct = (next / song.boards.length) * 100;
    setProgress(song.id, pct);
  }, [currentBoardIndex, song]);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    setProgress(song.id, 100);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [song]);

  const handleRestart = () => {
    setCurrentBoardIndex(0);
    setIsComplete(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.navBar,
          {
            paddingTop: topPad,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text
            style={[styles.navTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {song.titleAr}
          </Text>
          <Text
            style={[styles.navSub, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {song.title} · {song.year} · {song.boards.length} tableaux
          </Text>
        </View>
        <View
          style={[
            styles.colorDot,
            {
              backgroundColor: song.coverColor + "33",
              borderColor: song.coverColor + "55",
            },
          ]}
        >
          <View
            style={[styles.colorDotInner, { backgroundColor: song.coverColor }]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      >
        <AudioPlayer
          previewUrl={song.previewUrl}
          songTitle={song.titleAr}
          coverColor={song.coverColor}
          coverImage={song.coverImage}
        />

        <View style={styles.gameSection}>
          <View style={styles.progressSection}>
            <ProgressBar progress={isComplete ? 100 : boardProgress} />
            <View style={styles.progressLabels}>
              <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
                {isComplete
                  ? "Complété !"
                  : `Tableau ${currentBoardIndex + 1} / ${song.boards.length}`}
              </Text>
              {isComplete && (
                <Text style={[styles.completeLabel, { color: "#58CC02" }]}>
                  ✓ Maîtrisé
                </Text>
              )}
            </View>
          </View>

          {isComplete ? (
            <View style={styles.completeCard}>
              <View style={[styles.awardBadge, { backgroundColor: "#58CC0222" }]}>
                <Feather name="award" size={48} color="#58CC02" />
              </View>
              <Text style={[styles.completeTitle, { color: colors.foreground }]}>
                Bravo ! Tu as maîtrisé cette chanson !
              </Text>
              <Text
                style={[styles.completeSub, { color: colors.mutedForeground }]}
              >
                Tu viens de travailler {song.boards.length} tableaux de {song.titleAr}{" "}
                et tu connais maintenant tout le vocabulaire de cette chanson.
              </Text>
              <TouchableOpacity
                style={[styles.restartBtn, { backgroundColor: colors.primary }]}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.restartText}>Recommencer depuis le début</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.backHomeBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={[styles.backHomeText, { color: colors.foreground }]}>
                  Retour aux chansons
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <PairMatchGame
              key={currentBoardIndex}
              board={song.boards[currentBoardIndex]}
              boardIndex={currentBoardIndex}
              totalBoards={song.boards.length}
              onNext={handleNext}
              onComplete={handleComplete}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navCenter: {
    flex: 1,
  },
  navTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  navSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  gameSection: {
    padding: 20,
    gap: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  completeLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  completeCard: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  awardBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  completeSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  restartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  restartText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  backHomeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  backHomeText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
