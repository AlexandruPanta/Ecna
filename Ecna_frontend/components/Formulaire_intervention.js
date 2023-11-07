import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { defineListInter } from "../reducers/interventions";
import { defineListPatients } from "../reducers/listPatients";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Formulaire_interventions(props) {
  const navigation = useNavigation();
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";
  const dispatch = useDispatch();
  const etats = ["Valide", "Invalide"];

  // Recuperation des informations du user du reducer
  const user = useSelector((state) => state.user.value);

  // Etats relatif aux inputs du formulaire
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [adress, setAdress] = useState(null);
  const [SSnumber, setSSnumber] = useState(null);
  const [phone, setPhone] = useState(null);
  const [mutuelle, setMutuelle] = useState(null);
  const [valide, setValide] = useState(null);
  const [existe, setExiste] = useState(false);
  const [Departure, setDeparture] = useState(null);
  const [Arrival, setArrival] = useState(null);
  const [error, setError] = useState(null);
  const [errorStyle, setErrorStyle] = useState({});
  const [colorPlaceholder, setcolorPlaceholder] = useState(false)

  const regexSSNFrance = /^[0-9]{15}$/;
  // Fonction qui se declenche lors du clique sur Search pour permettre de vérifier s'il existe un patient avec ce numero de securité
  // sociale dans la BDD, si oui préremplir les champs dédiés aux informations patients, si non renvoyer un message d'erreur
  const handlesearch = (SSnumber) => {
    fetch(`${BACKEND_ADRESS}/patients/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ SSnumber: SSnumber, token: user.token }),
    })
      .then((response) => response.json())
      .then((patientData) => {
        if (patientData.result) {
          setFirstName(patientData.patient.firstName);
          setLastName(patientData.patient.lastName);
          setAdress(patientData.patient.adress);
          setSSnumber(patientData.patient.SSnumber);
          setPhone(patientData.patient.phone);
          setMutuelle(patientData.patient.mutuelle);
          setValide(patientData.patient.valide);
          setExiste(true);
          setcolorPlaceholder(true)
          setError('')
        } else {
          setError(patientData.error);
          setErrorStyle({ color: "red", fontSize: 10 });
          setFirstName('');
          setLastName('');
          setAdress('');
          setPhone('');
          setMutuelle('');
          setValide('');
          setExiste(false);
          setDeparture('')
          setArrival('')
        }
      });
  }

  // Fonction qui se declenche lors du clique sur le bouton submit qui ajoute si necessaire le patient dans la BDD, et l'intervention quoi
  // qu'il arrive. Permet également de récuperer la liste des interventions/patients et de mettre à jour le reducer
  const handleSubmit = () => {
    // add inter/patient
    const testSiren = regexSSNFrance.test(SSnumber)
    console.log(testSiren)
    if(testSiren){
    fetch(`${BACKEND_ADRESS}/interventions/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        existe: existe,
        firstName: firstName,
        lastName: lastName,
        adress: adress,
        SSnumber: SSnumber,
        mutuelle: mutuelle,
        valide: valide,
        phone: phone,
        departure: Departure,
        arrival: Arrival,
        SIREN: user.SIREN,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setFirstName("");
        setLastName("");
        setAdress("");
        setSSnumber("");
        setPhone("");
        setMutuelle("");
        setValide("");
        setExiste(false);
        setDeparture("");
        setArrival("");
        // mise à jour du reducer interventions
        fetch(`${BACKEND_ADRESS}/interventions/${user.SIREN}`)
          .then((response) => response.json())
          .then((interData) => {
            if (interData.result) {
              dispatch(defineListInter(interData.interventions));
            }
            // mise à jour du reducer patients
          })
          .then(() => {
            fetch(`${BACKEND_ADRESS}/patients/all/${user.token}`)
              .then((response) => response.json())
              .then((patientData) => {
                if (patientData.result) {
                  dispatch(defineListPatients(patientData.patients));
                  navigation.navigate(props.screenName, {
                    screen: "Interventions",
                  });
                }
              });
          });
      });
  }else{
    setError('Sécurité Sociale non valide')
  }
}

  return (
    <LinearGradient
      style={styles.container}
      colors={["#1a2755", "#1D94AE"]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.bigtilte}>
        <Text style={styles.titre}>Nouvelle intervention</Text>
      </View>

      <ScrollView
        // horizontal={false}
        showsHorizontalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
        style={{ width: "100%" }}
      >
        <KeyboardAwareScrollView>
          <View style={styles.scrollview}>
            <View style={styles.infospatient}>
              <View style={styles.viewsoustitre}>
                <Text style={styles.soustitre}>Informations patient</Text>
              </View>
              <View style={styles.nomprenom}>
                <TextInput
                  style={styles.prenom}
                  placeholder="Nom"
                  placeholderTextColor="white"
                  onChangeText={(value) => setLastName(value)}
                  value={lastName}
                />
                <TextInput
                  style={styles.nom}
                  placeholder="Prénom"
                  placeholderTextColor="white"
                  onChangeText={(value) => setFirstName(value)}
                  value={firstName}
                />
              </View>
              <View style={styles.divinput}>
                <TextInput
                  style={styles.input}
                  placeholder="Adresse domicile"
                  placeholderTextColor="white"
                  onChangeText={(value) => setAdress(value)}
                  value={adress}
                />
              </View>
              <View style={styles.divinput}>
              <View style={styles.divplaceholder}>
                  {(!error && !colorPlaceholder) ? (
                    <TextInput
                      style={styles.inputplaceholder}
                      placeholder="Sécurité Sociale"
                      placeholderTextColor="white"
                      onChangeText={(value) => setSSnumber(value)}
                      value={SSnumber}
                    />
                  ) : error ? (
                    <TextInput
                      style={{
                        borderRadius: 10,
                        backgroundColor: "red",
                        width: "80%",
                        borderColor: "white",
                        height: 40,
                        marginBottom: 60,
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: "white",
                        paddingLeft: 10,
                      }}
                      placeholder="Sécurité Sociale"
                      placeholderTextColor="white"
                      onChangeText={(value) => setSSnumber(value)}
                      value={SSnumber}
                    />
                  ) : (
                    <TextInput
                      style={{
                        borderRadius: 10,
                        backgroundColor: "green",
                        width: "80%",
                        borderColor: "white",
                        height: 40,
                        marginBottom: 60,
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: "white",
                        paddingLeft: 10,
                      }}
                      placeholder="Sécurité Sociale"
                      placeholderTextColor="white"
                      onChangeText={(value) => setSSnumber(value)}
                      value={SSnumber}
                    />
                  )}
                  <View>
                    <TouchableOpacity onPress={() => handlesearch(SSnumber)} style={styles.search}>
                      <Text style={styles.txt}>Search</Text>
                    </TouchableOpacity>
                    <Text style={errorStyle}>{error}</Text>
                  </View>
                </View>
              </View>

              {/* Telephone + Valide */}
              <View style={[styles.small]}>
                <TextInput
                  style={styles.telephone}
                  placeholder="Téléphone"
                  placeholderTextColor="white"
                  onChangeText={(value) => setPhone(value)}
                  value={phone}
                />
                {/* DropDown */}
                <SelectDropdown
                  defaultButtonText="Patient  ▾"
                  buttonStyle={styles.dropdown}
                  buttonTextStyle={styles.dropText}
                  dropdownStyle={styles.card_drop}
                  placeholderStyle={styles.placeholderStyle}
                  data={etats}
                  onSelect={(selectedItem, index) => {
                    setValide(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  
                />
              </View>

              <View style={styles.divinput}>
                <TextInput
                  style={styles.input}
                  placeholder="Mutuelle"
                  placeholderTextColor="white"
                  onChangeText={(value) => setMutuelle(value)}
                  value={mutuelle}
                />
              </View>
            </View>
            <View style={styles.infospatient}>
              <View style={styles.viewsoustitre}>
                <Text style={styles.soustitre}>Détails intervention</Text>
              </View>
              <View style={styles.divinput}>
                <TextInput
                  style={styles.input}
                  placeholder="Lieu de départ"
                  placeholderTextColor="white"
                  onChangeText={(value) => setDeparture(value)}
                  value={Departure}
                />
              </View>
              <View style={styles.divinput}>
                <TextInput
                  style={styles.input}
                  placeholder="Lieu d'arrivée"
                  placeholderTextColor="white"
                  onChangeText={(value) => setArrival(value)}
                  value={Arrival}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <View>
        <TouchableOpacity style={styles.search} onPress={() => handleSubmit()}>
          <Text style={styles.txt}>Submit</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  //TITRE DE LA PAGE
  bigtilte: {
    width: "100%",
    borderColor: "grey",
    borderBottomWidth: 1,
    marginTop: 130,
  },
  titre: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    fontStyle:'italic',
    marginLeft:10,
  },


  //SCROLLVIEW
  scrollview: {
    top: 10,
  },
  infospatient: {
    width: "100%",
    alignItems: "center",
  },
  viewsoustitre: {
    width: "100%",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "white",
    justifyContent: "flex-start",
  },
  soustitre: {
    color: "white",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "bold",
    paddingLeft: 10,
  },
  search: {
    width: 100,
    height: 40,
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    width: "100%",
    color: "white",
    height: 40,
    borderRadius: 10,
    backgroundColor: "transparent",
    marginTop: 5,
    paddingLeft: 10,
  },
  txt: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  nomprenom: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    height: 20,
    marginBottom: 25,
  },
  nom: {
    width: "45%",
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
  },
  prenom: {
    width: "45%",
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    height: 40,
    marginRight: "5%",
    borderRadius: 10,
    paddingLeft: 10,
  },
  divinput: {
    color: "white",
    width: "85%",
    borderColor: "white",
    height: 20,
    marginBottom: 40,
  },
  small: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "85%",
    marginBottom: 10,
  },
  telephone: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    color: "white",
  },
  dropdown: {
    width: "50%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
  },
  dropText: {
    color: "white",
  },
  valide: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    borderRadius: 10,
    width: "45%",
  },
  divplaceholder: {
    marginTop: 5,
    flexDirection: "row",
    width: "80%",
  },
  inputplaceholder: {
    borderRadius: 10,
    backgroundColor: "#a19999",
    width: "80%",
    borderColor: "white",
    height: 40,
    marginBottom: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "white",
    paddingLeft: 10,
  },
});
