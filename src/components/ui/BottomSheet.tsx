import React, { useEffect, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useTheme } from "@/theme";

export type BottomSheetType = "Onboarding" | "Search" | "Capture";

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  type?: BottomSheetType;
  hideHeader?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  hideHeader = false,
  children,
  style,
  contentStyle,
}) => {
  const { colors, radius, shadows, typography } = useTheme();
  const [translateY] = useState(() => new Animated.Value(260));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      translateY.setValue(260);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 24,
          stiffness: 240,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 260,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.overlayScrim, opacity },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          pointerEvents="box-none"
          style={styles.keyboardView}
        >
          <Animated.View
            style={[
              styles.sheet,
              shadows.sheet,
              {
                backgroundColor: colors.surfaceSheet,
                borderTopLeftRadius: radius.sheet,
                borderTopRightRadius: radius.sheet,
                transform: [{ translateY }],
              },
              style,
            ]}
          >
            <View style={styles.grabberContainer}>
              <View
                style={[
                  styles.grabber,
                  {
                    backgroundColor: colors.borderGrabber,
                    borderRadius: radius.full,
                  },
                ]}
              />
            </View>

            {!hideHeader && (
              <View style={styles.header}>
                <Text
                  style={[
                    typography.headingMd,
                    styles.headerTitle,
                    { color: colors.textStrong },
                  ]}
                  numberOfLines={1}
                >
                  {title ?? ""}
                </Text>

                <Pressable
                  onPress={handleClose}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.closeButton,
                    {
                      borderRadius: radius.lg,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <X size={20} color={colors.textStrong} />
                </Pressable>
              </View>
            )}

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.content, contentStyle]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              bounces={false}
            >
              {children}
              <SafeAreaView edges={["bottom"]} />
            </ScrollView>

            <View
              pointerEvents="none"
              style={[
                styles.sheetUnderlay,
                { backgroundColor: colors.surfaceSheet },
              ]}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    position: "relative",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    maxHeight: "75%",
    position: "relative",
  },
  sheetUnderlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -600,
    height: 600,
  },
  grabberContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  grabber: {
    width: 36,
    height: 4,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    flexShrink: 0,
  },
  headerTitle: {
    flex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
