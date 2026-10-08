import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, ChevronLeft, Search } from "lucide-react-native";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLogo } from "./AppLogo";

export interface AppHeaderProps {
  type?: "Home" | "Detail";
  title?: string;
  avatarInitials?: string;
  hasNotification?: boolean;
  hideActions?: boolean;
  rightContent?: React.ReactNode;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
  onBackPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  type = "Home",
  title = "Detalles",
  avatarInitials = "DS",
  hasNotification = true,
  hideActions = false,
  rightContent,
  onSearchPress,
  onNotificationPress,
  onAvatarPress,
  onBackPress,
}) => {
  const { colors, typography, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const BackIcon = Platform.OS === "ios" ? ChevronLeft : ArrowLeft;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          backgroundColor: colors.surfaceGlass,
          borderBottomColor: colors.borderGlass,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {type === "Home" ? (
          <View style={styles.logoContainer}>
            <AppLogo variant="full" size={40} />
          </View>
        ) : (
          <View style={styles.detailLeft}>
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.backButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <BackIcon size={24} color={colors.textLabel} />
            </TouchableOpacity>
            <Text
              style={[
                typography.labelLg,
                styles.detailTitle,
                { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          {rightContent ? (
            rightContent
          ) : (
            <>
              {!hideActions && (
                <>
                  <TouchableOpacity
                    onPress={onSearchPress}
                    style={styles.actionIconBtn}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Buscar"
                  >
                    <Search
                      size={22}
                      color={colors.textLabel}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onNotificationPress}
                    style={styles.actionIconBtn}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Notificaciones"
                  >
                    <Bell size={22} color={colors.textLabel} strokeWidth={2} />
                    {hasNotification && (
                      <View
                        style={[
                          styles.notificationDot,
                          {
                            backgroundColor: colors.brandAccentAmber,
                            borderColor: colors.surfaceShell,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={onAvatarPress}
                style={styles.avatarButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Perfil"
              >
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      borderRadius: radius.full,
                      backgroundColor: colors.surfaceAvatar,
                      borderColor: colors.borderCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.captionMedium,
                      { color: colors.accentAvatarText },
                    ]}
                  >
                    {avatarInitials}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    gap: 8,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  detailTitle: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionIconBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  avatarButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
