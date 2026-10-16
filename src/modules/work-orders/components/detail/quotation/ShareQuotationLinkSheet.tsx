import { useTheme } from "@/theme";
import { Globe, Send, X } from "lucide-react-native";
import React from "react";
import {
  Linking,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ShareQuotationLinkSheetProps {
  visible: boolean;
  onClose: () => void;
  orderFolio?: string;
  onCopied?: () => void;
}

export const ShareQuotationLinkSheet: React.FC<
  ShareQuotationLinkSheetProps
> = ({ visible, onClose, orderFolio = "OT-1049", onCopied }) => {
  const { colors, typography, radius } = useTheme();

  const shareUrl = `http://localhost:8081/portal?folio=${orderFolio}`;

  const handleShareOrCopy = async () => {
    try {
      if (Platform.OS !== "web") {
        await Share.share({
          message: shareUrl,
          title: `Aprobación de cotización ${orderFolio}`,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {}
    onCopied?.();
    onClose();
  };

  const handleOpenInBrowser = async () => {
    try {
      await Linking.openURL(shareUrl);
    } catch {}
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}>
        <TouchableOpacity
          style={styles.dismissOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surfaceSheet,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
            },
          ]}
        >
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: colors.borderGrabber },
            ]}
          />

          <View style={styles.headerRow}>
            <Text
              style={[
                typography.headingMd,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Enlace de aprobación
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              typography.captionMedium,
              styles.subtitle,
              { color: colors.textMuted },
            ]}
          >
            Demo local: el portal del cliente funciona en este navegador web. Para compartir entre dispositivos se conecta con el backend.
          </Text>

          <View
            style={[
              styles.urlCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderDivider,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              selectable
              style={[
                typography.captionMedium,
                styles.urlText,
                { color: colors.textSecondary },
              ]}
            >
              {shareUrl}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleShareOrCopy}
            style={[
              styles.shareBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Send size={18} color={colors.textOnBrand} strokeWidth={2.2} />
            <Text
              style={[
                typography.buttonMd,
                styles.shareBtnText,
                { color: colors.textOnBrand },
              ]}
            >
              Compartir o copiar enlace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenInBrowser}
            style={[
              styles.browserBtn,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderButton,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Globe size={18} color={colors.brandPrimary} strokeWidth={2.2} />
            <Text
              style={[
                typography.buttonMd,
                styles.browserBtnText,
                { color: colors.brandPrimary },
              ]}
            >
              Abrir portal en el navegador
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
  },
  dragIndicator: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  urlCard: {
    borderWidth: 1,
    padding: 14,
  },
  urlText: {
    fontSize: 13,
    lineHeight: 19,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
    marginTop: 6,
  },
  shareBtnText: {
    fontWeight: "700",
  },
  browserBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    gap: 8,
  },
  browserBtnText: {
    fontWeight: "700",
  },
});
