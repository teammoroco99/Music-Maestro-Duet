import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SongCard } from "@/components/SongCard";
import { useProgress } from "@/context/ProgressContext";
import { SONGS } from "@/data/songs";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { progress } = useProgress();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={[styles.header, { paddingTop: topPad + 16 }]}>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Al Shami Music
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Apprends les paroles
            </Text>
            <View style={[styles.statBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statText, { color: "#58CC02" }]}>
                {Object.values(progress).filter((v) => v >= 100).length} / {SONGS.length} complétés
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            progress={progress[item.id] ?? 0}
            onPress={() =>
              router.push({
                pathname: "/song/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: bottomPad + 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  statBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
