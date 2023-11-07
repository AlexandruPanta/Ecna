import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

export default function VehiculeDashBoard(item) {
  const [selected, setSelected] = useState(false);
  const handleSet = () => {
    if (item.click) {
      item.tunnel(item.plaque);
      setSelected(!selected);
    }
  };
  if (selected && item.plaque === item.selected) {
    styles.image = {
      height: "90%",
      width: "100%",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "white",
      borderRadius: 20,
    };
  } else {
    styles.image = {
      height: "90%",
      width: "100%",
      alignItems: "center",
    };
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={() => handleSet()}>
        <Image style={styles.image} source={{ uri: item.type }} />
        <View style={styles.bottom}>
          <FontAwesome name="circle" size={(fontSize = 10)} color="green" />
          <Text style={styles.txt}>{item.plaque}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 200,
    width: 200,
    borderRadius: 20,
  },
  image: {
    height: "70%",
    width: "100%",
    alignItems: "center",
  },
  bottom: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  txt: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  touchable: {
    height: "90%",
    width: "100%",
    alignItems: "center",
  },
});
