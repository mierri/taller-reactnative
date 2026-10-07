import { setOnboardingSeen } from "@/services/onboardingStorage";
import { useTheme } from "@/theme";
import { ArrowRight, Car, Wallet, Wrench } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { StepProgress } from "../ui/StepProgress";

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: (withExamples: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const { colors, radii, spacing } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);

  const handleDismiss = async () => {
    await setOnboardingSeen();
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleDismiss}
      title="Tu taller, en tres pasos"
      type="Onboarding"
    >
      <View style={[styles.container, { gap: spacing[5] }]}>
        <StepProgress totalSteps={3} currentStep={currentStep} />

        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <View
              style={[
                styles.iconTile,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radii.xl,
                },
              ]}
            >
              <Car size={32} color={colors.brandPrimary} />
            </View>

            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>
              1 de 3 · Menos pendientes, más camino
            </Text>

            <Text style={[styles.title, { color: colors.textStrong }]}>
              Recibe el vehículo
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Toca Recepción. Captura cliente, placas y falla; después revisa
              gasolina y pertenencias.
            </Text>

            <View style={[styles.actions, { gap: spacing[3] }]}>
              <Button
                type="Primary"
                label="Siguiente"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleNext}
              />

              <Pressable onPress={handleDismiss} hitSlop={spacing[2]}>
                <Text
                  style={[
                    styles.secondaryLink,
                    { color: colors.brandPrimaryText },
                  ]}
                >
                  Ver la guía después
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <View
              style={[
                styles.iconTile,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radii.xl,
                },
              ]}
            >
              <Wrench size={32} color={colors.brandPrimary} />
            </View>

            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>
              2 de 3 · Menos pendientes, más camino
            </Text>

            <Text style={[styles.title, { color: colors.textStrong }]}>
              Diagnostica y cotiza
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Abre una orden. Escribe lo que encontraste en Diagnóstico y agrega
              los servicios o refacciones necesarios.
            </Text>

            <View style={[styles.actions, { gap: spacing[3] }]}>
              <Button
                type="Primary"
                label="Siguiente"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleNext}
              />

              <Pressable onPress={handleDismiss} hitSlop={spacing[2]}>
                <Text
                  style={[
                    styles.secondaryLink,
                    { color: colors.brandPrimaryText },
                  ]}
                >
                  Ver la guía después
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <View
              style={[
                styles.iconTile,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radii.xl,
                },
              ]}
            >
              <Wallet size={32} color={colors.brandPrimary} />
            </View>

            <Text style={[styles.eyebrow, { color: colors.textMuted }]}>
              3 de 3 · Menos pendientes, más camino
            </Text>

            <Text style={[styles.title, { color: colors.textStrong }]}>
              Repara, cobra y entrega
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Repara solo lo aprobado. Verifica la calidad, confirma el total,
              registra el pago y entrega el vehículo.
            </Text>

            <View style={[styles.actions, { gap: spacing[3] }]}>
              <Button
                type="Primary"
                label="Empezar"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={() => handleDismiss()}
              />

              <Pressable onPress={handleDismiss} hitSlop={spacing[2]}>
                <Text
                  style={[
                    styles.secondaryLink,
                    { color: colors.brandPrimaryText },
                  ]}
                >
                  Ver la guía después
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 4,
  },
  stepContent: {
    alignItems: "center",
    width: "100%",
  },
  iconTile: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    lineHeight: 19.5,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  secondaryLink: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    paddingVertical: 4,
  },
});
