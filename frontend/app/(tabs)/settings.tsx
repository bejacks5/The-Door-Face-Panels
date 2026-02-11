import { StyleSheet, View, Text } from 'react-native'

const Settings = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.content}> Settings Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  content: {
    fontSize: 22,
  },
});

export default Settings