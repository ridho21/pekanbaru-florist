import React, { useEffect } from "react";
import { View, Linking, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  TextInput,
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
  const [filter, setFilter] = React.useState('ALL');
  const [search, setSearch] = React.useState('');
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
        backgroundColor={themeColor.maroon}
        borderColor='#FFFFFF'
        middleContent={
          <Image
            style={styles.logo}
            source={require('../../assets/logo-horizontal.png')}
          />
        }
      />
      <ScrollView>
        <View style={{ padding: 6 }}>

          <View style={{ marginTop: 5 }}>
            <TextInput
              containerStyle={{ height: 37, width: '90%', alignSelf: 'center' }}
              backgroundColor={themeColor.maroonbg}
              borderRadius={15}
              placeholder="Search"
              value={search}
              onChangeText={(val) => setSearch(val)}
              rightContent={
                <Ionicons name="search-outline" size={20} color={'grey'} />
              }
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 13, marginHorizontal: 12, alignContent: 'center', borderRadius: 10, borderColor: '#dddddd', borderWidth: 1 , padding: 3}}>
              <View style={{ flex: 0.33 }}>
                <Button onPress={() => {
                  setFilter('ALL')
                  fetchPost()
                }} status={filter == 'ALL' ? 'maroon' : 'white'} textStyle={{ color: filter == 'ALL' ? '#ffffff' : '#1a1919' }} size="sm" text="Papan Single" />
              </View>
              <View style={{ flex: 0.33 }}>
                <Button onPress={() => {
                  // setCar([]);
                  setFilter('SUV')
                  fetchSUV();
                  // onRefresh()
                  // onRefresh()
                }} status={filter == 'SUV' ? 'maroon' : 'white'} textStyle={{ color: filter == 'SUV' ? '#ffffff' : '#1a1919' }} size="sm" text="Papan Twin" />
              </View>
              <View style={{ flex: 0.33 }}>
                <Button onPress={() => {
                  setFilter('MPV')
                  fetchMPV();
                  // fetchCategory()
                  // onRefresh()
                }} status={filter == 'MPV' ? 'maroon' : 'white'} textStyle={{ color: filter == 'MPV' ? '#ffffff' : '#1a1919' }} size="sm" text="Papan Akrilik" />
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <View style={{ marginTop: 10, backgroundColor: 'white', borderRadius: 10, padding: 5, width: '100%', height: 130, display: 'flex', flexDirection: 'row' }}>
              <View style={{ backgroundColor: 'gray', flex: 0.45 }}>

              </View>
              <View style={{ backgroundColor: 'white', flex: 0.55 }}>
                <Text style={{ marginHorizontal: 15, marginVertical: 8 }}>Papan Bunga Rustik Warna Warni - Single</Text>
                <Text style={{ marginHorizontal: 15, marginVertical: 5 }}>Single Petak</Text>
                <Text style={{ marginHorizontal: 15, marginVertical: 5, fontWeight: 'bold' }}>Rp. 200.000</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* <Button
            text="Contact Us"
            status='dark100'
            onPress={() => Linking.openURL('https://wa.me/6282284924141')}
            rightContent={<Ionicons name="chatbubbles-outline" style={{ color: 'white' }} size={30} />}>Contact Us</Button> */}
      </ScrollView>
    </Layout>
  );
}
