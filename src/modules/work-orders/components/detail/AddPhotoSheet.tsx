import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Check, Image as ImageIcon, RotateCcw } from "lucide-react-native";
import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import { DetailPhotoItem, PhotoUploadPayload } from "../../types/work-order-detail.types";

export interface AddPhotoSheetProps {
  visible: boolean;
  onClose: () => void;
  onPhotosSelected: (photos: PhotoUploadPayload[]) => void;
}

const categories: { key: DetailPhotoItem["category"]; label: string }[] = [
  { key: "RECEPTION", label: "Recepción" },
  { key: "INSPECTION", label: "Inspección" },
  { key: "PROCESS", label: "Proceso" },
];

export const AddPhotoSheet: React.FC<AddPhotoSheetProps> = ({
  visible,
  onClose,
  onPhotosSelected,
}) => {
  const { colors, typography, radius } = useTheme();
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<DetailPhotoItem["category"]>("INSPECTION");

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso de cámara", "Se requiere acceso a la cámara para capturar evidencia.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedUris(result.assets.map((a) => a.uri));
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso de fotos", "Se requiere acceso a tu galería para adjuntar fotos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsMultipleSelection: true, quality: 0.8 });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedUris(result.assets.map((a) => a.uri));
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir la galería.");
    }
  };

  const handleConfirm = () => {
    if (selectedUris.length === 0) return;
    onPhotosSelected(selectedUris.map((uri) => ({ uri, caption: caption.trim() || undefined, category })));
    setSelectedUris([]);
    setCaption("");
    onClose();
  };

  const handleClose = () => {
    setSelectedUris([]);
    setCaption("");
    onClose();
  };

  const hasPhotos = selectedUris.length > 0;

  return (
    <BottomSheet visible={visible} onClose={handleClose} title={hasPhotos ? "Detalle de la foto" : "Agregar fotos"}>
      <View style={styles.content}>
        {!hasPhotos ? (
          <>
            <TouchableOpacity onPress={handleTakePhoto} activeOpacity={0.8} style={[styles.optionCard, { backgroundColor: colors.surfaceInput, borderColor: colors.borderInput, borderRadius: radius.xl }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceTile }]}>
                <Camera size={22} color={colors.brandPrimary} strokeWidth={2} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[typography.buttonMd, styles.optionTitle, { color: colors.textStrong }]}>Tomar foto</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>Usar la cámara para capturar evidencia inmediata</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChooseFromGallery} activeOpacity={0.8} style={[styles.optionCard, { backgroundColor: colors.surfaceInput, borderColor: colors.borderInput, borderRadius: radius.xl }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceTile }]}>
                <ImageIcon size={22} color={colors.brandPrimary} strokeWidth={2} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[typography.buttonMd, styles.optionTitle, { color: colors.textStrong }]}>Elegir de galería</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>Seleccionar imágenes previamente capturadas</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.previewSection}>
            <View style={[styles.previewContainer, { borderRadius: radius.xl, borderColor: colors.borderCard }]}>
              {selectedUris.length === 1 ? (
                <ExpoImage source={{ uri: selectedUris[0] }} style={styles.singleImage} contentFit="cover" />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.multiList}>
                  {selectedUris.map((uri, idx) => (
                    <ExpoImage key={idx} source={{ uri }} style={styles.multiImage} contentFit="cover" />
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity onPress={() => setSelectedUris([])} activeOpacity={0.85} style={styles.changeBtn}>
                <RotateCcw size={12} color="#ffffff" strokeWidth={2.4} />
                <Text style={styles.changeBtnText}>Cambiar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={[typography.captionMedium, styles.fieldLabel, { color: colors.textLabel }]}>Nota sobre la foto</Text>
              <TextInput
                placeholder="Ej. Frontal y cofre, rayón en puerta..."
                placeholderTextColor={colors.textPlaceholder}
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={2}
                style={[styles.captionInput, { backgroundColor: colors.surfaceInput, borderColor: colors.borderInput, borderRadius: radius.lg, color: colors.textStrong }]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[typography.captionMedium, styles.fieldLabel, { color: colors.textLabel }]}>Etapa</Text>
              <View style={styles.categoryRow}>
                {categories.map((c) => {
                  const isSelected = category === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      onPress={() => setCategory(c.key)}
                      style={[styles.categoryChip, { backgroundColor: isSelected ? colors.brandPrimary : colors.surfaceTile, borderRadius: radius.full }]}
                    >
                      <Text style={[typography.captionMedium, { color: isSelected ? colors.textOnBrand : colors.textSecondary, fontWeight: isSelected ? "700" : "500" }]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85} style={[styles.confirmBtn, { backgroundColor: colors.brandPrimary, borderRadius: radius.xl }]}>
              <Check size={18} color={colors.textOnBrand} strokeWidth={2.4} />
              <Text style={[typography.buttonMd, styles.confirmBtnText, { color: colors.textOnBrand }]}>Adjuntar fotografía</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 12 },
  optionCard: { flexDirection: "row", alignItems: "center", padding: 16, borderWidth: 1, gap: 14 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  optionTextContainer: { flex: 1, gap: 2 },
  optionTitle: { fontSize: 14, fontWeight: "600" },
  previewSection: { gap: 14 },
  previewContainer: { width: "100%", height: 160, borderWidth: 1, overflow: "hidden", position: "relative" },
  singleImage: { width: "100%", height: "100%" },
  multiList: { flexDirection: "row", gap: 8, padding: 8 },
  multiImage: { width: 140, height: "100%", borderRadius: 8 },
  changeBtn: { position: "absolute", top: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(10, 15, 12, 0.72)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  changeBtnText: { color: "#ffffff", fontSize: 11, fontWeight: "600" },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12.5 },
  captionInput: { minHeight: 64, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10, borderWidth: 1, fontSize: 14, textAlignVertical: "top" },
  categoryRow: { flexDirection: "row", gap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 7 },
  confirmBtn: { height: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  confirmBtnText: { fontSize: 14.5, fontWeight: "700" },
});
