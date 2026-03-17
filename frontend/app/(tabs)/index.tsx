import React, { useEffect, useMemo, useState } from "react";
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
};

type NotificationData = {
  visible: boolean;
  message: string;
};

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
  settings: PanelSettings;
}) {
  return (
    <View style={styles.frontPanelOverlay}>
      <View style={styles.frontPanelTop}>
        {settings.camera && (
          <View>
            <Text>Camera is active !</Text>
          </View>
        )}

        {settings.doorbell && (
          <View>
            <Text>Doorbell is active !</Text>
          </View>
        )}
      </View>

      <View style={styles.frontPanelCenter}>
        {settings.packageMessage && (
          <View>
            <Text>Package Message: Placeholder</Text>
          </View>
        )}

        {settings.greetingMessage && (
          <View>
            <Text>Greeting Message: Placeholder</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function PanelSettingsEditor({
  settings,
  newSettings,
}: {
  settings: PanelSettings;
  newSettings: React.Dispatch<React.SetStateAction<PanelSettings>>;
}) {
  return (
    <View>
      {Object.entries(settings).map(([key, value]) => (
        <View key={key} style={styles.frontPanelEditorList}>
          <Switch
            value={value}
            onValueChange={(newValue) =>
              newSettings((prev) => ({
                ...prev,
                [key]: newValue,
              }))
            }
          />

          <Text>
            {key
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()
              .replace(/^./, (s) => s.toUpperCase())}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function Index() {
  const [status, setStatus] = useState<Status>(() => randomStatus());
  const [notification, setNotification] = useState<NotificationData>({
    visible: false,
    message: "",
  });
  const lockIsLocked = useMemo(() => status.door === "Locked", [status.door]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [panelSettings, setPanelSettings] = useState<PanelSettings>({
    camera: false,
    doorbell: false,
    packageMessage: false,
    greetingMessage: false,
  });
  const [tempPanelSettings, setTempPanelSettings] = useState<PanelSettings>(panelSettings);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const turnOnCamera = async () => { 
    // function for turning on the web camera
  
      if (Platform.OS === "web") {
        try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
  
        setStream(mediaStream);
        } catch (err) {
          Alert.alert("Camera error.");
        }
      }
      if (!permission?.granted) {
        const reuslt = await requestPermission();
        if (!reuslt.granted) {
          Alert.alert("Camera permission denied");
          return;
        }
        setCameraActive(true);
      }  
  }

  const captureFrame = (video : HTMLVideoElement) => {
    // function that captures a frame/image from a video
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    
    return canvas.toDataURL("image/jpeg");
  }

  const captureImages = async () => {
  // function that captures 5 frames/images from a video
    if (Platform.OS === "web") {
      const frames: string[] = [];
  
      for(let i = 0; i < 5; i++) {
        frames.push(captureFrame(videoRef.current!));
        await new Promise((r) => setTimeout(r, 500)); // wait a bit so that we don't use the same frames
      }
  
      return frames;
    }
    
    // mobile
    const frames: string[] = [];
    for (let i = 0; i < 5; i++) {
      const photo = await cameraRef.current!.takePictureAsync({ base64: true, quality: 0.7});
      frames.push(`data:image/jpeg;base64,${photo.base64}`); // we need to have base 64 because the backend deals with this type only
      await new Promise((r) => setTimeout(r, 500));
    }
    return frames;
  }

  const registerUser = async () => {
    const images = await captureImages();

    const res = await fetch(`${API_BASE_URL}/face/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ayush",
        images,
      }),
    });

    const data = await res.json();
    console.log(data);
  }

  const authenticateFace = async () => {
    const images = await captureImages();
  
    const res = await fetch(`${API_BASE_URL}/face/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images }),
    });
  
    const data = await res.json();
    
    if (data.authenticated) {
      Alert.alert(`Authenticated as ${data.name}`);
      console.log("Successfully authenticated.");
    } else {
      Alert.alert(`Failed to authenticate: ${data.message}`);
      console.log("Failed to authenticate.");
    }
    console.log(data);
  }
  
  const showNotification = (message: string) => {
    setNotification({
      visible: true,
      message,
    });
  };

  useEffect(() => {
    if (!notification.visible) return;

    const timer = setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.visible]);

  const toggleLock = () => {
    setStatus((prev) => {
      const nextDoor = prev.door === "Locked" ? "Unlocked" : "Locked";

      showNotification(
        nextDoor === "Locked"
          ? "Door locked successfully"
          : "Door unlocked successfully"
      );

      return {
        ...prev,
        door: nextDoor,
      };
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Home</Text>
        <Pressable
          onPress={() => {
            setStatus(randomStatus());
            showNotification("System status refreshed");
          }}
        >
          <Ionicons name="person-circle-outline" size={28} color="#111" />
        </Pressable>
      </View>

      <View style={styles.previewWrap}>
        {stream && Platform.OS === "web" ? (  // web cam
          <video
            autoPlay
            playsInline
            ref={videoRef}
            style={styles.cameraPreview}
          />
        ) : (cameraActive ? (                 // mobile cam
          <CameraView
            ref={cameraRef}
            style={styles.previewImg}
            facing="front"
          />
        ) : (
          <Image
          source={{ uri: "https://via.placeholder.com/1200x700.png?text=Front+Door+Camera" }}
          style={styles.previewImg}
        />
        ))}
        <View style={styles.previewLabel}>
          <Text style={styles.previewLabelText}>Front Door Camera</Text>
        </View>
        <View style={styles.previewLabelRight}>
          <Pressable style={styles.previewButton} onPress={() => turnOnCamera()}>
            <Text style={styles.previewLabelText}>Turn on Camera</Text>            
          </Pressable>

          <Pressable style={styles.previewButton} onPress={() => {
            if (Platform.OS === "web") {
              setStream(null)
            } else {
              setCameraActive(false);
            }
          }}>
            <Text style={styles.previewLabelText}>Turn off Camera</Text>
          </Pressable>

          <Pressable 
            style={styles.previewButton} 
            onPress={() => {
              if (videoRef.current || cameraActive) {
                authenticateFace();
              }
            }}>
            <Text style={styles.previewLabelText}>Authenticate</Text>
          </Pressable>

          <Pressable 
            style={styles.previewButton} 
            onPress={() => {
              if (videoRef.current || cameraActive) {
                registerUser();
              }
            }}>
            <Text style={styles.previewLabelText}>Add User</Text>
          </Pressable>
        </View>       
      </View>

      <View style={styles.previewWrap}>
        <FrontPanel settings={panelSettings} />
        <View style={styles.previewLabel}>
          <Text style={styles.previewLabelText}>Front Panel Preview</Text>
        </View>
        <View style={styles.previewLabelRight}>
          <Pressable
            onPress={() => {
              setTempPanelSettings(panelSettings);
              setEditModalVisible(true);
            }}
          >
            <Text style={styles.previewLabelText}>Edit</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        <StatusCard title={`Door ${status.door}`} dot={dotColor("door", status.door)} />
        <StatusCard title={`Camera ${status.camera}`} dot={dotColor("camera", status.camera)} />
        <StatusCard title={`Alarming ${status.alarm}`} dot={dotColor("alarm", status.alarm)} />
        <StatusCard title={`${status.temp} Temp`} dot={dotColor("temp", status.temp)} />
      </View>

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

      <View style={styles.mockButtonRow}>
        <Pressable
          style={styles.mockButton}
          onPress={() => showNotification("Doorbell pressed")}
        >
          <Text style={styles.mockButtonText}>Trigger Notification</Text>
        </Pressable>
      </View>

      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Text style={styles.headerTitle}>Front Panel Control</Text>

          <FrontPanel settings={tempPanelSettings} />

          <PanelSettingsEditor
            settings={tempPanelSettings}
            newSettings={setTempPanelSettings}
          />

          <Pressable
            style={styles.modalSaveButton}
            onPress={() => {
              setPanelSettings(tempPanelSettings);
              setEditModalVisible(false);
              showNotification("Front panel settings saved");
            }}
          >
            <Text style={styles.modalSaveText}>Save</Text>
          </Pressable>

          <Pressable
            style={styles.modalCancelButton}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {notification.visible && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notification.message}</Text>
          <Pressable
            onPress={() =>
              setNotification((prev) => ({
                ...prev,
                visible: false,
              }))
            }
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
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
    flexDirection: "column",
    gap: 6,
  },
  previewLabelText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  previewButton: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
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
  frontPanelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frontPanelCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 10,
    backgroundColor: "#4a6cb7",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  modalSaveText: {
    color: "#ffffff",
  },
  modalCancelButton: {
    marginTop: 10,
    backgroundColor: "#aeaeae",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
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
  mockButtonRow: {
    alignItems: "center",
    marginTop: 20,
  },
  mockButton: {
    backgroundColor: "#4a6cb7",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mockButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  notificationBanner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "#1f232a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 9999,
    elevation: 8,
  },
  notificationText: {
    color: "#ffffff",
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
});
