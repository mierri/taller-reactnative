import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '@/components';
import { useTheme } from '@/theme';

export default function SplashScreen() {
  const { colors, radius, typography } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceApp,
          paddingVertical: 48,
        },
      ]}
    >
      <View style={styles.centerContent}>
        <AppLogo variant="icon" size={88} />

        <Text
          style={[
            typography.headingXl,
            styles.brandName,
            { color: colors.textStrong },
          ]}
        >
          PITSTOP
        </Text>

        <Text
          style={[
            typography.bodyLg,
            styles.tagline,
            { color: colors.textSecondary },
          ]}
        >
          Tu taller. Todo en orden.
        </Text>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radius.full,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    marginTop: 20,
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 8,
  },
  footer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
  },
});
