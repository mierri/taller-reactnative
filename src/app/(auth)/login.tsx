import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react-native";
import { AppLogo, Button, Field } from "@/components";
import { loginRequest } from "@/services/auth.service";
import { useTheme } from "@/theme";

export default function LoginScreen() {
  const { colors, layout, radius, typography } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Ingresa tu correo y contraseña para continuar.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      await loginRequest({
        email: email.trim(),
        password: password.trim(),
      });
      router.replace("/(tabs)" as any);
    } catch (err: any) {
      if (err?.error === "NETWORK_ERROR" || err?.statusCode === 0) {
        setErrorMessage("No se pudo conectar con el servidor");
      } else if (err?.statusCode === 401) {
        setErrorMessage("Correo o contraseña incorrectos");
      } else {
        setErrorMessage(err?.message ?? "No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.surfaceApp }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.margin,
              paddingTop: 112,
              paddingBottom: 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <AppLogo variant="full" size={56} />
          </View>

          <Text
            style={[
              typography.eyebrow,
              styles.eyebrow,
              { color: colors.textLabel },
            ]}
          >
            BIENVENIDO A PITSTOP
          </Text>

          <Text
            style={[
              typography.headingXl,
              styles.title,
              { color: colors.textStrong },
            ]}
          >
            {"Tu taller.\nTodo en orden."}
          </Text>

          <Text
            style={[
              typography.bodyMd,
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Inicia sesión para continuar donde te quedaste.
          </Text>

          {errorMessage && (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: colors.statusDangerBg,
                  borderColor: colors.statusDangerBorder,
                  borderRadius: radius.md,
                },
              ]}
            >
              <AlertCircle size={18} color={colors.statusDangerFg} />
              <Text
                style={[
                  typography.bodyMd,
                  styles.errorText,
                  { color: colors.statusDangerFg },
                ]}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Field
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Field
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              secureTextEntry={!showPassword}
              trailingIcon={
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </Pressable>
              }
            />

            <View style={styles.submitBtn}>
              <Button
                type="Primary"
                label="Entrar al taller"
                iconTrailing={
                  <ArrowRight size={18} color={colors.textOnBrand} />
                }
                fullWidth
                loading={loading}
                onPress={handleLogin}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "flex-start",
  },
  eyebrow: {
    marginTop: 32,
  },
  title: {
    marginTop: 16,
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 32,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
  form: {
    width: "100%",
    gap: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
});
