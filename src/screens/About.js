import React, { useEffect } from "react";
import { View, Linking, Image, StyleSheet, FlatList, ScrollView } from "react-native";
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
    width: 120,
    height: 20,
  },
})


export default function ({ navigation, route }) {
  const { isDarkmode, setTheme } = useTheme();
  const car = route.params;

  console.log(car);

  const handleItemPress = (item) => {
    navigation.navigate("Booking")
    // setModalVisible(true);
  };

  useEffect(() => {
  }, []);

  return (
    <Layout>
      <TopNav
        middleContent={
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
          />
        }
      // leftContent={
      //   <Ionicons
      //     name="chevron-back"
      //     size={20}
      //     color={isDarkmode ? themeColor.white100 : themeColor.dark}
      //   />
      // }
      // leftAction={() => navigation.goBack()}
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
            margin: '5%',
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Text style={{
            fontSize: 30,
            fontWeight: "bold",
            margin: '5%'
          }}>CV NADHIF EQUATOR</Text>
          <Image style={{ width: '100%', aspectRatio: 2.3, padding: '5%', margin: '10%' }} source={require('../../assets/logo-about.png')} />
          <Text style={{fontSize:13, textAlign:'center', margin: '5%'}}>Jalan Labersa No.3 Simpang Tiga Bukit Raya, Tanah Merah, Kec. Siak Hulu, Kabupaten Kampar, Riau 28282</Text>
          <Text style={{ textAlign: 'justify', margin: '5%', letterSpacing: 0.8, lineHeight: 25 }}>
            CV NADHIF EQUATOR adalah sebuah perusahaan rental mobil Pekanbaru yang berdedikasi untuk memberikan pengalaman berkendara yang tak terlupakan

            kepada pelanggan. Dengan fokus pada kenyamanan, keandalan, dan pelayanan pelanggan yang superior, kami telah menjadi pilihan utama bagi mereka yang mencari solusi transportasi yang handal di setiap perjalanan Kami percaya bahwa setiap perjalanan memiliki cerita uniknya sendiri, dan kami di sini untuk membantu Anda menulis cerita Anda dengan kenyamanan dan

            kemudahan terbaik. Dari petualangan keluarga yang menyenangkan hingga perjalanan bisnis yang penting, kami hadir untuk menghadirkan solusi transportasi yang sesuai dengan kebutuhan.

            Mari kita berkenalan lebih dekat dengan CV Nadhif Equator dan temukan bagaimana kami dapat menjadi bagian dari petualangan Anda selanjutnya!
          </Text>
          {/* <Text style={{
            fontSize: 30,
            fontWeight: "bold",
            margin: '5%'
          }}>Contact Us</Text> */}
          <Button
            text="Contact Us"
            status='dark100'
            onPress={() => Linking.openURL('https://wa.me/6282284924141')}
            rightContent={<Ionicons name="chatbubbles-outline" style={{ color: 'white' }} size={30} />}>Contact Us</Button>

        </View>
      </ScrollView>
    </Layout>
  );
}
