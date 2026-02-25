import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";

type SceneCam = {
  id: string;
  name: string;
  image?: any;
};

export default function ScenesScreen() {
  const cams: SceneCam[] = useMemo(
    () => [
      { id: "porch", name: "Porch" },
      { id: "kitchen", name: "Kitchen" },
      { id: "backyard", name: "Backyard" },
      { id: "living", name: "Living Room" },
    ],
    []
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCam = cams.find((c) => c.id === activeId) ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Scenes</Text>
        <Text style={styles.subtitle}>Select a view</Text>

        {/* 2x2 GRID */}
        <View style={styles.grid}>
          {cams.map((cam) => (
            <Pressable
              key={cam.id}
              onPress={() => setActiveId(cam.id)}
              style={({ pressed }) => [
                styles.tile,
                pressed && styles.tilePressed,
              ]}
            >
              <View style={styles.tilePlaceholder}>
                <Text style={styles.tilePlaceholderText}>VIDEO FEED</Text>
              </View>

              <View style={styles.tileLabel}>
                <Text style={styles.tileLabelText}>{cam.name}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* MODAL */}
        <Modal visible={!!activeCam} animationType="slide">
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeCam?.name}</Text>
              <Pressable
                onPress={() => setActiveId(null)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.modalFeed}>
              <View style={styles.modalPlaceholder}>
                <Text style={styles.modalPlaceholderText}>
                  LIVE VIEW
                </Text>
                <Text style={styles.modalPlaceholderName}>
                  {activeCam?.name}
                </Text>
              </View>
            </View>

            <View style={styles.controls}>
              <View style={styles.controlPill}>
                <Text style={styles.controlText}>Snapshot</Text>
              </View>
              <View style={styles.controlPill}>
                <Text style={styles.controlText}>Record</Text>
              </View>
              <View style={styles.controlPill}>
                <Text style={styles.controlText}>PTZ</Text>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 110,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { marginTop: 6, fontSize: 14, color: "#555" },

  grid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  tile: {
    width: "48%",
    aspectRatio: 1.25,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  tilePressed: { transform: [{ scale: 0.99 }] },

  tilePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tilePlaceholderText: {
    color: "white",
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.85,
  },

  tileLabel: {
    position: "absolute",
    left: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  tileLabelText: { color: "white", fontSize: 12, fontWeight: "700" },

  modalSafe: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  closeBtnText: { fontWeight: "700" },

  modalFeed: {
    marginTop: 6,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    aspectRatio: 16 / 9,
  },
  modalPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPlaceholderText: {
    color: "white",
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.8,
  },
  modalPlaceholderName: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
  },

  controls: {
    marginTop: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  controlPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  controlText: { fontSize: 13, fontWeight: "700" },
});