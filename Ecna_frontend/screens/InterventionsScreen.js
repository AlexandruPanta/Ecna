import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Fiche_intervention from "../components/Fiche_intervention";
import GV from "../assets/grosVolume.png";
import MV from "../assets/moyenVolume.png";
import VSLsrc from "../assets/VSL.png";
import { LinearGradient } from "expo-linear-gradient";

export default function InterventionsScreen() {
  const user = useSelector((state) => state.user.value);
  const interventions = useSelector((state) => state.interventions.value);
  let interventionsDisplay = interventions.slice(0).reverse()
  console.log("interventions", interventions);

  // Import images ambulance
  const GVuri = Image.resolveAssetSource(GV).uri;
  const MVuri = Image.resolveAssetSource(MV).uri;
  const VSLuri = Image.resolveAssetSource(VSLsrc).uri;
  const imagesData = { Gros: GVuri, Classique: MVuri, VSL: VSLuri };

  const displayInterventions = interventionsDisplay.map((inter, i) => {
    // Mise en format de la date
    const day = new Date(inter.date).getDate();
    const month = new Date(inter.date).getMonth()+1 
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
          etat={inter.etat}
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
          etat={inter.etat}
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
      <Text style={styles.title}>Interventions</Text>
      <View style={styles.line} />
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
      >
        {displayInterventions}
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 35,
    marginTop: 130,
    marginLeft: 10,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  line: {
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
