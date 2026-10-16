import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Button } from "@/components";
import { useTheme } from "@/theme";

export interface StepNavButtonsProps {
  onBack: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

export const StepNavButtons: React.FC<StepNavButtonsProps> = ({
  onBack,
  onSubmit,
  submitLabel = "Continuar",
  submitting = false,
}) => {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backBtn,
          {
            backgroundColor: colors.surfaceInput,
            borderColor: colors.borderButton,
            borderRadius: radius.lg,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Volver al paso anterior"
      >
        <ArrowLeft size={20} color={colors.textStrong} strokeWidth={2.2} />
      </Pressable>

      <View style={styles.submitWrap}>
        <Button
          type="Primary"
          label={submitLabel}
          iconTrailing={
            <ArrowRight
              size={18}
              color={colors.textOnBrand}
              strokeWidth={2.4}
            />
          }
          fullWidth
          loading={submitting}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  submitWrap: {
    flex: 1,
  },
});

