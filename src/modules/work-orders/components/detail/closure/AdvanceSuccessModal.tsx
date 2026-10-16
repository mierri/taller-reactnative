import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import { Check } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface AdvanceSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AdvanceSuccessModal: React.FC<AdvanceSuccessModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Cobro registrado">
      <View style={styles.bodyContent}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.statusActiveBg },
          ]}
        >
          <Check size={32} color={colors.brandPrimary} strokeWidth={2.4} />
        </View>

        <Text
          style={[
            typography.headingLg,
            styles.headline,
            { color: colors.textStrong },
          ]}
        >
          Un pendiente menos.
        </Text>

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.85}
          style={[
            styles.primaryBtn,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text
            style={[
              typography.buttonMd,
              styles.btnText,
              { color: colors.textOnBrand },
            ]}
          >
            Listo
          </Text>
          <Check size={18} color={colors.textOnBrand} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bodyContent: {
    alignItems: "center",
    gap: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  headline: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
