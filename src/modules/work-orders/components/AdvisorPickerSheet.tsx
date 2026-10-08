import React from "react";
import { StyleSheet, View } from "react-native";
import { ActionRow, BottomSheet } from "@/components";
import { getMockAdvisors, MockAdvisor } from "../mocks/advisors.mock";

export interface AdvisorPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  advisors?: MockAdvisor[];
  onSelect: (advisor: MockAdvisor) => void;
}

export const AdvisorPickerSheet: React.FC<AdvisorPickerSheetProps> = ({
  visible,
  onClose,
  advisors,
  onSelect,
}) => {
  const advisorList = advisors ?? getMockAdvisors();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Seleccionar asesor"
    >
      <View style={styles.list}>
        {advisorList.map((item) => (
          <ActionRow
            key={item.id}
            title={item.name}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          />
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
});
