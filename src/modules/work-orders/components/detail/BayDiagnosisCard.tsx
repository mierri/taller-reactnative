import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Check, Pencil } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface BayDiagnosisCardProps {
  diagnosis?: string | null;
  isEditable?: boolean;
  onSaveDiagnosis?: (text: string) => void;
}

export const BayDiagnosisCard: React.FC<BayDiagnosisCardProps> = ({
  diagnosis,
  isEditable = false,
  onSaveDiagnosis,
}) => {
  const { colors, typography, radius, shadows } = useTheme();
  const [text, setText] = useState(diagnosis || "");
  const [prevDiagnosis, setPrevDiagnosis] = useState(diagnosis);
  const [isEditing, setIsEditing] = useState(
    !diagnosis || diagnosis.trim().length === 0,
  );

  if (diagnosis !== prevDiagnosis) {
    setPrevDiagnosis(diagnosis);
    setText(diagnosis || "");
    setIsEditing(!diagnosis || diagnosis.trim().length === 0);
  }

  const handleSave = () => {
    onSaveDiagnosis?.(text);
    setIsEditing(false);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
      ]}
    >
      <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
        DIAGNÓSTICO
      </Text>

      <Text
        style={[
          typography.bodyLg,
          styles.title,
          { color: colors.textStrong },
        ]}
      >
        ¿Qué encontraste al revisar el vehículo?
      </Text>

      {isEditable ? (
        <>
          <TextInput
            placeholder="Describe las fallas encontradas..."
            placeholderTextColor={colors.textPlaceholder}
            value={text}
            onChangeText={setText}
            editable={isEditing}
            multiline
            numberOfLines={4}
            style={[
              styles.input,
              {
                backgroundColor: isEditing
                  ? colors.surfaceInput
                  : colors.surfaceTile,
                borderColor: colors.borderInput,
                borderRadius: radius.xl,
                color: colors.textStrong,
              },
            ]}
          />

          <Text
            style={[
              typography.caption,
              styles.helperText,
              { color: colors.textMuted },
            ]}
          >
            Anota las pruebas realizadas, la causa de la falla y el trabajo recomendado.
          </Text>

          {isEditing ? (
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: colors.borderInput,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Text
                style={[
                  typography.buttonMd,
                  styles.saveButtonText,
                  { color: colors.brandPrimary },
                ]}
              >
                Guardar diagnóstico
              </Text>
              <Check size={18} color={colors.brandPrimary} strokeWidth={2.2} />
            </TouchableOpacity>
          ) : (
            <View style={styles.savedActionsRow}>
              <View
                style={[
                  styles.savedButton,
                  {
                    backgroundColor: colors.surfaceTile,
                    borderColor: colors.borderInput,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.buttonMd,
                    styles.saveButtonText,
                    { color: colors.brandPrimary },
                  ]}
                >
                  Diagnóstico guardado
                </Text>
                <Check
                  size={18}
                  color={colors.brandPrimary}
                  strokeWidth={2.2}
                />
              </View>

              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                activeOpacity={0.8}
                style={[
                  styles.editButton,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderInput,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                <Pencil size={15} color={colors.textStrong} strokeWidth={2} />
                <Text
                  style={[
                    typography.buttonMd,
                    styles.editButtonText,
                    { color: colors.textStrong },
                  ]}
                >
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          <View
            style={[
              styles.readOnlyContainer,
              {
                backgroundColor: colors.surfaceTile,
                borderColor: colors.borderInput,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              style={[
                typography.bodyMd,
                styles.placeholderText,
                {
                  color: diagnosis ? colors.textStrong : colors.textPlaceholder,
                },
              ]}
            >
              {diagnosis ||
                "Ej. Se revisaron los frenos. Las balatas delanteras están desgastadas; se recomienda cambiarlas."}
            </Text>
          </View>

          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Primero pasa la orden a diagnóstico para empezar la revisión.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    minHeight: 110,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    lineHeight: 17,
  },
  saveButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 8,
    marginTop: 2,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  savedActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  savedButton: {
    flex: 1.5,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 8,
  },
  editButton: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  readOnlyContainer: {
    borderWidth: 1,
    padding: 14,
    minHeight: 88,
  },
  placeholderText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
