import { AppHeader, Button, Field, StepProgress } from "@/components";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { ArrowRight, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddClientSheet } from "../components/AddClientSheet";
import { ClientSearchDropdown } from "../components/ClientSearchDropdown";
import { SelectedClientCard } from "../components/SelectedClientCard";
import {
  getMockClients,
  MockClient,
  searchMockClients,
} from "../mocks/clients.mock";

export interface NewWorkOrderStepOneScreenProps {
  onSuccess?: () => void;
}

export const NewWorkOrderStepOneScreen: React.FC<
  NewWorkOrderStepOneScreenProps
> = () => {
  const { colors, layout, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<MockClient | null>(null);
  const [phone, setPhone] = useState("");
  const [searchResults, setSearchResults] = useState<MockClient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = (text: string) => {
    setClientQuery(text);
    if (selectedClient) setSelectedClient(null);
    if (error) setError(null);

    if (text.trim().length > 0) {
      const results = searchMockClients(text);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      const initial = getMockClients().slice(0, 5);
      setSearchResults(initial);
      setShowDropdown(true);
    }
  };

  const handleFocus = () => {
    if (!selectedClient) {
      const results =
        clientQuery.trim().length > 0
          ? searchMockClients(clientQuery)
          : getMockClients().slice(0, 5);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    }
  };

  const handleSelectClient = (client: MockClient) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    setPhone(client.phone);
    setShowDropdown(false);
    setError(null);
  };

  const handleClientCreated = (client: MockClient) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    setPhone(client.phone);
    setShowDropdown(false);
    setError(null);
  };

  const handleClearSelected = () => {
    setSelectedClient(null);
    setClientQuery("");
    setPhone("");
  };

  const handleContinue = () => {
    const finalName = selectedClient ? selectedClient.name : clientQuery.trim();
    if (!finalName) {
      setError("Selecciona o ingresa un cliente para continuar");
      return;
    }

    router.push({
      pathname: "/orders/new/step-two" as any,
      params: {
        clientId: selectedClient?.id ?? "",
        clientName: finalName,
        clientPhone: (selectedClient?.phone ?? phone).trim(),
        clientType: selectedClient?.clientType ?? "Persona física",
        presetVehicle: selectedClient?.primaryVehicle ?? "",
        presetPlate: selectedClient?.plate ?? "",
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Detail"
        title="Recepción"
        hideActions
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.margin,
              paddingBottom: Math.max(insets.bottom, 24) + 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.eyebrowRow}>
            <Text
              style={[typography.eyebrow, { color: colors.brandPrimaryText }]}
            >
              NUEVA ORDEN
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Paso 1 de 3
            </Text>
          </View>

          <View style={styles.progressSection}>
            <StepProgress totalSteps={3} currentStep={1} />
          </View>

          <View style={styles.headingSection}>
            <Text style={[typography.headingXl, { color: colors.textStrong }]}>
              ¿Quién es el cliente
              <Text style={{ color: colors.brandPrimaryText }}>?</Text>
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              Busca un cliente registrado o añade uno nuevo.
            </Text>
          </View>

          <View style={styles.formSection}>
            {selectedClient ? (
              <SelectedClientCard
                client={selectedClient}
                onClear={handleClearSelected}
              />
            ) : (
              <>
                <Field
                  label="Nombre del cliente"
                  placeholder="¿A nombre de quién?"
                  value={clientQuery}
                  onChangeText={handleQueryChange}
                  onFocus={handleFocus}
                  error={error ?? undefined}
                />

                <ClientSearchDropdown
                  results={searchResults}
                  onSelect={handleSelectClient}
                  visible={showDropdown}
                />

                <Button
                  type="Secondary"
                  label="Agregar cliente nuevo"
                  iconLeading={
                    <Plus size={18} color={colors.brandPrimaryText} />
                  }
                  fullWidth
                  onPress={() => setShowAddClientModal(true)}
                />

                <Field
                  label="Teléfono"
                  placeholder="Para contactar al cliente"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </>
            )}

            <View style={styles.actionContainer}>
              <Button
                type="Primary"
                label="Continuar"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                onPress={handleContinue}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AddClientSheet
        visible={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientCreated={handleClientCreated}
        initialName={clientQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { paddingTop: 28 },
  eyebrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  progressSection: { marginBottom: 28 },
  headingSection: { gap: 8, marginBottom: 24 },
  subtitle: { lineHeight: 18, paddingVertical: 12 },
  formSection: { gap: 20 },
  actionContainer: {
    paddingTop: 12,
  },
});
