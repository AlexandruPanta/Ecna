import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { useSelector, useDispatch } from "react-redux";
import { defineListInter } from "../reducers/interventions";
import { defineListVehicules } from "../reducers/vehicules";
import { defineListVehiculesDispo } from "../reducers/vehiculesDispo";
import { BlurView } from "expo-blur";
import { addInterPlaque } from "../reducers/interVehicules";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function FicheVehicule(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";
  const user = useSelector((state) => state.user.value);
  const etats = ["En ligne", "Hors ligne", "Indisponible"];
  const interventions = useSelector((state) => state.interventions.value);
  const [etat, setEtat] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Update du reducer lorsqu'on clique sur un composant véhicule afin de stocker la liste des interventions dans le reducer
  function handlePress() {
    let interVehicule = [];
    for (let inter of interventions) {
      if (inter.vehicule) {
        if (inter.vehicule.plaque === props.plaque) {
          interVehicule.push(inter);
        }
      }
    }
    dispatch(
      addInterPlaque({ plaque: props.plaque, interventions: interVehicule })
    );
    navigation.navigate(props.screenName);
  }

  const modalview = () => {
    setModalVisible(true);
  };
  const handleClose = () => {
    setModalVisible(false);
  };
  // Fonction qui modifie l'état du vehicule dans la BDD et refetch la liste de vehicules pour update le reducer et recharger le composant
  const handleUpdate = () => {
    fetch(`${BACKEND_ADRESS}/vehicules/update/${props.plaque}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        etat: etat,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(`${BACKEND_ADRESS}/vehicules/${user.SIREN}`)
          .then((response) => response.json())
          .then((vehiculesData) => {
            if (etat == null) {
              Alert.alert("Oups!", "Vous n'avez pas choisi le statut");
            }
            dispatch(defineListVehicules(vehiculesData.vehicules));
            dispatch(
              defineListVehiculesDispo(
                vehiculesData.vehicules.filter((e) => e.etat === "En ligne")
              )
            );
          });
      });
    setModalVisible(false);
  };

// Fonction qui se declenche lorsqu'un clique sur supprimer véhicule dans la modale
  const handleSup = () =>{
    Alert.alert('Suppression véhicule', 'Voulez-vous supprimer ce véhicule ?', [
      {
        text: 'Non',
      },
      {text: 'Oui', onPress: () => handleDelete()},
    ]);
  }
  const handleDelete= () =>{
    fetch(`${BACKEND_ADRESS}/vehicules/delete/${props.plaque}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(`${BACKEND_ADRESS}/vehicules/${user.SIREN}`)
          .then((response) => response.json())
          .then((vehiculesData) => {
            dispatch(defineListVehicules(vehiculesData.vehicules));
            dispatch(defineListVehiculesDispo(vehiculesData.vehicules.filter(e=>e.etat === 'En ligne')))
          });
      });
      fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
            .then((response) => response.json())
            .then((interData) => {
              if (interData.result) {
                dispatch(defineListInter(interData.interventions))
                setModalVisible(false)
              }
            })
  }
  return (
    <BlurView intensity={50} style={styles.view}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress()}>
          <View style={styles.left}>
            <Text style={styles.plaque}>{props.plaque}</Text>
            <View style={styles.grpEtat}>
              <FontAwesome
                name="circle"
                size={(fontSize = 10)}
                color={props.color}
              />
              <Text style={styles.etat}>{props.etat}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={modalview}>
          <View style={styles.imageView}>
            <Image style={styles.image} source={{ uri: props.type }} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        style={styles.modal}
      >
        <View style={styles.centeredView}>
          <View style={styles.centeredViewtwo}>
            <BlurView intensity={50} style={styles.modalView}>
              <View style={styles.close}>
              <TouchableOpacity
                onPress={() => handleSup()}
                style={styles.button_sup}
              >
                <Text style={styles.txt}>Supprimer Véhicule</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons
                    name="close-circle"
                    size={(fontSize = 25)}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>Modifier le statut</Text>
              <SelectDropdown
                data={etats}
                onSelect={(selectedItem, index) => {
                  setEtat(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.option}
              />
              <TouchableOpacity
                onPress={() => handleUpdate()}
                style={styles.button}
              >
                <Text style={styles.txt}>Ok</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </Modal>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  view: {
    borderBottomColor: "grey",
    marginBottom: 20,
    paddingBottom: 10,
  },
  container: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    height: 100,
    width: "100%",
  },
  plaque: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 10,
  },
  etat: {
    paddingLeft: 10,
    fontSize: 13,
    color: "white",
  },
  left: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  grpEtat: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 140,
  },
  imageView: {
    paddingLeft: 70,
  },
  //MODALE AU CLIC SUR LE VÉHICULE
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    opacity: "10%",
    overflow: "hidden",
  },
  centeredViewtwo: {
    overflow: "hidden",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    width: "65%",
  },
  modalView: {
    backgroundColor: "transparent",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
  },
  close: {
    width: "100%",
    flexDirection:'row',
    alignItems: "center",
    justifyContent:"space-between",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: "white",
  },
  button: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  txt: {
    color: "white",
  },
  option: {
    borderRadius: 10,
  },
  button_sup: {
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
});
