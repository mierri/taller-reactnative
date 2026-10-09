import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Camera, Plus, ZoomIn } from "lucide-react-native";
import { useTheme } from "@/theme";
import { DetailPhotoItem } from "../../types/work-order-detail.types";

export interface BayPhotosCarouselProps {
  photos: DetailPhotoItem[];
  onSelectPhoto: (photo: DetailPhotoItem) => void;
  onAddPhoto: () => void;
}

export const BayPhotosCarousel: React.FC<BayPhotosCarouselProps> = ({
  photos,
  onSelectPhoto,
  onAddPhoto,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
          FOTOS Y EVIDENCIA {photos.length > 0 ? `(${photos.length})` : ""}
        </Text>

        <TouchableOpacity
          onPress={onAddPhoto}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              typography.buttonMd,
              styles.addLink,
              { color: colors.brandPrimaryText },
            ]}
          >
            + Tomar o subir
          </Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <TouchableOpacity
          onPress={onAddPhoto}
          activeOpacity={0.8}
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surfaceTile,
              borderColor: colors.borderDashed,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Camera size={24} color={colors.brandPrimary} strokeWidth={2} />
          <Text
            style={[
              typography.bodyMd,
              styles.emptyText,
              { color: colors.textMuted },
            ]}
          >
            Aún no hay fotos. Toca para tomar o subir evidencia.
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {photos.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectPhoto(item)}
              activeOpacity={0.85}
              style={[
                styles.thumbnailCard,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderCard,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.thumbnailImage}
                contentFit="cover"
                transition={150}
              />
              <View style={styles.zoomBadge}>
                <ZoomIn size={12} color="#ffffff" strokeWidth={2.4} />
              </View>
              {Boolean(item.caption) && (
                <View style={styles.captionOverlay}>
                  <Text numberOfLines={1} style={styles.captionOverlayText}>
                    {item.caption}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onAddPhoto}
            activeOpacity={0.8}
            style={[
              styles.addCard,
              {
                backgroundColor: colors.surfaceTile,
                borderColor: colors.borderDashed,
                borderRadius: radius.lg,
              },
            ]}
          >
            <View
              style={[
                styles.addCircle,
                { backgroundColor: colors.surfaceChipNeutral },
              ]}
            >
              <Plus size={18} color={colors.brandPrimary} strokeWidth={2.4} />
            </View>
            <Text
              style={[
                typography.captionMedium,
                { color: colors.brandPrimaryText, fontSize: 11 },
              ]}
            >
              Agregar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
  },
  scrollList: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 2,
  },
  thumbnailCard: {
    width: 112,
    height: 112,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  zoomBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10, 15, 12, 0.76)",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  captionOverlayText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  addCard: {
    width: 108,
    height: 108,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

