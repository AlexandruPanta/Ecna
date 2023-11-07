import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Fiche_intervention from "../components/Fiche_intervention";
import SearchBar from "../components/SearchBar";
import GV from "../assets/grosVolume.png";
import MV from "../assets/moyenVolume.png";
import VSLsrc from "../assets/VSL.png";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SearchResults({ navigation: { navigate } }) {
  const GVuri = Image.resolveAssetSource(GV).uri;
  const MVuri = Image.resolveAssetSource(MV).uri;
  const VSLuri = Image.resolveAssetSource(VSLsrc).uri;
  const imagesData = { Gros: GVuri, Classique: MVuri, VSL: VSLuri };

  const searchResult = useSelector((state) => state.searchResult.value);
  const searchResultDisplay = searchResult.map((inter, i) => {
    // Mise en format de la date
    const day = new Date(inter.date).getDate();
    const month = new Date(inter.date).getMonth();
    const year = new Date(inter.date).getFullYear();
    let date = month + "/" + day + "/" + year;
    // Création des elements JSX avec le composant
    if (inter.vehicule === null) {
      return (
        <Fiche_intervention
          key={i}
          lastName={inter.patient.lastName}
          firstName={inter.patient.firstName}
          departure={inter.departure}
          arrival={inter.arrival}
          date={date}
          dispatched={inter.vehicule}
          interToken={inter.interToken}
        />
      );
    } else {
      return (
        <Fiche_intervention
          key={i}
          lastName={inter.patient.lastName}
          firstName={inter.patient.firstName}
          departure={inter.departure}
          arrival={inter.arrival}
          date={date}
          dispatched={inter.vehicule}
          plaque={inter.vehicule.plaque}
          interToken={inter.interToken}
          type={imagesData[inter.vehicule.type]}
        />
      );
    }
  });

  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <TouchableOpacity
        onPress={() => navigate("TabNavigator", { screen: "Acceuil" })}
      >
        <View style={styles.back_button}>
          <MaterialIcons
            name="arrow-back-ios"
            size={(fontSize = 25)}
            color="white"
          />
        </View>
      </TouchableOpacity>
      <View style={styles.search_bar}>
        <SearchBar screenName={"SearchResults"} />
      </View>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
      >
        {searchResultDisplay}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  search_bar: {
    alignContent: "center",
    justifyContent: "center",
  },
  back_button: {
    marginLeft: 10,
    marginTop: 80,
    marginBottom: 20,
  },
});
