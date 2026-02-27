import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Modal, Switch } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type DoorState = "Locked" | "Unlocked";
type OnlineState = "Online" | "Offline";
type AlarmState = "On" | "Off";
type TempState = `${number}°F`;

type Status = {
  door: DoorState;
  camera: OnlineState;
  alarm: AlarmState;
  temp: TempState;
};

type PanelSettings = {
  camera: boolean;
  doorbell: boolean;
  packageMessage: boolean;
  greetingMessage: boolean;
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStatus(): Status {
  const tempNum = pick([80, 70, 60, 50, 40]);
  return {
    door: pick(["Locked", "Unlocked"]),
    camera: pick(["Online", "Offline"]),
    alarm: pick(["On", "Off"]),
    temp: `${tempNum}°F`,
  };
}

function dotColor(label: keyof Status, value: string) {
  if (label === "door") return value === "Locked" ? "#2ecc71" : "#f1c40f";
  if (label === "camera") return value === "Online" ? "#2ecc71" : "#95a5a6";
  if (label === "alarm") return value === "On" ? "#2ecc71" : "#95a5a6";
  return "#f1c40f";
}

function StatusCard({
  title,
  dot,
}: {
  title: string;
  dot: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <View style={{ flex: 1 }} />
        <Ionicons name="eye-outline" size={18} color="#cfd3da" />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

function FrontPanel({
  settings,
}: {
  settings: PanelSettings
}) {
  return (
    <View style={styles.frontPanelOverlay}>
      {/* Camera */}
      {settings.camera && (
        <View>
          <Text>Camera is active !</Text>
        </View>
      )}

      {/* Doorbell */}
      {settings.doorbell && (
        <View>
          <Text>Doorbell is active !</Text>
        </View>
      )}

      {/* Package Message */}
      {settings.packageMessage && (
        <View>
          <Text>Package Message: Placeholder</Text>
        </View>
      )}

      {/* Greeting Message */}
      {settings.greetingMessage && (
        <View>
          <Text>Greeting Message: Placeholder</Text>
        </View>
      )}
    </View>
  );
}

function PanelSettingsEditor({
  settings,
  newSettings,
}: {
  settings: PanelSettings,
  newSettings: React.Dispatch<React.SetStateAction<PanelSettings>>;
}) {
  return (
    <View>
      {Object.entries(settings).map(([key, value]) => (
        <View 
          key={key}
          style={styles.frontPanelEditorList}
        > 
          <Switch
            value={value}
            onValueChange={(newValue) =>
              newSettings((prev) => ({
                ...prev,
                [key]: newValue
              }))
          }/>

          <Text>
            {key}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default function Index() {
  const [status, setStatus] = useState<Status>(() => randomStatus());
  const lockIsLocked = useMemo(() => status.door === "Locked", [status.door]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [panelSettings, setPanelSettings] = useState<PanelSettings>({
    camera: false,
    doorbell: false,
    packageMessage: false,
    greetingMessage: false,
  });
  const [tempPanelSettings, setTempPanelSettings] = useState<PanelSettings>(panelSettings);

  const toggleLock = () => {
    setStatus((prev) => ({
      ...prev,
      door: prev.door === "Locked" ? "Unlocked" : "Locked",
    }));
  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Home</Text>
        <Pressable onPress={() => setStatus(randomStatus())}>
          <Ionicons name="person-circle-outline" size={28} color="#111" />
        </Pressable>
      </View>

      {/* Camera Preview */}
      <View style={styles.previewWrap}>
        <Image
          source={{ uri: "https://via.placeholder.com/1200x700.png?text=Front+Door+Camera" }}
          style={styles.previewImg}
        />
        <View style={styles.previewLabel}>
          <Text style={styles.previewLabelText}>Front Door Camera</Text>
        </View>
      </View>

      {/* Front Panel Preview */}
      <View style={styles.previewWrap}>
        <FrontPanel settings={panelSettings}/>
        <View style={styles.previewLabel}>
          <Text style={styles.previewLabelText}>Front Panel Preview</Text>
        </View>
        <View style={styles.previewLabelRight}>
          <Pressable onPress={() => {
            setTempPanelSettings(panelSettings);
            setEditModalVisible(true);
          }}>
            <Text style={styles.previewLabelText}>Edit</Text>
          </Pressable>
        </View>
      </View>

      {/* Status Cards */}
      <View style={styles.grid}>
        <StatusCard title={`Door ${status.door}`} dot={dotColor("door", status.door)} />
        <StatusCard title={`Camera ${status.camera}`} dot={dotColor("camera", status.camera)} />
        <StatusCard title={`Alarming ${status.alarm}`} dot={dotColor("alarm", status.alarm)} />
        <StatusCard title={`${status.temp} Temp`} dot={dotColor("temp", status.temp)} />
      </View>

      {/* Lock Section */}
      <View style={styles.lockSection}>
        <Text style={styles.lockLabel}>{lockIsLocked ? "LOCKED" : "UNLOCKED"}</Text>

        <Pressable onPress={toggleLock} hitSlop={12}>
          <View style={styles.lockOuter}>
            <View style={styles.lockInner}>
              <MaterialCommunityIcons
                name={lockIsLocked ? "lock" : "lock-open-variant"}
                size={44}
                color={lockIsLocked ? "#2ecc71" : "#f1c40f"}
              />
            </View>
          </View>
        </Pressable>

        <Text style={styles.lastOpened}>Last opened at 2:03 AM by Ayush</Text>
      </View>

      {/* Front Door Panel Control */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
            <Text style={styles.headerTitle}>Front Panel Control</Text>

            {/* Front Panel Display*/}
            <FrontPanel settings={tempPanelSettings}></FrontPanel>

            {/* Front Panel Content Control List */}
            <PanelSettingsEditor 
              settings={tempPanelSettings}
              newSettings={setTempPanelSettings}
            />

            {/* Save Button */}
            <Pressable
              style={styles.modalSaveButton}
              onPress={() => {
                setPanelSettings(tempPanelSettings);
                setEditModalVisible(false);
            }}>
              <Text style={styles.modalSaveText}>Save</Text>
            </Pressable>

            {/* Cancel Button*/}
            <Pressable 
              style={styles.modalCancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  previewWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginBottom: 12,
  },
  previewImg: {
    width: "100%",
    height: 180,
  },
  previewLabel: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  previewLabelRight: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  previewLabelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#1f232a",
    borderRadius: 14,
    padding: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 99,
  },
  cardTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  lockSection: {
    alignItems: "center",
    marginTop: 6,
  },
  lockLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 1,
    marginBottom: 10,
  },
  lockOuter: {
    width: 120,
    height: 120,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "#eaeaea",
    alignItems: "center",
    justifyContent: "center",
  },
  lockInner: {
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  lastOpened: {
    marginTop: 12,
    color: "#666",
    fontSize: 12,
  },
  frontPanelOverlay: {
    width: "95%",
    height: 200,
    padding: 16,
    backgroundColor: "#c8c2c2",
    borderRadius: 10,
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  modalSaveButton: {
    marginTop: 20,
    backgroundColor: "#4a6cb7",
  },
  modalSaveText: {
    color: "#ffffff",
  },
  modalCancelButton: {
    marginTop: 20,
    backgroundColor: "#aeaeae",
  },
  modalCancelText: {
    color: "#000000",
  },
  frontPanelEditorList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
});