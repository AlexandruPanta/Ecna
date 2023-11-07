import { useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { addtokenToSotre, addSirenToSotre } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import background from "../assets/ambulance.jpg";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const ref_input2 = useRef();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const user = useSelector((state) => state.user.value);
  const BACKEND_ADRESS =
    "https://ecna-backend-odpby015w-olivermunian.vercel.app";

  const handleSubmit = () => {
    fetch(`${BACKEND_ADRESS}/users/signin`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addtokenToSotre(data.token));
          dispatch(addSirenToSotre(data.SIREN));
          setUserName("")
          setPassword('')
          navigation.navigate("TabNavigator");
        } else {
          setErrorMessage(data.error);
        }
      });
  };

  console.log("token", user.token);
  console.log("Siren", user.SIREN);

  const navigate = () => {
    navigation.navigate("Subscribe");
  };

  return (
    <View style={styles.containerUn}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
        blurRadius={2}
      >
        {/* <Text style={styles.title}> ECNA </Text>
        <Text style={styles.titleDeux}> Time is now your </Text> */}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.bigtitle}>
            <Text style={styles.title}> ECNA </Text>
            <Text style={styles.titleDeux}> Time is now yours</Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.txt}>
              {" "}
              Veuillez compléter tous les champs pour continuer{" "}
            </Text>
            <TextInput
              onChangeText={(value) => setUserName(value)}
              placeholder="Username"
              style={styles.input}
              placeholderTextColor={"white"}
              returnKeyType={"next"}
              onSubmitEditing={() => ref_input2.current.focus()}
            />
            <TextInput
              onChangeText={(value) => setPassword(value)}
              secureTextEntry={true}
              placeholder="Mot de passe"
              style={styles.input}
              placeholderTextColor={"white"}
              ref={ref_input2}
            />
            <Text style={styles.txtError}>{errorMessage}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleSubmit()}>
              <Text style={styles.btntxt}> Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate()}>
              <Text style={styles.redirection}>
                {" "}
                Vous n'avez pas encore de compte ? Cliquez ici{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  containerUn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  container: {
    top: 300,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    blurRadius: 5,
    height: 850,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  bigtitle: {
    width: "90%",
    alignItems: "flex-end",
  },
  title: {
    color: "white",
    fontSize: 65,
    fontWeight: "bold",
  },
  titleDeux: {
    marginRight: 60,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "left",
  },
  view: {
    marginTop: 35,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  txt: {
    marginBottom: 20,
    color: "white",
  },
  input: {
    backgroundColor: "transparent",
    width: "75%",
    height: 75,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "white",
    textAlign: "center",
    color: "white",
  },
  btn: {
    width: 130,
    height: 60,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
  },
  btntxt: {
    color: "white",
    fontWeight: "bold",
  },
  redirection: {
    marginTop: 20,
    color: "#00bcf0",
    textDecorationLine: "underline",
  },
  txtError: {
    color: "red",
    marginBottom: 20,
  },
});
