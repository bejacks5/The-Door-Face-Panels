import React,{useMemo,useState}from"react";
import{
  View,Text,StyleSheet,ScrollView,Pressable,
  Switch,TextInput,Alert,Linking
}from"react-native";
import{Ionicons}from"@expo/vector-icons";

type User={id:string;name:string;role:"Owner"|"Admin"|"Guest";enabled:boolean};
const rid=()=>Math.random().toString(36).slice(2,8);

export default function SettingsTab(){
  const[push,setPush]=useState(true);
  const[sms,setSms]=useState(false);
  const[autoArm,setAutoArm]=useState(false);

  const[users,setUsers]=useState<User[]>([
    {id:"1",name:"Mariam",role:"Owner",enabled:true},
    {id:"2",name:"Alex",role:"Admin",enabled:true},
  ]);

  const[newUser,setNewUser]=useState("");
  const enabledUsers=useMemo(()=>users.filter(u=>u.enabled).length,[users]);

  const addUser=()=>{
    if(!newUser.trim())return;
    setUsers(p=>[...p,{id:rid(),name:newUser,role:"Guest",enabled:true}]);
    setNewUser("");
  };

  const toggleUser=(id:string)=>{
    setUsers(p=>p.map(u=>u.id===id?{...u,enabled:!u.enabled}:u));
  };

  const removeUser=(id:string)=>{
    Alert.alert("Remove user?","Access will be revoked.",[
      {text:"Cancel",style:"cancel"},
      {text:"Remove",style:"destructive",onPress:()=>setUsers(p=>p.filter(u=>u.id!==id))}
    ]);
  };

  return(
    <ScrollView style={s.page} contentContainerStyle={{padding:16,paddingBottom:40}}>
      <Text style={s.title}>Settings</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Notifications</Text>
        <Row label="Push Notifications" right={<Switch value={push} onValueChange={setPush}/>}/>
        <Row label="SMS Alerts" right={<Switch value={sms} onValueChange={setSms}/>}/>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Security Preferences</Text>
        <Row label="Auto Arm System" right={<Switch value={autoArm} onValueChange={setAutoArm}/>}/>
        <Text style={s.meta}>{enabledUsers} authorized users</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Authorized Users</Text>

        <View style={s.addRow}>
          <TextInput
            value={newUser}
            onChangeText={setNewUser}
            placeholder="Add new user"
            style={s.input}
          />
          <Pressable style={s.addBtn} onPress={addUser}>
            <Ionicons name="add" size={18} color="#fff"/>
          </Pressable>
        </View>

        {users.map(u=>(
          <View key={u.id} style={s.userRow}>
            <View style={{flex:1}}>
              <Text style={s.userName}>{u.name}</Text>
              <Text style={s.meta}>{u.role}</Text>
            </View>
            <Switch value={u.enabled} onValueChange={()=>toggleUser(u.id)}/>
            <Pressable onPress={()=>removeUser(u.id)}>
              <Ionicons name="trash-outline" size={18} color="#B00020"/>
            </Pressable>
          </View>
        ))}
      </View>

      {/* ABOUT SECTION */}
      <View style={s.card}>
        <Text style={s.cardTitle}>About The Doorface</Text>
        <Text style={s.aboutText}>
          The Doorface is a next-generation smart security platform focused on
          modern access control, real-time visibility, and intuitive protection.
          Our system enhances front-door security through intelligent monitoring,
          seamless automation, and reliable performance.
        </Text>

        <Pressable
          style={s.websiteBtn}
          onPress={()=>Linking.openURL("https://www.thedoorface.com/")}
        >
          <Text style={s.websiteText}>Visit Website</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Row({label,right}:{label:string;right:React.ReactNode;}){
  return(
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      {right}
    </View>
  );
}

const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#F6F7FB"},
  title:{fontSize:24,fontWeight:"800",marginBottom:12},
  card:{backgroundColor:"#fff",borderRadius:14,padding:14,marginBottom:12,borderWidth:1,borderColor:"#E6E7EE"},
  cardTitle:{fontSize:16,fontWeight:"700",marginBottom:10},
  row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginVertical:6},
  rowLabel:{fontSize:14},
  meta:{fontSize:12,color:"#666"},
  addRow:{flexDirection:"row",alignItems:"center",gap:8,marginBottom:10},
  input:{flex:1,backgroundColor:"#F2F3F7",borderRadius:10,paddingHorizontal:12,paddingVertical:10,borderWidth:1,borderColor:"#E5E6ED"},
  addBtn:{backgroundColor:"#111",padding:10,borderRadius:10},
  userRow:{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:8,borderBottomWidth:1,borderBottomColor:"#F0F0F0"},
  userName:{fontWeight:"700"},
  aboutText:{fontSize:13,color:"#444",lineHeight:18,marginTop:6},
  websiteBtn:{marginTop:12,backgroundColor:"#111",paddingVertical:10,borderRadius:10,alignItems:"center"},
  websiteText:{color:"#fff",fontWeight:"700",fontSize:13},
});