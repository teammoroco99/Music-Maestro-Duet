import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/context/ProgressContext";
import { SONGS } from "@/data/songs";
import { WordBrickGame } from "@/components/WordBrickGame";
import { ProgressBar } from "@/components/ProgressBar";
import * as Haptics from "expo-haptics";

export default function SongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { progress, setProgress } = useProgress();

  const song = useMemo(() => SONGS.find((s) => s.id === id), [id]);

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Chanson introuvable</Text>
      </View>
    );
  }

  const lineProgress = ((currentLineIndex) / song.lyrics.length) * 100;

  const handleCorrect = useCallback(() => {
    const next = currentLineIndex + 1;
    setCurrentLineIndex(next);
    const pct = (next / song.lyrics.length) * 100;
    setProgress(song.id, pct);
  }, [currentLineIndex, song]);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    setProgress(song.id, 100);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [song]);

  const handleRestart = () => {
    setCurrentLineIndex(0);
    setIsComplete(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const youtubeEmbed = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>body{margin:0;background:#000;}iframe{width:100%;height:100%;border:none;}</style>
    </head>
    <body>
      <iframe 
        src="https://www.youtube.com/embed/${song.youtubeId}?playsinline=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPad, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text style={[styles.navTitle, { color: colors.foreground }]} numberOfLines={1}>
            {song.titleAr}
          </Text>
          <Text style={[styles.navSub, { color: colors.mutedForeground }]} numberOfLines={1}>
            {song.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowVideo((v) => !v)}
          style={[styles.toggleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name={showVideo ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 32 }}
      >
        {showVideo && (
          <View style={styles.videoContainer}>
            {Platform.OS === "web" ? (
              <iframe
                src={`https://www.youtube.com/embed/${song.youtubeId}?playsinline=1&rel=0&modestbranding=1`}
                style={{ width: "100%", height: "100%", border: "none" } as any}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <WebView
                source={{ html: youtubeEmbed }}
                style={styles.webview}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
              />
            )}
          </View>
        )}

        <View style={styles.gameSection}>
          <View style={styles.progressSection}>
            <ProgressBar progress={isComplete ? 100 : lineProgress} />
            {isComplete && (
              <Text style={[styles.completedLabel, { color: "#58CC02" }]}>Complété!</Text>
            )}
          </View>

          {isComplete ? (
            <View style={styles.completeCard}>
              <View style={[styles.badge, { backgroundColor: "#58CC0222" }]}>
                <Feather name="award" size={40} color="#58CC02" />
              </View>
              <Text style={[styles.completeTitle, { color: colors.foreground }]}>
                Bravo! Tu as réussi!
              </Text>
              <Text style={[styles.completeSub, { color: colors.mutedForeground }]}>
                Tu connais maintenant les paroles de {song.titleAr}
              </Text>
              <TouchableOpacity
                style={[styles.restartBtn, { backgroundColor: colors.primary }]}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.restartText}>Recommencer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.backHomeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={[styles.backHomeText, { color: colors.foreground }]}>
                  Retour aux chansons
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WordBrickGame
              key={currentLineIndex}
              line={song.lyrics[currentLineIndex]}
              onCorrect={handleCorrect}
              onComplete={handleComplete}
              lineIndex={currentLineIndex}
              totalLines={song.lyrics.length}
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
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  gameSection: {
    padding: 20,
    gap: 20,
  },
  progressSection: {
    gap: 8,
  },
  completedLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
  },
  completeCard: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  badge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  completeTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  completeSub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
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
    fontSize: 16,
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
