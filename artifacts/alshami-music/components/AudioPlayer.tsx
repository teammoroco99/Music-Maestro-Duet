import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface Props {
  previewUrl: string;
  songTitle: string;
  coverColor: string;
}

export function AudioPlayer({ previewUrl, songTitle, coverColor }: Props) {
  const colors = useColors();

  const player = useAudioPlayer({ uri: previewUrl });
  const status = useAudioPlayerStatus(player);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const isPlaying = status.playing;
  const position = status.currentTime ?? 0;
  const duration = status.duration ?? 0;

  useEffect(() => {
    if (isPlaying) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isPlaying]);

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

  const surfaceColor = colors.isDark
    ? (colors as any).surface ?? "#1E1E32"
    : colors.card;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: surfaceColor, borderColor: colors.border },
      ]}
    >
      <View style={styles.row}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={handlePlayPause}
            style={[styles.playBtn, { backgroundColor: coverColor }]}
            activeOpacity={0.85}
          >
            {isPlaying ? (
              <Feather name="pause" size={26} color="#fff" />
            ) : (
              <Feather name="play" size={26} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.info}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {isPlaying ? "En écoute · Extrait 30s" : "Appuie pour écouter"}
          </Text>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {songTitle}
          </Text>

          <View style={styles.progressRow}>
            <View style={[styles.trackBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.trackFill,
                  {
                    backgroundColor: coverColor,
                    width: `${Math.min(progress * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>
              {duration > 0 ? formatTime(position) : "--:--"}
            </Text>
          </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
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
    minWidth: 32,
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
