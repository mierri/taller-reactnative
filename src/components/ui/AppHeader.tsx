import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, ChevronLeft, Search } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { AppLogo } from './AppLogo';

export interface AppHeaderProps {
  type?: 'Home' | 'Detail';
  title?: string;
  avatarInitials?: string;
  hasNotification?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
  onBackPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  type = 'Home',
  title = 'Detalles',
  avatarInitials = 'DS',
  hasNotification = true,
  onSearchPress,
  onNotificationPress,
  onAvatarPress,
  onBackPress,
}) => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const shellBg = isDark
    ? 'rgba(22, 33, 27, 0.85)'
    : 'rgba(244, 246, 239, 0.85)';

  const borderBottomColor = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.6)';

  const BackIcon = Platform.OS === 'ios' ? ChevronLeft : ArrowLeft;
  const backIconSize = Platform.OS === 'ios' ? 26 : 22;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: shellBg,
          borderBottomColor,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {type === 'Home' ? (
          <View style={styles.logoContainer}>
            <AppLogo variant="full" size={28} />
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
              <BackIcon size={backIconSize} color={colors.textStrong} />
            </TouchableOpacity>
            <Text
              style={[styles.detailTitle, { color: colors.textStrong }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onSearchPress}
            style={styles.actionIconBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Buscar"
          >
            <Search size={22} color={colors.textStrong} strokeWidth={1.9} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.actionIconBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
          >
            <Bell size={22} color={colors.textStrong} strokeWidth={1.9} />
            {hasNotification && (
              <View
                style={[
                  styles.notificationBadge,
                  {
                    backgroundColor: colors.brandAccentAmber,
                    borderColor: colors.surfaceSheet,
                  },
                ]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onAvatarPress}
            style={[
              styles.avatar,
              {
                backgroundColor: colors.surfaceAvatar,
                borderColor: '#ffffff',
              },
            ]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Perfil"
          >
            <Text
              style={[styles.avatarText, { color: colors.accentAvatarText }]}
            >
              {avatarInitials}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingTop: 48,
    paddingHorizontal: 20,
    borderBottomWidth: 1.2,
    justifyContent: 'center',
    zIndex: 100,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
  },
});
