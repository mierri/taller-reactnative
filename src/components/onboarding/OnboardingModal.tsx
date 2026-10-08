import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight, Car, Wallet, Wrench } from "lucide-react-native";
import { setOnboardingSeen } from "@/services/onboardingStorage";
import { useTheme } from "@/theme";
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
  const { colors, radius, typography } = useTheme();
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

  const handleFinish = async () => {
    await setOnboardingSeen();
    onClose();
    onComplete?.(true);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleDismiss}
      title="Tu taller, en tres pasos"
      type="Onboarding"
    >
      <View style={styles.container}>
        <StepProgress totalSteps={3} currentStep={currentStep} />

        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <View
              style={[
                styles.iconTile,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Car size={32} color={colors.brandPrimaryText} />
            </View>

            <Text style={[typography.caption, { color: colors.textMuted }]}>
              1 de 3 · Menos pendientes, más camino
            </Text>

            <Text
              style={[
                typography.headingLg,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Recibe el vehículo
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.description,
                { color: colors.textSecondary },
              ]}
            >
              Toca Recepción. Captura cliente, placas y falla; después revisa
              gasolina y pertenencias.
            </Text>

            <View style={styles.actions}>
              <Button
                type="Primary"
                label="Siguiente"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleNext}
              />

              <Pressable onPress={handleDismiss} hitSlop={8}>
                <Text
                  style={[
                    typography.buttonMd,
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
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Wrench size={32} color={colors.brandPrimaryText} />
            </View>

            <Text style={[typography.caption, { color: colors.textMuted }]}>
              2 de 3 · Menos pendientes, más camino
            </Text>

            <Text
              style={[
                typography.headingLg,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Diagnostica y cotiza
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.description,
                { color: colors.textSecondary },
              ]}
            >
              Abre una orden. Escribe lo que encontraste en Diagnóstico y agrega
              los servicios o refacciones necesarios.
            </Text>

            <View style={styles.actions}>
              <Button
                type="Primary"
                label="Siguiente"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleNext}
              />

              <Pressable onPress={handleDismiss} hitSlop={8}>
                <Text
                  style={[
                    typography.buttonMd,
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
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Wallet size={32} color={colors.brandPrimaryText} />
            </View>

            <Text style={[typography.caption, { color: colors.textMuted }]}>
              3 de 3 · Menos pendientes, más camino
            </Text>

            <Text
              style={[
                typography.headingLg,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Repara, cobra y entrega
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.description,
                { color: colors.textSecondary },
              ]}
            >
              Repara solo lo aprobado. Verifica la calidad, confirma el total,
              registra el pago y entrega el vehículo.
            </Text>

            <View style={styles.actions}>
              <Button
                type="Primary"
                label="Empezar"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleFinish}
              />

              <Pressable onPress={handleDismiss} hitSlop={8}>
                <Text
                  style={[
                    typography.buttonMd,
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
    gap: 20,
  },
  stepContent: {
    alignItems: "center",
    width: "100%",
  },
  iconTile: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 300,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  secondaryLink: {
    textAlign: "center",
    paddingVertical: 4,
  },
});
