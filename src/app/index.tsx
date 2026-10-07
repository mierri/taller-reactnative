import { AppLogo } from "@/components";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const { colors, spacing, radii } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceApp,
          paddingVertical: spacing[8] + spacing[4], // 48px
        },
      ]}
    >
      <View style={styles.centerContent}>
        {/* Logo oficial de PitStop */}
        <AppLogo variant="icon" size={88} />

        <Text
          style={[
            styles.brandName,
            { color: colors.textStrong, marginTop: spacing[5] },
          ]}
        >
          PITSTOP
        </Text>

        <Text
          style={[
            styles.tagline,
            { color: colors.textSecondary, marginTop: spacing[2] },
          ]}
        >
          Tu taller. Todo en orden.
        </Text>
      </View>

      <View style={[styles.footer, { height: spacing[8] }]}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radii.xs,
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
  },
});
