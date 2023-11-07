import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ScrollView
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import vehicules, { defineListVehicules } from "../reducers/vehicules";
import CarouselDashboard from "../components/CarouselDashboard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBar from "../components/SearchBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { defineListVehiculesDispo } from "../reducers/vehiculesDispo";
import { defineListPatients } from "../reducers/listPatients";
import { defineListInter } from "../reducers/interventions";
import { LinearGradient } from "expo-linear-gradient";
// Bottom Sheet
import { StatusBar } from "expo-status-bar";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { addtokenToSotre, addSirenToSotre } from "../reducers/user";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import EnCours from "../components/EnCours";
import LecteurEncours from "../components/LecteurEncours";
import GV from "../assets/grosVolume.png";
import MV from "../assets/moyenVolume.png";
import VSLsrc from "../assets/VSL.png";

export default function DashboardScreen(props) {
  // Import des images des assets et création de l'objet permettant de les dispatch
  const GVuri = Image.resolveAssetSource(GV).uri;
  const MVuri = Image.resolveAssetSource(MV).uri;
  const VSLuri = Image.resolveAssetSource(VSLsrc).uri;
  const imagesData = { Gros: GVuri, Classique: MVuri, VSL: VSLuri };
  const navigation = useNavigation();
  // BOTTOM SHEET MODAL + STATE DES ICONES
  const [encours, setEnCours] = useState(false);
  const [samu, setSamu] = useState(false);
  const [ulterieures, setUlterieures] = useState(false);
  const [anomalies, setAnomalies] = useState(false);
  const [vehiculesEnCours, setVehiculesEnCours] = useState([{plaque:"-", etat:'-', type:'-' }]);
  const [interEnCours, setInterEnCours] = useState([]);

  const dispatch = useDispatch();
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";
  const user = useSelector((state) => state.user.value);
  const interventions = useSelector((state) => state.interventions.value);
  const recherche = useSelector((state) => state.searchQuery.value);
  const vehicules = useSelector((state) => state.vehicules.value);
  const BottomSheetModalRef = useRef(null);
  const snapPoints = ["20%", "50%", "85%"];
  const [modalVisible, setModalVisible] = useState(false);
  const [anomalieVisible, setAnomalieVisible] = useState(false);
  const [value, setValue] = useState("");
  let interEnCoursDisplay = []; 
  let vehiculesEnCoursDisplay = []
  const [iconName, setIconame] = useState("");
  const [iconNameMI, setIconameMI] = useState("");
  const [count,setCount] = useState(0)
  let etat = "";

  //Fonction pour la bottomsheet 
  function handlePressModal(name) {
    BottomSheetModalRef.current?.present();
    setValue();
    if (name == "dangerous") { 
      setAnomalieVisible(true);
      console.log(anomalieVisible);
    } else if (name == "skip-next") {
      setInterEnCours(interventions.filter((e) => e.etat === "prévue"));
        if (interEnCours.length === 0) {
          setIconame("");
          setIconameMI("");
        } else {
          setIconame("");
          setIconameMI(name);
          etat = interventions.etat;
        }
    } else if (name === "spinner") {
      setInterEnCours(interventions.filter((e) => e.etat === "en cours"));
        if (interEnCours.length === 0) {
          setIconame("");
          setIconameMI("");
        } else {
          setIconameMI("");
          setIconame(name);
          etat = interventions.etat;
        }
    } else if (name == "alarm-light") {
    }
  }


  if (interEnCours.length > 0) {
    interEnCoursDisplay = interEnCours.map((inter, i) => {
      console.log(inter.patient.firstName);
      return (
        <EnCours
          key={i}
          etat={inter.etat}
          lastName={inter.patient.lastName}
          firstName={inter.patient.firstName}
          departure={inter.departure}
          arrival={inter.arrival}
        />
      );
    });
  } else {
    interEnCoursDisplay = (
      <View>
        <Text style={{ color: "white", fontSize: 20 }}>
          Rien à afficher pour le moment
        </Text>
      </View>
    );
  }

  // A l'initialisation du dashboard, dispatch de toutes les informations
  useEffect(() => {
    // Fetch des vehicules correspondant au siren
    fetch(`${BACKEND_ADRESS}/vehicules/${user.SIREN}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(defineListVehicules(data.vehicules));
          dispatch(
            defineListVehiculesDispo(
              data.vehicules.filter((e) => e.etat === "En ligne")
            )
          );
          setVehiculesEnCours(
            data.vehicules.filter((e) => e.etat === "En cours d'intervention")
          );
        }
      });
    // Fetch des patients correspondant au token
    fetch(`${BACKEND_ADRESS}/patients/all/${user.token}`)
      .then((response) => response.json())
      .then((patientData) => {
        if (patientData.result) {
          // Fonction qui permet de trier les patients par ordre alphabétique
          function sortPatients(a, b) {
            if (a.lastName < b.lastName) {
              return -1;
            } else if (a.lastName > b.lastName) {
              return 1;
            }
            return 0;
          }
          const sorted = patientData.patients.sort(sortPatients);
          // Dispatch dans le reducer
          dispatch(defineListPatients(sorted));
        }
      });
    // Fetch des interventions correspondant au SIREN
    fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
      .then((response) => response.json())
      .then((interData) => {
        if (interData.result) {
          dispatch(defineListInter(interData.interventions));
        }
      });
  }, []);

 
  
  console.log('vehicule en cours',vehiculesEnCours)
  console.log('count ',count)


  // Fonction logout
  const logHandle = () => {
    dispatch(addSirenToSotre(null));
    dispatch(addtokenToSotre(null));
    navigation.navigate("Home");
  };
  
  const handleDisplay = () =>{
    if(count === vehiculesEnCours.length -1){
      console.log('setcount0')
      setCount(0)
    } else {
      setCount(count+1)
    } 
  } 
  if(vehiculesEnCours.length > 0) {
    vehiculesEnCoursDisplay=
    <LecteurEncours 
    plaque = {vehiculesEnCours[count].plaque}
    etat = {vehiculesEnCours[count].etat}
    type = {imagesData[vehiculesEnCours[count].type]}
    handleDisplay = {handleDisplay}
    />
  }

  // LECTEUR

  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.maintitle}>
        <Text style={styles.h1}> Véhicules disponibles </Text>
        <CarouselDashboard click={false}></CarouselDashboard>
      </View>
      {/* BARRE DE RECHERCHE */}
      <View style={styles.searchbar}>
        <KeyboardAvoidingView>
            <SearchBar screenName={"SearchResults"} />
        </KeyboardAvoidingView>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity
          style={styles.title}
          onPress={() => handlePressModal("spinner")}
        >
          <FontAwesome name="spinner" size={(fontSize = 25)} color="white" />
          <Text style={styles.txt}>En cours </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.title}
          onPress={() => handlePressModal("alarm-light-outline")}
          value="samu"
        >
          <MaterialCommunityIcons
            name="alarm-light-outline"
            size={(fontSize = 25)}
            color="white"
          />
          <Text style={styles.txt}>SAMU</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          name="skip-next"
          style={styles.title}
          onPress={() => handlePressModal("skip-next")}
        >
          <MaterialCommunityIcons
            name="skip-next"
            size={(fontSize = 25)}
            color="white"
          />
          <Text style={styles.txt}>Ultérieures</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logHandle()} style={styles.title}>
          <MaterialCommunityIcons
            name="exit-run"
            size={(fontSize = 30)}
            color="white"
            style={{ transform: [{ rotateY: "180deg" }], top: 0 }}
          />
          <Text style={styles.txt}>Déconnexion</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.title}
          onPress={() => handlePressModal("dangerous")}
        >
          <MaterialIcons
            name="dangerous"
            size={(fontSize = 25)}
            color="white"
          />
          <Text style={styles.txt}>Anomalies</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.containlecteur}>
      {vehiculesEnCoursDisplay}
      </View>

      {/* BOTTOM SHEET MODAL */}
      <BottomSheetModalProvider>
        <View style={styles.modalVisible}>
          <StatusBar style={styles.statusbar} />
          <BottomSheetModal
            ref={BottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            blurRadius={1}
            backgroundStyle={{
              borderRadius: 30,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              width: "100%",
            }}
          >
            <View style={styles.modalcontain}>
              <View style={styles.titleIcon}>
                <Text>{etat}</Text>
                <FontAwesome
                  name={iconName}
                  size={(fontSize = 25)}
                  color="white"
                />
                <MaterialCommunityIcons
                  name={iconNameMI}
                  size={(fontSize = 25)}
                  color="white"
                />
              </View>
                <View style={styles.containlecteur}>
                  {interEnCoursDisplay}
                </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    alignItems: "center",
  },
  maintitle: {
    fontSize: 55,
    fontWeight: "bold",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    width: "100%",
    backgroundColor: "white",
    height: '50%',
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    top: -10,
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  //SEARCHBAR
  searchbar: {
    width: "85%",
    top: 25,
  },
  // LISTE ICONES
  icons: {
    top: 5,
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  //ICONES
  title: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "25%",
    marginTop: 50,
  },
  //TITRES DES ICONES
  txt: {
    marginTop: 5,
    fontSize: 13,
    color: "white",
    marginBottom: 5,
  },
  lecteur: {
    flexDirection: "row",
    top: 165,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    marginLeft: "2.5%",
  },
  //LOGOUT
  logout: {
    width: "100%",
    top: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  deconnexion: {
    alignItems: "center",
  },
  //BottomSheet Modal
  modalVisible: {
    width: "100%",
  },
  statusbar: {
    width: 30,
  },
  containermodal: {
    flex: 1,
    borderColor: "red",
    borderWidth: 30,
    height: 500,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalcontain: {
    alignItems: "center",
  },
  titleIcon: {
    flexDirection: "row",
  },
  txtmodal: {
    color: "white",
    fontSize: 35,
  },
  // LECTEUR
  containlecteur: {
    width: "95%",
    height: 100,
    overflow: "hidden",
    top: 120,
  },
  // lecteur: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   overflow: "hidden",
  //   width: "100%",
  //   height: 75,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  // },
});
