import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import CarouselDashboard from "./CarouselDashboard";
import { VirtualizedList } from "react-native-web";
import { defineListInter } from "../reducers/interventions";
import { defineListVehicules } from "../reducers/vehicules";
import { defineListVehiculesDispo } from "../reducers/vehiculesDispo";

export default function Fiche_intervention(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [modalVisible, setModalVisible] = useState(false);
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";
  const [plaque, setPlaque] = useState("");

  const definePlq = (plq) => {
    setPlaque(plq);
  };
  const handleDispatch = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleStart = () => {
    fetch(`${BACKEND_ADRESS}/interventions/start`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ interToken: props.interToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          // Mise à jour des interventions
          fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
            .then((response) => response.json())
            .then((interData) => {
              if (interData.result) {
                dispatch(defineListInter(interData.interventions));
                // Mise à jour vehicules
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
                    }
                  });
              }
            });
        }
      });
  };

  const handleEnd = () => {
    fetch(`${BACKEND_ADRESS}/interventions/end`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ interToken: props.interToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          // Mise à jour des interventions
          fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
            .then((response) => response.json())
            .then((interData) => {
              if (interData.result) {
                dispatch(defineListInter(interData.interventions));
                // Mise à jour vehicules
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
                    }
                  });
              }
            });
        }
      });
  };

  // Fonction à appeler lorsqu'un souhaite associer une intervention à un véhicule + mise à jour
  const handleUpdate = () => {
    fetch(`${BACKEND_ADRESS}/interventions/dispatch`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ plaque: plaque, interToken: props.interToken }),
    })
      .then((response) => response.json())
      .then((dispatchData) => {
        if (dispatchData.result) {
          // Mise à jour des interventions
          fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
            .then((response) => response.json())
            .then((interData) => {
              if (interData.result) {
                dispatch(defineListInter(interData.interventions));
                // Mise à jour vehicules
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
                    }
                  });
              }
            });
          setModalVisible(false);
        }
      });
  };

  return (
    <BlurView intensity={50} style={styles.intervention}>
      <View style={styles.left}>
        <Text style={styles.patient}>
          {props.lastName} {props.firstName}
        </Text>
        <Text style={styles.position}>📍 {props.departure}</Text>
        <Text style={styles.position}>🏁 {props.arrival}</Text>
        <Text style={styles.jour}>{props.date}</Text>
      </View>
      {props.dispatched && props.etat === "prévue" && (
        <View style={styles.carContainer}>
          <Image style={styles.image} source={{ uri: props.type }} />
          <View style={styles.carInfo}>
            <Text style={styles.plaque}>{props.plaque}</Text>
            <TouchableOpacity onPress={() => handleStart()}>
              <Text style={styles.statuscar}>Debuter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {props.dispatched && props.etat === "en cours" && (
        <View style={styles.carContainer}>
          <Image style={styles.image} source={{ uri: props.type }} />
          <View style={styles.carInfo}>
            <Text style={styles.plaque}>{props.plaque}</Text>
            <TouchableOpacity onPress={() => handleEnd()}>
                <Text style={styles.statuscar}>Finir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {props.dispatched && props.etat === "finie" && (
        <View style={styles.carContainer}>
          <Image style={styles.image} source={{ uri: props.type }} />
          <View style={styles.carInfo}>
            <Text style={styles.plaque}>{props.plaque}</Text>
          </View>
        </View>
      )}
      {!props.dispatched && (
        <TouchableOpacity onPress={() => handleDispatch()}>
          <View style={styles.dispatch}>
            <Text style={styles.txtdispatch}>Dispatch</Text>
          </View>
        </TouchableOpacity>
      )}
      {/*Modal de dispatch*/}
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
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons
                    name="close-circle"
                    size={(fontSize = 25)}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalText}>
                Attribuez un véhicule pour la prochaine intervention
              </Text>
              <View style={styles.carousel}>
                <CarouselDashboard
                  definePlq={definePlq}
                  click={true}
                  selected={plaque}
                />
              </View>
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
      {!props.dispatched && props.etat === "finie" && <View></View>}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  intervention: {
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 20,
    flexDirection: "row",
    alignItems:'center',
    justifyContent: "space-between",
    padding: 10,
  },
  patient: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom:10,
  },
  position: {
    fontSize: 20,
    fontStyle: "italic",
    color: "white",
    marginBottom:5,
    marginLeft:5,
  },
  jour: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
    color: "white",
    marginLeft:5,
  },
  dispatch: {
    justifyContent: "flex-end",
    borderColor: "white",
    borderWidth: 2,
    marginRight:10,
    padding: 10,
    borderRadius: 20
  },
  txtdispatch: {
    color: "white",
  },
  plaque: {
    marginTop: 10,
    color: "white",
  },
  carContainer: {
    flexDirection: "column",
    alignItems: "center",
    margin:10,
    height: 120,
    width: "30%",
  },
  image: {
    width: "100%",
    height: 60,
    marginRight: 10,
    paddingBottom: 10
  },
  carInfo: {
    alignItems:'center'
  },
  left: {
    width: 240,
  },
  statuscar: {
    justifyContent: "flex-end",
    borderColor: "white",
    borderWidth: 2,
    marginRight:10,
    padding: 5,
    borderRadius: 10,
    color: 'white',
    marginTop : 10, 
  },
  //MODALE DISPATCH
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
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
    borderWidth: 1,
    borderColor: "white",
    width: "80%",
  },
  modalView: {
    backgroundColor: "transparent",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
  },
  close: {
    width: "100%",
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
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
  carousel: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  txt: {
    color: "white",
  },
});
