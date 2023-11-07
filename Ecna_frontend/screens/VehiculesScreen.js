import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import FicheVehicule from "../components/Fiche_Vehicule";
import GV from "../assets/grosVolume.png";
import MV from "../assets/moyenVolume.png";
import VSLsrc from "../assets/VSL.png";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const GVuri = Image.resolveAssetSource(GV).uri;
const MVuri = Image.resolveAssetSource(MV).uri;
const VSLuri = Image.resolveAssetSource(VSLsrc).uri;
const imagesData = { Gros: GVuri, Classique: MVuri, VSL: VSLuri };

const getColorByEtat = (etat) => {
  switch (etat) {
    case "En ligne":
      return "green";
    case "En cours d'intervention":
      return "orange";
    case "Indisponible":
      return "red";
    case "Hors ligne":
      return "black";
    default:
      return "black";
  }
};

export default function VehiculeScreen({ navigation }) {
  const dispatch = useDispatch();
  const vehicules = useSelector((state) => state.vehicules.value);
  let vehiculesDisplay = [];

  const handleAdd = () => {
    navigation.navigate("AddVehiculeBis");
  };

  if (vehicules.length > 0) {
    vehiculesDisplay = vehicules.map((data, i) => (
      <FicheVehicule
        key={i}
        plaque={data.plaque}
        etat={data.etat}
        color={getColorByEtat(data.etat)}
        type={imagesData[data.type]}
        screenName={"Interventionduvehicule"}
      />
    ));
  } else {
    vehiculesDisplay = (
      <Text style={{ color: "white", fontSize: 25 }}>
        Pas de véhicules associés à ce compte
      </Text>
    );
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.titreBox}>
        <View style={styles.firstbox}>
          <Text style={styles.titre}>Véhicules</Text>
          <Text style={styles.subtitle}>
            Cliquez sur la plaque ou le véhicule pour afficher le contenu
          </Text>
        </View>
        <View style={styles.btn}>
          <TouchableOpacity style={styles.btn} onPress={() => handleAdd()}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={(fontSize = 40)}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
      >
        <View style={styles.box}>{vehiculesDisplay}</View>
      </ScrollView>
      <View style={styles.trait} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  titre: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 15,
    color: "white",
    fontStyle: "italic",
  },
  titreBox: {
    flexDirection: "row",
    alignItems:'center',
    justifyContent: "space-between",
    width: "100%",
    marginTop: 130,
    marginBottom: 20,
    marginLeft: 20,
  },
  firstbox:{
    flexDirection:'column',
    width:'80%'
  },
  btn: {
    width: 50,
    height: 50,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icone: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
});
