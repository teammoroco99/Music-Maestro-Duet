import { useColorScheme } from "react-native";
import colors from "@/constants/colors";

export function useColors() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const palette =
    isDark && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius, isDark };
}
