import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Camera } from "lucide-react-native";
import { Field } from "@/components";
import { useTheme } from "@/theme";
import { CapturePlateSheet } from "./CapturePlateSheet";

export interface PlateInputWithScannerProps {
  plate: string;
  onChangePlate: (plate: string) => void;
  error?: string | null;
}

export const PlateInputWithScanner: React.FC<PlateInputWithScannerProps> = ({
  plate,
  onChangePlate,
  error,
}) => {
  const { colors, fonts, radius, typography } = useTheme();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={[
            typography.labelLg,
            styles.label,
            { color: colors.textLabel },
          ]}
        >
          Placas
        </Text>
        <View style={styles.row}>
          <View style={styles.inputWrap}>
            <Field
              placeholder="PXM-482-B"
              value={plate}
              onChangeText={(val) => onChangePlate(val.toUpperCase())}
              autoCapitalize="characters"
              error={error ?? undefined}
              inputStyle={{
                fontFamily: fonts.mono500,
                fontSize: 16,
                letterSpacing: 1,
              }}
            />
          </View>

          <Pressable
            onPress={() => setShowModal(true)}
            style={({ pressed }) => [
              styles.cameraButton,
              {
                backgroundColor: colors.surfaceTile,
                borderColor: colors.borderButton,
                borderRadius: radius.lg,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Capturar placa con cámara"
          >
            <Camera
              size={22}
              color={colors.brandPrimaryText}
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>

      <CapturePlateSheet
        visible={showModal}
        onClose={() => setShowModal(false)}
        initialPlate={plate}
        onConfirmPlate={(scanned) => onChangePlate(scanned)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },
  inputWrap: {
    flex: 1,
  },
  cameraButton: {
    width: 52,
    height: 52,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

