import React, { useState, useEffect } from 'react';
import { Image, Platform, TouchableOpacity, FlatList, StyleSheet, View, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { Picker, Layout, Text, TextInput, TopNav, useTheme, themeColor, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { addDoc, updateDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_APP } from '../../firebase/Config';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Clipboard from "expo-clipboard";
import { v4 as uuidv4 } from "uuid";
import BouncyCheckbox from "react-native-bouncy-checkbox";
// import * as ImagePicker from 'react-native-image-picker';
// import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
    containerBtn: {
        display: 'flex',
        padding: 2,
        flexDirection: 'row',
    },
    containerForm: {
        margin: 10,
        flexDirection: 'column',
    },
    btn: {
        margin: 10,
        marginTop: 20,
        flex: 1
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    box: {
        height: 100,
        width: 300,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: '#61dafb',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default function ({ navigation, route }) {
    const [carName, setCarName] = React.useState('');
    const [recomended, setRecomended] = React.useState(true);
    const [brand, setBrand] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [speed, setSpeed] = React.useState('');
    const [maxFuel, setMaxFuel] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [stock, setStock] = React.useState('');
    const [year, setYear] = React.useState();
    const [price, setPrice] = React.useState('');
    const [seats, setSeats] = React.useState('');
    const [transmision, setTransmision] = React.useState(null);
    const { isDarkmode, setTheme } = useTheme();
    const [image, setImage] = useState(null);
    const items = [
        { label: 'Manual', value: 'Manual' },
        { label: 'Automatic', value: 'Automatic' }
    ];
    const [isUpdate, setIsUpdate] = React.useState(false);
    const isDisabled = !carName || !brand || !transmision || !price || !seats || !image;   
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // route.params == null ? isUpdate = false : isUpdate = true;

    React.useEffect(() => {
        if (route.params?.image_url) {
            setImage(route.params.image_url);
            setCarName(route.params.car_name);
            setCategory(route.params.category)
            setBrand(route.params.brand);
            setYear(String(route.params.car_year));
            setSpeed(String(route.params.top_speed));
            setMaxFuel(String(route.params.max_fuel));
            setStock(String(route.params.stock));
            setDesc(route.params.description);
            setTransmision(route.params.transmision);
            setPrice(String(route.params.price));
            setSeats(String(route.params.seats));
            setIsUpdate(true);
        }
    }, [route.params?.image_url]);

    const carHandler = async () => {
        if (isUpdate) {
            try {
                const url = await uploadImageAsync(image);
                const docRef = doc(FIRESTORE_DB, 'car-list', route.params.id);
                const car = await updateDoc(docRef, {
                    car_name: carName,
                    category: category,
                    brand: brand,
                    car_year: parseInt(year),
                    top_speed: parseInt(speed),
                    max_fuel: parseInt(maxFuel),
                    transmision: transmision,
                    price: parseInt(price),
                    seats: parseInt(seats),
                    stock: parseInt(stock),
                    description: desc,
                    image_url: url,
                    insert_at: serverTimestamp(),
                    recomended: recomended
                });
                console.log(car);
            }
            catch (e) {
                console.log(e)
            }
            alert(
                'Update Success'
            );
            setImage(null);
            setCarName(null);
            setCategory(null);
            setBrand(null);
            setYear(null);
            setSpeed(null);
            setMaxFuel(null);
            setStock(null);
            setDesc(null);
            setTransmision(null);
            setPrice(null);
            setSeats(null);
            setRecomended(false);
            setIsUpdate(false);
        }
        else {
            try {
                const url = await uploadImageAsync(image);
                console.log(url);
                const car = await addDoc(collection(FIRESTORE_DB, 'car-list'), {
                    car_name: carName,
                    category: category,
                    brand: brand,
                    car_year: parseInt(year),
                    top_speed: parseInt(speed),
                    max_fuel: parseInt(maxFuel),
                    transmision: transmision,
                    price: parseInt(price),
                    seats: parseInt(seats),
                    stock: parseInt(stock),
                    description: desc,
                    image_url: url,
                    insert_at: serverTimestamp(),
                    recomended: recomended
                });
                console.log('id', car.id);
            }
            catch (e) {
                console.log('error', e);
            }
            alert(
                'Submit Success'
            );
            setImage(null);
            setCarName(null);
            setCategory(null);
            setBrand(null);
            setYear(null);
            setSpeed(null);
            setMaxFuel(null);
            setStock(null);
            setDesc(null);
            setTransmision(null);
            setPrice(null);
            setSeats(null);
            setRecomended(false);
        }
    }

    const updateCar = async () => {
        try {
            const url = await uploadImageAsync(image);
            const car = await updateDoc(collection(FIRESTORE_DB, 'car-list', route.params.id), {
                car_name: carName,
                category: category,
                brand: brand,
                car_year: parseInt(year),
                top_speed: parseInt(speed),
                max_fuel: parseInt(maxFuel),
                transmision: transmision,
                price: parseInt(price),
                seats: parseInt(seats),
                stock: parseInt(stock),
                description: desc,
                image_url: url,
                insert_at: serverTimestamp()
            });
            console.log(car);
        }
        catch (e) {
            console.log(e)
        }
        alert(
            'Update Success'
        );
    }

    const addCar = async () => {
        try {
            const url = await uploadImageAsync(image);
            console.log(url);
            const car = await addDoc(collection(FIRESTORE_DB, 'car-list'), {
                car_name: carName,
                category: category,
                brand: brand,
                car_year: parseInt(year),
                top_speed: parseInt(speed),
                max_fuel: parseInt(maxFuel),
                transmision: transmision,
                price: parseInt(price),
                seats: parseInt(seats),
                stock: parseInt(stock),
                description: desc,
                image_url: url,
                insert_at: serverTimestamp()
            });
            console.log('id', car.id);
        }
        catch (e) {
            console.log('error', e);
        }
        alert(
            'Submit Success'
        );
        setImage(null);
        setCarName(null);
        setCategory(null);
        setBrand(null);
        setYear(null);
        setSpeed(null);
        setMaxFuel(null);
        setStock(null);
        setDesc(null);
        setTransmision(null);
        setPrice(null);
        setSeats(null);
    }

    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const fileRef = ref(getStorage(), "car-image/" + uuidv4());
        const result = await uploadBytes(fileRef, blob);

        // We're done with the blob, close and release it
        blob.close();
        console.log(fileRef)
        const url = await getDownloadURL(fileRef);
        console.log(url);
        return url
    }
    return (
        <Layout>
            <TopNav
                middleContent={
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/logo.png')}
                    />
                }
                leftContent={
                    <Ionicons
                        name={isDarkmode ? "sunny" : "moon"}
                        size={20}
                        color={isDarkmode ? themeColor.white100 : themeColor.dark}
                    />
                }
                rightContent={
                    <Ionicons
                        name="log-out-outline"
                        size={25}
                        color={isDarkmode ? themeColor.white100 : themeColor.dark}
                    />
                }
                leftAction={() => {
                    if (isDarkmode) {
                        setTheme("light");
                    } else {
                        setTheme("dark");
                    }
                }}
                rightAction={() => {
                    signOut(FIREBASE_AUTH);
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.containerForm}>
                    <Text style={{ marginBottom: 10, marginTop: 10 }}> Car Name </Text>
                    <TextInput
                        placeholder="~"
                        value={carName}
                        onChangeText={(val) => setCarName(val)}
                    // leftContent={
                    //     <Ionicons name="lock-closed" size={20}/>
                    // }
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Category</Text>
                    <TextInput
                        placeholder="SUV/MPV/OTHER"
                        value={category}
                        onChangeText={(val) => setCategory(val)}
                    // rightContent={
                    //     <Ionicons name="mail" size={20} />
                    // }
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Brand</Text>
                    <TextInput
                        placeholder="~"
                        value={brand}
                        onChangeText={(val) => setBrand(val)}
                    // rightContent={
                    //     <Ionicons name="mail" size={20} />
                    // }
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Year</Text>
                    <TextInput
                        placeholder="2000"
                        value={year}
                        onChangeText={(val) => setYear(val)}
                        keyboardType='numeric'
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Top Speed</Text>
                    <TextInput
                        placeholder="100"
                        value={speed}
                        onChangeText={(val) => setSpeed(val)}
                        keyboardType='numeric'
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Max Fuel</Text>
                    <TextInput
                        placeholder="100"
                        value={maxFuel}
                        onChangeText={(val) => setMaxFuel(val)}
                        keyboardType='numeric'
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Transmision</Text>
                    <Picker
                        items={items}
                        value={transmision}
                        placeholder="Chose Transmision"
                        onValueChange={(val) => setTransmision(val)}
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Price</Text>
                    <TextInput
                        placeholder="Rp.0"
                        value={price}
                        onChangeText={(val) => setPrice(val)}
                        keyboardType='numeric'
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Seats</Text>
                    <TextInput
                        placeholder="0"
                        value={seats}
                        onChangeText={(val) => val <= 7 ? setSeats(val) : alert('seat cannot more than 7')}
                        keyboardType='numeric'
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Stock</Text>
                    <TextInput
                        placeholder="0"
                        value={stock}
                        onChangeText={(val) => val < 0 ? alert('stock cannot less than 0') : setStock(val)}
                        keyboardType='numeric'
                    />
                    <BouncyCheckbox
                        size={25}
                        style={{ marginLeft: 10, marginBottom: 10, marginTop: 20 }}
                        fillColor="green"
                        unFillColor="#FFFFFF"
                        text="Recommended"
                        textStyle={{ textDecorationLine: "none" }}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 2 }}
                        isChecked
                        onPress={(isChecked) => { setRecomended(isChecked) }}
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}> Description</Text>
                    <TextInput
                        multiline
                        placeholder="Description"
                        numberOfLines={4}
                        value={desc}
                        onChangeText={(val) => setDesc(val)}
                    />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Button status="gray"
                            text="Upload Image"
                            onPress={pickImage}
                            style={styles.btn} />
                        {image && <Image source={{ uri: image }} style={{ width: 300, height: 200, margin: 15 }} />}
                    </View>
                    <Button
                        status="dark100"
                        text="Submit"
                        onPress={carHandler}
                        style={styles.btn}
                        disabled={isDisabled}
                    />
                </View>
            </ScrollView>
        </Layout>
    );
}