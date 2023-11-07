import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity
  } from "react-native";
import { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
  
export default function LecteurEncours(props) {

const handleSwitch = () => {
    
    props.handleDisplay()
}
    return (
      <View style={styles.container}>
          <View style={styles.box}>
            <View>
              <Image style={styles.image} source={{ uri: props.type }} />
            </View>
            <View>
              <Text style={styles.plaque}>{props.plaque}</Text>
              <Text style={styles.etat}>{props.etat} </Text>
            </View>
            <TouchableOpacity onPress={() => handleSwitch()}>
          <MaterialCommunityIcons
            name="skip-next"
            size={(fontSize = 35)}
            color="black"
          />
            </TouchableOpacity>
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
          marginTop:10,
          fontSize:15,
          color:'grey',
          fontStyle:'italic',
          marginLeft:-10,
      },
      box:{
          marginTop:15,
          backgroundColor:'white',
          alignItems:'center',
          justifyContent:'space-between',
          width:'95%',
          borderRadius:20,
          padding:5,
          flexDirection:'row'
      },
      plaque:{
          marginTop:5,
          color:'black',
          fontWeight:'bold',
          marginLeft:-10,
      },
      image: {
        width: 100,
        height: 70,
      },
  });
  