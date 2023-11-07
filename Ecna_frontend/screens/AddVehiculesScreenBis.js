import { StyleSheet } from "react-native";
import FicheAddVehicule from "../components/Fiche_AddVehicule";
import { LinearGradient } from "expo-linear-gradient";

export default function AddVehiculesScreenBis() {
  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.6, y: 0.7 }}
      end={{ x: 0.5, y: 1 }}
    >
      <FicheAddVehicule screenName={"Véhicules"} />
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
