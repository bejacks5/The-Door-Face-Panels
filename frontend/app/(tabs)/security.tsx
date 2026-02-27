import React,{useMemo,useState}from"react";
import{View,Text,StyleSheet,TouchableOpacity,ScrollView}from"react-native";
import{Link}from"expo-router";
import{Ionicons,MaterialCommunityIcons}from"@expo/vector-icons";

type DoorState="Locked"|"Unlocked";

export default function SecurityMenu(){
  const[door,setDoor]=useState<DoorState>("Locked");
  const locked=useMemo(()=>door==="Locked",[door]);

  const options=[
    {title:"Live Camera View",subtitle:"View camera footage",icon:"videocam-outline",route:"/security/live-camera"as const},
    {title:"Alarm Controls",subtitle:"Manage alarms",icon:"warning-outline",route:"/security/alarm-controls"as const},
    {title:"Notifications & Alerts",subtitle:"View alerts",icon:"notifications-outline",route:"/security/notifications"as const},
    {title:"Access History",subtitle:"Review access logs",icon:"time-outline",route:"/security/access-history"as const},
  ];

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
});