import React, { useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Fuel } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface FuelGaugeCardProps {
  fuelLevel: number;
  onFuelLevelChange: (level: number) => void;
}

const SNAP_POINTS = [0, 25, 50, 75, 100];
const SNAP_LABELS = [
  { value: 0, label: "Vacío" },
  { value: 25, label: "¼" },
  { value: 50, label: "½" },
  { value: 75, label: "¾" },
  { value: 100, label: "Lleno" },
];

export const FuelGaugeCard: React.FC<FuelGaugeCardProps> = ({
  fuelLevel,
  onFuelLevelChange,
}) => {
  const { colors, radius, typography } = useTheme();
  const [trackWidth, setTrackWidth] = useState(280);

  const handleTouch = (evt: GestureResponderEvent) => {
    const width = trackWidth || 280;
    const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / width));
    const step = Math.round(ratio * 4) * 25;
    onFuelLevelChange(Math.max(0, Math.min(100, step)));
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceInput,
          borderColor: colors.borderInput,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Fuel size={20} color={colors.textLabel} />
          <Text style={[typography.labelLg, { color: colors.textLabel }]}>
            Nivel de combustible
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.sm,
            },
          ]}
        >
          <Text
            style={[
              typography.captionMedium,
              {
                color: colors.brandPrimaryText,
                fontFamily: typography.headingMd.fontFamily,
              },
            ]}
          >
            {fuelLevel}%
          </Text>
        </View>
      </View>

      <View
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
        style={styles.trackContainer}
      >
        <View
          pointerEvents="none"
          style={[styles.trackBg, { backgroundColor: colors.surfaceTrack }]}
        >
          <View
            style={[
              styles.trackFill,
              {
                width: `${fuelLevel}%`,
                backgroundColor: colors.brandPrimary,
              },
            ]}
          />
        </View>

        {SNAP_POINTS.map((pt) => (
          <View
            key={pt}
            pointerEvents="none"
            style={[
              styles.stepTick,
              {
                left: `${pt}%`,
                backgroundColor:
                  fuelLevel >= pt ? colors.brandPrimary : colors.borderGrabber,
              },
            ]}
          />
        ))}

        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              left: `${fuelLevel}%`,
              borderColor: colors.brandPrimary,
            },
          ]}
        />
      </View>

      <View style={styles.legendRow}>
        {SNAP_LABELS.map((item) => {
          const isActive = fuelLevel === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onFuelLevelChange(item.value)}
              hitSlop={8}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: isActive
                      ? colors.brandPrimaryText
                      : colors.textMuted,
                    fontFamily: isActive
                      ? typography.captionMedium.fontFamily
                      : typography.caption.fontFamily,
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trackContainer: {
    height: 36,
    justifyContent: "center",
    position: "relative",
    marginHorizontal: 12,
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  trackFill: {
    height: "100%",
    borderRadius: 4,
  },
  stepTick: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    top: 15,
    transform: [{ translateX: -3 }],
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    top: 6,
    transform: [{ translateX: -12 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
