import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Patient from "../components/Patient";
import { addpatientToStore } from "../reducers/patient";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

export default function PhoneScreen({ navigation }) {
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const patients = useSelector((state) => state.listPatients.value);

  // Fonction qui permet de récuperer les informations du patient et de naviguer vers la page qui affiche les informations
  // patients en fonction de son numero de securité sociale
  const handleClick = (SSnumber) => {
    const infoPatient = patients.filter((e) => e.SSnumber === SSnumber);
    dispatch(addpatientToStore(infoPatient[0]));
    navigation.navigate("Infosdupatient");
  };

  const patientsDisplay = patients.map((patient, i) => {
    patient.lastName = patient.lastName.toUpperCase();
    return (
      <TouchableOpacity key={i} onPress={() => handleClick(patient.SSnumber)}>
        <Patient
          lastName={patient.lastName}
          firstName={patient.firstName}
          SSNumber={patient.SSnumber}
        />
      </TouchableOpacity>
    );
  });

  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.box}>
        <Text style={styles.title}> Répertoire </Text>
      </View>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
        >
      {patientsDisplay}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  box: {
    marginTop: 130,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  title: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
