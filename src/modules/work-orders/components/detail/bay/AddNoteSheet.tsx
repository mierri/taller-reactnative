import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet, Switch } from "@/components";
import { useTheme } from "@/theme";

export interface AddNoteSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaveNote: (content: string, isClientVisible: boolean) => void;
}

export const AddNoteSheet: React.FC<AddNoteSheetProps> = ({
  visible,
  onClose,
  onSaveNote,
}) => {
  const { colors, typography, radius } = useTheme();
  const [content, setContent] = useState("");
  const [isClientVisible, setIsClientVisible] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    onSaveNote(content.trim(), isClientVisible);
    setContent("");
    setIsClientVisible(false);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Escribir nota">
      <View style={styles.content}>
        <TextInput
          placeholder="Escribe los hallazgos, observaciones o notas importantes..."
          placeholderTextColor={colors.textPlaceholder}
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surfaceInput,
              borderColor: colors.borderInput,
              borderRadius: radius.xl,
              color: colors.textStrong,
            },
          ]}
        />

        <View
          style={[
            styles.switchRow,
            {
              backgroundColor: colors.surfaceTile,
              borderColor: colors.borderDivider,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View style={styles.switchInfo}>
            <Text
              style={[
                typography.buttonMd,
                { color: colors.textStrong, fontSize: 13 },
              ]}
            >
              Visible para el cliente
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, fontSize: 11 },
              ]}
            >
              Aparecerá en el portal de seguimiento del cliente
            </Text>
          </View>
          <Switch
            value={isClientVisible}
            onValueChange={setIsClientVisible}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!content.trim()}
          activeOpacity={0.8}
          style={[
            styles.saveButton,
            {
              backgroundColor: content.trim()
                ? colors.brandPrimary
                : colors.borderGrabber,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text
            style={[
              typography.buttonMd,
              styles.saveButtonText,
              { color: colors.textOnBrand },
            ]}
          >
            Guardar nota
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  textArea: {
    borderWidth: 1,
    padding: 14,
    height: 110,
    textAlignVertical: "top",
    fontSize: 14,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
  },
  switchInfo: {
    flex: 1,
    gap: 2,
    marginRight: 12,
  },
  saveButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
