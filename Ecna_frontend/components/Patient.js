import { StyleSheet, Text, View } from "react-native";

export default function Patient(props) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.txt}>
          {props.lastName} {props.firstName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  box: {
    width: "100%",
    top: 40,
    marginBottom: 25,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
    paddingBottom: 5,
  },
  txt: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
