import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateSearchQuery } from "../reducers/searchQuery";
import { updateSearchResults } from "../reducers/searchResult";
import { useDispatch, useSelector } from "react-redux";

export default function SearchBar(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const recherche = useSelector((state) => state.searchQuery.value);
  const interventions = useSelector((state) => state.interventions.value);

  const handleSearch = () => {
    const pattern = new RegExp(recherche, "i");
    const searchQuery = interventions.filter(
      (inter) =>
        inter.patient.lastName.match(pattern) ||
        inter.patient.firstName.match(pattern)
    );
    dispatch(updateSearchResults(searchQuery));
    if (recherche == "") {
      Alert.alert(
        "Stop ✋!",
        "Complétez les champs pour effectuer la recherche"
      );
    } else {
      navigation.navigate(props.screenName);
    }
  };
  return (
    <View style={styles.containerUn}>
      <View
        style={styles.containerdeux}
        // enabled
        // keyboardVerticalOffset={60}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.inputplaceholder}
          placeholder="Recherche..."
          placeholderTextColor="white"
          onChangeText={(value) => dispatch(updateSearchQuery(value))}
          value={recherche}
        />
        <TouchableOpacity
          onPress={() => handleSearch()}
          style={styles.verifyButton}
        >
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerUn: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "white",
  },
  containerdeux: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  inputplaceholder: {
    width: "85%",
    paddingLeft: 10,
    color: "white",
    height: 40,
  },
  verifyButton: {
    alignItems: "center",
    justifyContent: "cneter",
    width: "20%",
  },
});
