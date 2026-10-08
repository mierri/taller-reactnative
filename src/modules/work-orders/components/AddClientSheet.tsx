import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { BottomSheet, Button, Field } from "@/components";
import { useTheme } from "@/theme";
import { addMockClient, MockClient } from "../mocks/clients.mock";

const CLIENT_TYPES: ("Persona física" | "Persona moral")[] = [
  "Persona física",
  "Persona moral",
];

export interface AddClientSheetProps {
  visible: boolean;
  onClose: () => void;
  onClientCreated: (client: MockClient) => void;
  initialName?: string;
}

export const AddClientSheet: React.FC<AddClientSheetProps> = ({
  visible,
  onClose,
  onClientCreated,
  initialName = "",
}) => {
  const { colors, radius, typography } = useTheme();
  const [name, setName] = useState(initialName);
  const [clientType, setClientType] = useState<
    "Persona física" | "Persona moral"
  >("Persona física");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSave = () => {
    let hasError = false;
    if (!name.trim()) {
      setNameError("Ingresa el nombre o razón social");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!phone.trim()) {
      setPhoneError("Ingresa el teléfono");
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (hasError) return;

    const created = addMockClient({
      name: name.trim(),
      clientType,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    });

    onClientCreated(created);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Agregar cliente">
      <View style={styles.container}>
        <Field
          label="Nombre o razón social"
          placeholder="Ej. Autos y Transportes del Norte"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (nameError) setNameError(null);
          }}
          error={nameError ?? undefined}
          autoCapitalize="words"
        />

        <View style={styles.fieldGroup}>
          <Text style={[typography.labelLg, { color: colors.textLabel }]}>
            Tipo de cliente
          </Text>
          <View style={styles.segmentRow}>
            {CLIENT_TYPES.map((type) => {
              const isSelected = clientType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setClientType(type)}
                  style={[
                    styles.segmentBtn,
                    {
                      backgroundColor: isSelected
                        ? colors.surfaceTile
                        : colors.surfaceInput,
                      borderColor: isSelected
                        ? colors.brandPrimary
                        : colors.borderButton,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelMd,
                      {
                        color: isSelected
                          ? colors.brandPrimaryText
                          : colors.textStrong,
                        fontFamily: isSelected
                          ? typography.titleCard.fontFamily
                          : typography.labelMd.fontFamily,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Field
          label="Teléfono"
          placeholder="Ej. 81 2345 6789"
          value={phone}
          onChangeText={(val) => {
            setPhone(val);
            if (phoneError) setPhoneError(null);
          }}
          error={phoneError ?? undefined}
          keyboardType="phone-pad"
        />

        <Field
          label="Correo · opcional"
          placeholder="cliente@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          type="Textarea"
          label="Dirección · opcional"
          placeholder="Calle, número, colonia, CP"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.actionContainer}>
          <Button
            type="Primary"
            label="Guardar cliente"
            iconTrailing={
              <Check size={18} color="#ffffff" strokeWidth={2.4} />
            }
            fullWidth
            onPress={handleSave}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  actionContainer: {
    marginTop: 8,
  },
});
