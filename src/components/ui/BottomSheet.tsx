import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            shadows.sheet,
            {
              backgroundColor: colors.surfaceSheet,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
            },
            style,
          ]}
        >
          <SafeAreaView edges={["bottom"]}>
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
                  onPress={onClose}
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

            <View style={[styles.content, contentStyle]}>{children}</View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: "100%",
    overflow: "hidden",
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
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerTitle: {
    flex: 1,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
