import React,{useMemo,useState}from"react";
import{View,Text,StyleSheet,TouchableOpacity,ScrollView,TextInput,Platform}from"react-native";
import{Link}from"expo-router";
import{Ionicons,MaterialCommunityIcons}from"@expo/vector-icons";

type DoorState="Locked"|"Unlocked";
type DeviceDoc={id:string;name?:string;doorState?:DoorState;source?:string};

const API_BASE_URL=Platform.OS==="android"?"http://10.0.2.2:5050":"http://localhost:5050";

export default function SecurityMenu(){
  const[door,setDoor]=useState<DoorState>("Locked");
  const locked=useMemo(()=>door==="Locked",[door]);
  const[deviceName,setDeviceName]=useState("");
  const[statusMsg,setStatusMsg]=useState("");
  const[devices,setDevices]=useState<DeviceDoc[]>([]);
  const[busy,setBusy]=useState(false);

  const options=[
    {title:"Live Camera View",subtitle:"View camera footage",icon:"videocam-outline",route:"/security/live-camera"as const},
    {title:"Alarm Controls",subtitle:"Manage alarms",icon:"warning-outline",route:"/security/alarm-controls"as const},
    {title:"Notifications & Alerts",subtitle:"View alerts",icon:"notifications-outline",route:"/security/notifications"as const},
    {title:"Access History",subtitle:"Review access logs",icon:"time-outline",route:"/security/access-history"as const},
  ];

  async function saveMockDevice(){
    try{
      setBusy(true);
      setStatusMsg("Saving...");
      const payload={
        name:deviceName.trim()||`Mock Device ${Date.now()}`,
        doorState:door,
        source:"security-tab",
      };
      const res=await fetch(`${API_BASE_URL}/devices`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data?.error||"Save failed");
      setStatusMsg(`Saved device id: ${data.id}`);
      setDeviceName("");
    }catch(error:any){
      setStatusMsg(`Save failed: ${error?.message||"Unknown error"}`);
    }finally{
      setBusy(false);
    }
  }

  async function loadDevices(){
    try{
      setBusy(true);
      setStatusMsg("Loading...");
      const res=await fetch(`${API_BASE_URL}/devices`);
      const data=await res.json();
      if(!res.ok)throw new Error(data?.error||"Load failed");
      setDevices(Array.isArray(data)?data:[]);
      setStatusMsg(`Loaded ${Array.isArray(data)?data.length:0} device(s)`);
    }catch(error:any){
      setStatusMsg(`Load failed: ${error?.message||"Unknown error"}`);
    }finally{
      setBusy(false);
    }
  }

  return(
    <ScrollView style={s.container} contentContainerStyle={{paddingBottom:40}}>
      <Text style={s.title}>Security</Text>

      <Text style={s.section}>Lock Status</Text>
      <View style={s.pillsRow}>
        <TouchableOpacity
          style={[s.pill,!locked?s.pillActiveYellow:null]}
          onPress={()=>setDoor("Unlocked")}
        >
          <MaterialCommunityIcons name="lock-open-variant" size={16} color={!locked?"#111":"#6b7280"}/>
          <Text style={[s.pillTxt,!locked?s.pillTxtActive:null]}>Unlocked</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.pill,locked?s.pillActiveGreen:null]}
          onPress={()=>setDoor("Locked")}
        >
          <MaterialCommunityIcons name="lock" size={16} color={locked?"#111":"#6b7280"}/>
          <Text style={[s.pillTxt,locked?s.pillTxtActive:null]}>Locked</Text>
        </TouchableOpacity>
      </View>

      <Text style={[s.section,{marginTop:18}]}>Security Options</Text>

      <View style={s.grid}>
        {options.map((o,idx)=>(
          <Link key={idx} href={o.route} asChild>
            <TouchableOpacity style={s.card}>
              <View style={s.cardIcon}>
                <Ionicons name={o.icon as any} size={20} color="#111"/>
              </View>
              <Text style={s.cardTitle}>{o.title}</Text>
              <Text style={s.cardSub}>{o.subtitle}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <Text style={[s.section,{marginTop:18}]}>Firestore Test</Text>
      <View style={s.testCard}>
        <Text style={s.hint}>API: {API_BASE_URL}</Text>
        <TextInput
          placeholder="Device name (optional)"
          value={deviceName}
          onChangeText={setDeviceName}
          style={s.input}
        />
        <View style={s.actionsRow}>
          <TouchableOpacity style={[s.actionBtn,busy?s.btnDisabled:null]} onPress={saveMockDevice} disabled={busy}>
            <Text style={s.actionBtnTxt}>Save Mock Device</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtnAlt,busy?s.btnDisabled:null]} onPress={loadDevices} disabled={busy}>
            <Text style={s.actionBtnTxtAlt}>Load Devices</Text>
          </TouchableOpacity>
        </View>
        {!!statusMsg&&<Text style={s.hint}>{statusMsg}</Text>}
        {devices.slice(0,5).map((d)=>(
          <Text key={d.id} style={s.deviceRow}>• {d.name||"(no name)"} [{d.id}]</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:"#fff",paddingHorizontal:18,paddingTop:58},
  title:{fontSize:18,fontWeight:"700",color:"#111",marginBottom:10},
  section:{fontSize:16,fontWeight:"800",color:"#111",marginTop:6,marginBottom:10},

  pillsRow:{flexDirection:"row",gap:12},
  pill:{flex:1,flexDirection:"row",gap:8,alignItems:"center",justifyContent:"center",paddingVertical:10,borderRadius:12,backgroundColor:"#f3f4f6"},
  pillActiveYellow:{backgroundColor:"#facc15"},
  pillActiveGreen:{backgroundColor:"#bbf7d0"},
  pillTxt:{fontSize:12,fontWeight:"700",color:"#6b7280"},
  pillTxtActive:{color:"#111"},

  grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",rowGap:14},
  card:{width:"48%",backgroundColor:"#f3f4f6",borderRadius:14,padding:14,minHeight:110},
  cardIcon:{width:34,height:34,borderRadius:10,backgroundColor:"#fff",alignItems:"center",justifyContent:"center",marginBottom:10},
  cardTitle:{fontSize:13,fontWeight:"800",color:"#111"},
  cardSub:{fontSize:11,color:"#6b7280",marginTop:4},

  testCard:{backgroundColor:"#f9fafb",borderRadius:14,padding:14,borderWidth:1,borderColor:"#e5e7eb"},
  input:{marginTop:8,borderWidth:1,borderColor:"#d1d5db",borderRadius:10,paddingHorizontal:10,paddingVertical:10,backgroundColor:"#fff"},
  actionsRow:{flexDirection:"row",gap:10,marginTop:10},
  actionBtn:{flex:1,backgroundColor:"#111827",paddingVertical:10,borderRadius:10,alignItems:"center"},
  actionBtnAlt:{flex:1,backgroundColor:"#e5e7eb",paddingVertical:10,borderRadius:10,alignItems:"center"},
  actionBtnTxt:{color:"#fff",fontSize:12,fontWeight:"700"},
  actionBtnTxtAlt:{color:"#111",fontSize:12,fontWeight:"700"},
  btnDisabled:{opacity:.6},
  hint:{marginTop:8,fontSize:11,color:"#6b7280"},
  deviceRow:{marginTop:6,fontSize:12,color:"#111"},
});
