import { AppLogo, Button, Field } from "@/components";
import { loginRequest } from "@/services/auth.service";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
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

export default function LoginScreen() {
  const { colors, spacing, radii } = useTheme();
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
      const result = await loginRequest({
        email: email.trim(),
        password: password.trim(),
      });

      console.log(
        "Sesión iniciada con éxito. Token recibido:",
        !!result.accessToken,
      );
      router.replace("/(tabs)" as any);
    } catch (err: any) {
      console.warn("Error en login:", err);
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
              paddingHorizontal: spacing[6],
              paddingTop: 112,
              paddingBottom: spacing[8],
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.logoContainer]}>
            <AppLogo variant="full" size={56} />
          </View>

          <Text
            style={[
              styles.eyebrow,
              {
                color: colors.textLabel,
                marginTop: spacing[8],
              },
            ]}
          >
            BIENVENIDO A PITSTOP
          </Text>

          <Text
            style={[
              styles.title,
              { color: colors.textStrong, marginTop: spacing[4] },
            ]}
          >
            Tu taller.{"\n"}
            Todo en orden.
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                marginTop: spacing[4],
                marginBottom: spacing[8],
              },
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
                  borderRadius: radii.md,
                  padding: spacing[3],
                  marginBottom: spacing[4],
                  gap: spacing[2],
                },
              ]}
            >
              <AlertCircle size={18} color={colors.statusDangerFg} />
              <Text
                style={[styles.errorText, { color: colors.statusDangerFg }]}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          <View style={[styles.form, { gap: spacing[5] }]}>
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
                  hitSlop={spacing[2]}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </Pressable>
              }
            />

            <View style={{ marginTop: spacing[5] }}>
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
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
});
