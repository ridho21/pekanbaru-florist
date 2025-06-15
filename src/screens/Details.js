import React, { useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { FIRESTORE_DB } from '../firebase/Config';
import { collection, getDoc, getDocs, where, doc } from 'firebase/firestore';

const styles = StyleSheet.create({
  logo: {
    height: 60,
    width: 180
  },
})



export default function ({ navigation, route }) {
  const { isDarkmode, setTheme } = useTheme();
  const car = route.params;

  console.log(car);

  const handleItemPress = (item) => {
    navigation.navigate("Booking", item)
    // setModalVisible(true);
  };

  useEffect(() => {
  }, []);

  return (
    <Layout>
      <TopNav
        backgroundColor={themeColor.maroon}
        middleContent={
          <Image
            style={styles.logo}
            source={require('../../assets/logo-horizontal.png')}
          />
        }
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={themeColor.white}
          />
        }
        leftAction={() => navigation.goBack()}
      // rightContent={
      //   <Ionicons
      //     name={isDarkmode ? "sunny" : "moon"}
      //     size={20}
      //     color={isDarkmode ? themeColor.white100 : themeColor.dark}
      //   />
      // }
      // rightAction={() => {
      //   if (isDarkmode) {
      //     setTheme("light");
      //   } else {
      //     setTheme("dark");
      //   }
      // }}
      />
      <ScrollView>
        <View
          style={{
            alignItems: 'center'
            // justifyContent: "center",
          }}
        >
          <View style={{ padding: 15 }}>
            <Image style={{ width: '100%', aspectRatio: 1.5 }} source={{ uri: car.image_url }} />
          </View>
          {/* <Text fontWeight="bold" style={{ fontSize: 25, marginTop: 20 }}>{car.stock > 0 ? "Available" : "Out Of Stock"}</Text> */}
          <View style={{ backgroundColor: themeColor.maroon, width: '100%', borderRadius: 15, marginTop: '8%' }}>
            <Text fontWeight="bold" style={{ color: 'white', margin: '3%', fontSize: 25, textAlign: 'center' }}>{car.brand} | {car.car_name}</Text>
            <Text numberOfLines={5} style={{ alignItems: 'center', color: 'white', textAlign: 'justify', marginHorizontal: '5%' }}>{car.description}</Text>
            <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: '3%', justifyContent: 'center', padding: 10 }}>
              <View style={{ backgroundColor: 'white', width: 100, height: 100, marginHorizontal: '3%', borderRadius: 10 }}>
                <Ionicons
                  name="speedometer-outline"
                  style={{ textAlign: 'center', marginTop: '3%' }}
                  size={35}
                  color={isDarkmode ? themeColor.white100 : themeColor.dark}
                />
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 2 }}>Top Speed</Text>
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 4, fontWeight: 'bold' }}>{car.top_speed}km/h</Text>
              </View>
              <View style={{ backgroundColor: 'white', width: 100, height: 100, marginHorizontal: '3%', borderRadius: 10 }}>
                <Ionicons
                  name="car-outline"
                  style={{ textAlign: 'center', marginTop: '3%' }}
                  size={35}
                  color={isDarkmode ? themeColor.white100 : themeColor.dark}
                />
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 2 }}>Car Year</Text>
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 4, fontWeight: 'bold' }}>{car.car_year}</Text>
              </View><View style={{ backgroundColor: 'white', width: 100, height: 100, marginHorizontal: '3%', borderRadius: 10 }}>
                <Ionicons
                  name="flame-outline"
                  style={{ textAlign: 'center', marginTop: '3%' }}
                  size={35}
                  color={isDarkmode ? themeColor.white100 : themeColor.dark}
                />
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 2 }}>Max Fuel</Text>
                <Text style={{ color: 'black', fontSize: 17, textAlign: 'center', marginTop: 4, fontWeight: 'bold' }}>{car.max_fuel}L</Text>
              </View>
            </View>
            {/* <View style={{ margin: '25%' }}></View> */}
          </View>
          <View style={{width: '80%'}}>
            <Button
              status="maroon"
              text="Pesan Sekarang"
              style={{ marginTop: 20 }}
              onPress={() => Linking.openURL('https://wa.me/6282284924141')}
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: '0%', backgroundColor: 'grey', width: '100%', height: 'auto', borderTopStartRadius: 20, borderTopEndRadius: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: '5%' }}>
          <Text style={{ color: 'white', fontSize: 20, marginStart: '5%' }}>Price</Text>
          <Text style={{ color: 'white', fontSize: 20, marginStart: 'auto', marginEnd: '5%' }}>Rp.{car.price}/Day</Text>
        </View>
        <View style={{ alignItems: 'center', marginVertical: '4%' }}>
          <Button
            style={{ alignItems: 'center', borderRadius: 20 }}
            width={'93%'}
            disabled={car.stock > 0 ? false : true}
            status="danger"
            text="Booking Now"
            onPress={() => handleItemPress(car)}
          />
        </View>
      </View>
    </Layout>
  );
}
