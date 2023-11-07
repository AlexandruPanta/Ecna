import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import GV from "../assets/grosVolume.png";
import MV from "../assets/moyenVolume.png";
import VSLsrc from "../assets/VSL.png";
import { defineListVehicules } from "../reducers/vehicules";
import { defineListVehiculesDispo } from "../reducers/vehiculesDispo";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function EnCours(props) {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Import des images des assets et création de l'objet permettant de les dispatch
  const GVuri = Image.resolveAssetSource(GV).uri;
  const MVuri = Image.resolveAssetSource(MV).uri;
  const VSLuri = Image.resolveAssetSource(VSLsrc).uri;
  const imagesData = { Gros: GVuri, Classique: MVuri, VSL: VSLuri };

  return (
    <View style={styles.container}>
        <Text style={styles.etat}>{props.etat} </Text>
        <View style={styles.box}>
            <Text style={styles.id}>{props.lastName} {props.firstName} </Text>
            <Text style={styles.txt}>📍{props.departure} </Text>
            <Text style={styles.txt}>🏁{props.arrival} </Text>
        </View>
        <View>
            <Image style={styles.image} source={{ uri: props.type }} />
            <Text style={styles.plaque}>{props.plaque}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        alignItems:'center',
    },
    etat:{
        fontSize:20,
        color:'white',
        marginBottom:10
    },
    box:{
        marginTop:15,
        backgroundColor:'rgba(159,159,159, 0.7)',
        alignItems:'flex-start',
        width:'95%',
        borderRadius:20,
        padding:5
    },
    id:{
        fontWeight:'bold',
        marginBottom:10,
        marginLeft: 10,
        color:'white',
        fontSize:20,
    },
    txt:{
        color:'white',
        fontSize:17,
        marginBottom:5,
        marginLeft: 10,
    },
    plaque:{
        color:'white'
    }
});
