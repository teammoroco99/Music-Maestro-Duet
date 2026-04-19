import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface Props {
  previewUrl: string;
  songTitle: string;
  coverColor: string;
  coverImage: string;
}

export function AudioPlayer({ previewUrl, songTitle, coverColor, coverImage }: Props) {
  const colors = useColors();

  const player = useAudioPlayer({ uri: previewUrl });
  const status = useAudioPlayerStatus(player);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const vinylAnim = useRef(new Animated.Value(0)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const vinylLoop = useRef<Animated.CompositeAnimation | null>(null);

  const isPlaying = status.playing;
  const position = status.currentTime ?? 0;
  const duration = status.duration ?? 0;

  useEffect(() => {
    if (isPlaying) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();

      vinylLoop.current = Animated.loop(
        Animated.timing(vinylAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
      );
      vinylLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      vinylLoop.current?.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [isPlaying]);

  const spin = vinylAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const progress = duration > 0 ? position / duration : 0;
  const surfaceColor = colors.isDark ? (colors as any).surface ?? "#1E1E32" : colors.card;

  return (
    <View style={[styles.container, { backgroundColor: surfaceColor, borderColor: colors.border }]}>
      <View style={styles.main}>
        <Animated.View style={[styles.coverContainer, { transform: [{ rotate: isPlaying ? spin : "0deg" }] }]}>
          <Image
            source={{ uri: coverImage }}
            style={styles.cover}
            contentFit="cover"
            transition={200}
          />
          <View style={[styles.coverOverlay, { backgroundColor: coverColor + "44" }]} />
          <View style={styles.vinylCenter} />
        </Animated.View>

        <View style={styles.details}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {isPlaying ? "▶ En écoute" : "Extrait 30s"}
          </Text>
          <Text style={[styles.songTitle, { color: colors.foreground }]} numberOfLines={2}>
            {songTitle}
          </Text>

          <View style={styles.progressRow}>
            <View style={[styles.trackBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.trackFill,
                  { backgroundColor: coverColor, width: `${Math.min(progress * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>
              {duration > 0 ? formatTime(position) : "0:30"}
            </Text>
          </View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }], alignSelf: "flex-start" }}>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={[styles.playBtn, { backgroundColor: coverColor }]}
              activeOpacity={0.85}
            >
              <Feather name={isPlaying ? "pause" : "play"} size={18} color="#fff" />
              <Text style={styles.playBtnText}>
                {isPlaying ? "Pause" : "ÉCOUTER"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={[styles.hint, { borderTopColor: colors.border }]}>
        <Feather name="headphones" size={12} color={colors.mutedForeground} />
        <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
          Écoute l'extrait puis remets les paroles dans l'ordre ci-dessous
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 16,
  },
  main: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  coverContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    position: "relative",
  },
  cover: {
    width: 90,
    height: 90,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 45,
  },
  vinylCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0E0E16",
    borderWidth: 3,
    borderColor: "#333",
    transform: [{ translateX: -9 }, { translateY: -9 }],
  },
  details: {
    flex: 1,
    gap: 6,
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  songTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: 2,
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    minWidth: 28,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 2,
  },
  playBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  hintText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
});
