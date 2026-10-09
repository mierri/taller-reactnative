import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/theme";
import { DetailNoteItem } from "../../types/work-order-detail.types";
import { formatDetailDate } from "../../utils/detail-formatters";

export interface BayFollowUpSectionProps {
  notes: DetailNoteItem[];
  onAddNote: () => void;
}

export const BayFollowUpSection: React.FC<BayFollowUpSectionProps> = ({
  notes,
  onAddNote,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
          SEGUIMIENTO
        </Text>

        <TouchableOpacity
          onPress={onAddNote}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              typography.buttonMd,
              styles.addLink,
              { color: colors.brandPrimaryText },
            ]}
          >
            + Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            {
              backgroundColor: colors.surfaceTile,
              borderColor: colors.borderDashed,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text
            style={[
              typography.bodyMd,
              styles.emptyText,
              { color: colors.textMuted },
            ]}
          >
            Aún no hay notas. Documenta lo importante.
          </Text>
        </View>
      ) : (
        <View style={styles.notesList}>
          {notes.map((note) => (
            <View
              key={note.id}
              style={[
                styles.noteCard,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderCard,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <View style={styles.noteHeader}>
                <Text
                  style={[
                    typography.captionMedium,
                    { color: colors.textMuted },
                  ]}
                >
                  {formatDetailDate(note.createdAt)}
                </Text>
                {note.isClientVisible && (
                  <View
                    style={[
                      styles.visibleBadge,
                      {
                        backgroundColor: colors.surfaceChipNeutral,
                        borderRadius: radius.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.captionMedium,
                        { color: colors.brandPrimaryText, fontSize: 10 },
                      ]}
                    >
                      Visible al cliente
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  typography.bodyMd,
                  styles.noteContent,
                  { color: colors.textStrong },
                ]}
              >
                {note.content}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 16,
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesList: {
    gap: 8,
  },
  noteCard: {
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  visibleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  noteContent: {
    fontSize: 13,
    lineHeight: 18,
  },
});

