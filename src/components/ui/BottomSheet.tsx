import { useTheme } from "@/theme";
import { X } from "lucide-react-native";
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
  const { colors, radii, spacing, shadows } = useTheme();

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
        {/* Scrim rgba(21,41,30,.35) */}
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}
          onPress={onClose}
        />

        {/* Sheet fill sheet · radio superior 30 · sombra sheet */}
        <View
          style={[
            styles.sheet,
            shadows.sheet,
            {
              backgroundColor: colors.surfaceSheet,
              borderTopLeftRadius: radii.sheet, // radio superior 30
              borderTopRightRadius: radii.sheet,
            },
            style,
          ]}
        >
          <SafeAreaView edges={["bottom"]}>
            {/* Grabber 36×4 (#ccd5c5 / borderGrabber) */}
            <View style={styles.grabberContainer}>
              <View
                style={[
                  styles.grabber,
                  { backgroundColor: colors.borderGrabber },
                ]}
              />
            </View>

            {/* Encabezado h 72 con título 18/28 600 y cierre 48×48 */}
            {!hideHeader && (
              <View
                style={[
                  styles.header,
                  { paddingHorizontal: spacing[6] }, // px 24
                ]}
              >
                <Text
                  style={[styles.headerTitle, { color: colors.textStrong }]}
                  numberOfLines={1}
                >
                  {title ?? ""}
                </Text>

                <Pressable
                  onPress={onClose}
                  hitSlop={spacing[2]}
                  style={({ pressed }) => [
                    styles.closeButton,
                    {
                      borderRadius: radii.lg,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <X size={20} color={colors.textStrong} />
                </Pressable>
              </View>
            )}

            {/* Contenido px 24 */}
            <View
              style={[
                styles.content,
                { paddingHorizontal: spacing[6] }, // px 24
                contentStyle,
              ]}
            >
              {children}
            </View>
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
    paddingTop: 10,
    paddingBottom: 4,
  },
  grabber: {
    width: 36, // 36x4
    height: 4,
    borderRadius: 2,
  },
  header: {
    height: 72, // h 72 de la especificación
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 28, // 18/28 600
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    width: 48, // cierre 48x48
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 24,
  },
});
