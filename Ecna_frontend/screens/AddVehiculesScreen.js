import { StyleSheet } from "react-native";
import FicheAddVehicule from "../components/Fiche_AddVehicule";
import { LinearGradient } from "expo-linear-gradient";

export default function AddVehiculesScreen() {
  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x:0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <FicheAddVehicule screenName={"TabNavigator"} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
