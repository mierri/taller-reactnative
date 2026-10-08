import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, Check } from 'lucide-react-native';
import { BottomSheet, Button, Field } from '@/components';
import { useTheme } from '@/theme';

export interface CapturePlateSheetProps {
  visible: boolean;
  onClose: () => void;
  initialPlate?: string;
  onConfirmPlate: (plate: string) => void;
}

export const CapturePlateSheet: React.FC<CapturePlateSheetProps> = ({
  visible,
  onClose,
  initialPlate = '',
  onConfirmPlate,
}) => {
  const { colors, fonts, typography } = useTheme();
  const [plate, setPlate] = useState(initialPlate || 'PXM-482-B');
  const [prevInitial, setPrevInitial] = useState(initialPlate);

  if (initialPlate !== prevInitial) {
    setPrevInitial(initialPlate);
    setPlate(initialPlate || 'PXM-482-B');
  }

  const handleConfirm = () => {
    onConfirmPlate((plate || 'PXM-482-B').trim().toUpperCase());
    onClose();
  };

  const handleSimulateCamera = () => {
    setPlate('PXM-482-B');
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Capturar placa">
      <View style={styles.container}>
        <Text
          style={[
            typography.bodyMd,
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          Toma una foto y escribe la placa para confirmar. La lectura
          automática requiere integrar un servicio OCR.
        </Text>

        <Button
          type="Secondary"
          label="Abrir cámara"
          iconLeading={<Camera size={20} color={colors.brandPrimaryText} />}
          fullWidth
          onPress={handleSimulateCamera}
        />

        <View style={styles.fieldSection}>
          <Field
            label="Placa confirmada"
            value={plate}
            onChangeText={(text) => setPlate(text.toUpperCase())}
            placeholder="PXM-482-B"
            autoCapitalize="characters"
            inputStyle={{
              fontFamily: fonts.mono500,
              fontSize: 16,
              letterSpacing: 1,
            }}
          />
        </View>

        <View style={styles.actionSection}>
          <Button
            type="Primary"
            label="Usar esta placa"
            iconTrailing={
              <Check size={18} color="#ffffff" strokeWidth={2.4} />
            }
            fullWidth
            onPress={handleConfirm}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
    paddingTop: 4,
  },
  description: {
    lineHeight: 18,
  },
  fieldSection: {
    marginTop: 4,
  },
  actionSection: {
    marginTop: 8,
  },
});

