import React,{useMemo}from"react";
import{View,Text,StyleSheet,ScrollView}from"react-native";
import{Ionicons}from"@expo/vector-icons";

type Pt={label:string;v:number};

function BarRow({label,v,max}:{label:string;v:number;max:number}){
  const w=Math.max(6,Math.round((v/max)*100));
  return(
    <View style={s.barRow}>
      <Text style={s.barLbl}>{label}</Text>
      <View style={s.barTrack}>
        <View style={[s.barFill,{width:`${w}%`}]} />
      </View>
      <Text style={s.barVal}>{v}</Text>
    </View>
  );
}

function Stat({icon,label,value,sub}:{icon:any;label:string;value:string;sub:string}){
  return(
    <View style={s.statCard}>
      <View style={s.statIcon}><Ionicons name={icon} size={18} color="#111"/></View>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statSub}>{sub}</Text>
    </View>
  );
}

export default function About(){
  // mock analytics (replace later with real backend)
  const totals=useMemo(()=>({
    events:"1,284",
    access:"312",
    alerts:"46",
    uptime:"99.2%",
  }),[]);

  const weeklyAccess:Pt[]=useMemo(()=>[
    {label:"Mon",v:38},{label:"Tue",v:44},{label:"Wed",v:31},{label:"Thu",v:52},{label:"Fri",v:40},{label:"Sat",v:22},{label:"Sun",v:27},
  ],[]);

  const alertBreakdown:Pt[]=useMemo(()=>[
    {label:"Motion",v:21},{label:"Door Open",v:14},{label:"Alarm",v:7},{label:"Tamper",v:4},
  ],[]);

  const maxWeek=Math.max(...weeklyAccess.map(x=>x.v));
  const maxAlert=Math.max(...alertBreakdown.map(x=>x.v));

  return(
    <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.h1}>Insights</Text>
      <Text style={s.sub}>Mock analytics for The Doorface app (swap with real data later)</Text>

      <View style={s.statsGrid}>
        <Stat icon="analytics-outline" label="Total Events" value={totals.events} sub="Last 30 days"/>
        <Stat icon="key-outline" label="Access Events" value={totals.access} sub="Unlock/lock activity"/>
        <Stat icon="notifications-outline" label="Alerts" value={totals.alerts} sub="Triggered notifications"/>
        <Stat icon="pulse-outline" label="Device Uptime" value={totals.uptime} sub="Connectivity health"/>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Weekly Access Activity</Text>
        <Text style={s.cardSub}>Unlock/lock events per day</Text>
        <View style={{marginTop:10}}>
          {weeklyAccess.map(p=>(
            <BarRow key={p.label} label={p.label} v={p.v} max={maxWeek}/>
          ))}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Alert Breakdown</Text>
        <Text style={s.cardSub}>Most common alert types</Text>
        <View style={{marginTop:10}}>
          {alertBreakdown.map(p=>(
            <BarRow key={p.label} label={p.label} v={p.v} max={maxAlert}/>
          ))}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Highlights</Text>
        <View style={{marginTop:10,gap:8}}>
          <Text style={s.bullet}>• Peak access time: 6–9 PM</Text>
          <Text style={s.bullet}>• Most alerts: motion near front door</Text>
          <Text style={s.bullet}>• Alarm usage trending down week-over-week</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  page:{flex:1,backgroundColor:"#F6F7FB"},
  content:{padding:16,paddingBottom:36},
  h1:{fontSize:24,fontWeight:"800",color:"#111"},
  sub:{fontSize:12,color:"#666",marginTop:6,lineHeight:18},

  statsGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",rowGap:12,marginTop:14},
  statCard:{width:"48%",backgroundColor:"#fff",borderRadius:14,padding:12,borderWidth:1,borderColor:"#E6E7EE"},
  statIcon:{width:32,height:32,borderRadius:10,backgroundColor:"#F2F3F7",alignItems:"center",justifyContent:"center",marginBottom:8},
  statLabel:{fontSize:12,color:"#666",fontWeight:"700"},
  statValue:{fontSize:20,color:"#111",fontWeight:"900",marginTop:2},
  statSub:{fontSize:11,color:"#777",marginTop:4},

  card:{backgroundColor:"#fff",borderRadius:14,padding:14,borderWidth:1,borderColor:"#E6E7EE",marginTop:12},
  cardTitle:{fontSize:16,fontWeight:"800",color:"#111"},
  cardSub:{fontSize:12,color:"#666",marginTop:4},

  barRow:{flexDirection:"row",alignItems:"center",gap:10,marginBottom:10},
  barLbl:{width:46,fontSize:12,color:"#111",fontWeight:"700"},
  barTrack:{flex:1,height:10,borderRadius:999,backgroundColor:"#ECEEF4",overflow:"hidden"},
  barFill:{height:10,borderRadius:999,backgroundColor:"#111"},
  barVal:{width:30,textAlign:"right",fontSize:12,color:"#666",fontWeight:"700"},

  bullet:{fontSize:13,color:"#111",lineHeight:18},
});