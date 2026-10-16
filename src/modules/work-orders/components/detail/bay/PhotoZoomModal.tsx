import React from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useTheme } from "@/theme";
import { DetailPhotoItem } from "../../../types/work-order-detail.types";
import { formatDetailDate } from "../../../utils/detail-formatters";

export interface PhotoZoomModalProps {
  visible: boolean;
  photo: DetailPhotoItem | null;
  onClose: () => void;
}

const categoryLabels: Record<DetailPhotoItem["category"], string> = {
  RECEPTION: "Recepción",
  INSPECTION: "Inspección",
  PROCESS: "Proceso",
  QUALITY_CONTROL: "Control de calidad",
  DELIVERY: "Entrega",
};

export const PhotoZoomModal: React.FC<PhotoZoomModalProps> = ({
  visible,
  photo,
  onClose,
}) => {
  const { colors, typography, radius } = useTheme();

  if (!photo) return null;

  const categoryName = categoryLabels[photo.category] || "Evidencia";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.surfaceSheet }]}>
        <SafeAreaView style={styles.safeHeader}>
          <View style={styles.header}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.captionMedium,
                  { color: colors.textStrong },
                ]}
              >
                {categoryName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.8}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radius.full,
                },
              ]}
            >
              <X size={22} color={colors.textStrong} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          style={styles.zoomScroll}
          contentContainerStyle={styles.zoomContainer}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: photo.url }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </ScrollView>

        <SafeAreaView style={styles.safeFooter}>
          <View
            style={[
              styles.footer,
              {
                backgroundColor: colors.surfaceCard,
                borderTopColor: colors.borderDivider,
              },
            ]}
          >
            <Text
              style={[
                typography.labelLg,
                styles.captionText,
                { color: colors.textStrong },
              ]}
            >
              {photo.caption || "Fotografía de la bahía"}
            </Text>
            <Text
              style={[
                typography.caption,
                styles.dateText,
                { color: colors.textMuted },
              ]}
            >
              {formatDetailDate(photo.createdAt)}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  safeHeader: {
    zIndex: 10,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomScroll: {
    flex: 1,
  },
  zoomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  safeFooter: {
    zIndex: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
  },
  captionText: {
    textAlign: "center",
  },
  dateText: {
    textAlign: "center",
  },
});
