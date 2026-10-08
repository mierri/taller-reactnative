import React from "react";
import { StyleSheet, View } from "react-native";
import { ActionRow, BottomSheet } from "@/components";

export interface OptionPickerSheetProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: T[];
  selectedOption: T;
  onSelect: (option: T) => void;
}

export function OptionPickerSheet<T extends string>({
  visible,
  onClose,
  title,
  options,
  onSelect,
}: OptionPickerSheetProps<T>) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.list}>
        {options.map((option) => (
          <ActionRow
            key={option}
            title={option}
            onPress={() => {
              onSelect(option);
              onClose();
            }}
          />
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
});

