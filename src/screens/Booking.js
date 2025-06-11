import React, { useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import {
    Layout,
    TopNav,
    Text,
    themeColor,
    Button,
    useTheme,
    TextInput
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from '../firebase/Config';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { collection, addDoc, updateDoc, getDoc, getDocs, where, doc } from 'firebase/firestore';
import { addSyntheticLeadingComment } from "typescript";

const styles = StyleSheet.create({
    logo: {
        width: 120,
        height: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        margin:20
    },
})


export default function ({ navigation, route }) {
    const { isDarkmode, setTheme } = useTheme();
    const car = route.params;
    const auth = getAuth();
    const [date, setDate] = React.useState(new Date());
    const [pick, setPick] = React.useState(new Date());
    const [drop, setDrop] = React.useState(new Date());
    const [name, setName] = React.useState('');
    const [nik, setNik] = React.useState('');
    const [driver, setDriver] = React.useState(true);
    const [address, setAddress] = React.useState('');
    const [isDisable, setIsDisable] = React.useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = React.useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = React.useState(false);

    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };

    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };

    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirmPick = (date) => {
        // setDate(date);
        hideDatePicker1();
        setPick(date);
    };

    const handleConfirmDrop = (date) => {
        // setDate(date);
        hideDatePicker2();
        setDrop(date);
    };

    const transactionHandler = async () => {
        if (car.stock <= 0) {
            alert("Stock 0")
        }
        else if (pick.getDate() - drop.getDate() >= 0) {
            alert("Date not valid")
        } else {
            const transaction = await addDoc(collection(FIRESTORE_DB, 'order'), {
                car_id: car.id,
                user_id: auth.currentUser.uid,
                price: car.price * Math.abs((pick.getDate() - drop.getDate())),
                img: car.image_url,
                created_at: new Date(),
                driver_option: driver,
                pickup_date: pick,
                dropoff_date: drop,
                customer_name: name,
                customer_nik: nik,
                pickup_address: address,
                status: 'UNPAID'
            });

            const docRef = doc(FIRESTORE_DB, 'car-list', car.id);
            const updateStock = await updateDoc(docRef, {
                stock: car.stock - 1
            });
            car.stock = car.stock - 1;
            setIsDisable(true);
            console.log(car.stock)

            alert('Booking Success')
            navigation.navigate("Orders")
        }
    };

    console.log(pick.getDate())
    console.log(drop.getDate())
    console.log(pick.getDate() - drop.getDate())
    console.log(isDatePickerVisible1)

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
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={isDarkmode ? themeColor.white100 : themeColor.dark}
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image style={{ width: '100%', aspectRatio:1.5 }} source={{ uri: car.image_url }} />
                <View style={styles.container}>
                    <Text style={styles.text}>Pick up date</Text>
                    <TextInput
                        placeholder="Pickup Date"
                        value={pick.toDateString()}
                        editable={false}
                        rightContent={
                            <Ionicons name="calendar-outline" size={20} onPress={showDatePicker1} />
                        }
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible1}
                        mode="date"
                        onConfirm={handleConfirmPick}
                        onCancel={hideDatePicker1}
                    />
                    <Text style={styles.text}>Drop off date</Text>
                    <TextInput
                        placeholder="Drop Date"
                        value={drop.toDateString()}
                        editable={false}
                        rightContent={
                            <Ionicons name="calendar-outline" size={20} onPress={showDatePicker2} />
                        }
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible2}
                        mode="date"
                        onConfirm={handleConfirmDrop}
                        onCancel={hideDatePicker2}
                    />

                    <BouncyCheckbox
                        size={25}
                        style={{ marginLeft: 10, marginBottom: 10, marginTop: 20 }}
                        fillColor="green"
                        unFillColor="#FFFFFF"
                        text="Driver"
                        textStyle={{ textDecorationLine: "none" }}
                        iconStyle={{ borderColor: "red" }}
                        innerIconStyle={{ borderWidth: 2 }}
                        isChecked
                        onPress={(isChecked) => { setDriver(isChecked) }}
                    />

                    <Text style={{ marginBottom: 10, marginTop: 20 }}>Name</Text>
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}>NIK</Text>
                    <TextInput
                        placeholder="NIK"
                        value={nik}
                        onChangeText={(val) => setNik(val)}
                    />
                    <Text style={{ marginBottom: 10, marginTop: 20 }}>Pickup Address</Text>
                    <TextInput
                        placeholder="Pickup Address"
                        value={address}
                        onChangeText={(val) => setAddress(val)}
                    />
                    <Button text="Confirm" status='dark100' disabled={isDisable} onPress={transactionHandler} style={{ marginTop: 30 }}></Button>
                </View>
                {/* This text using ubuntu font */}
                {/* <Image style={{ width: '100%', height: 280 }} source={{ uri: car.image_url }} />
                <Text fontWeight="bold" style={{ fontSize: 25, marginTop: 20 }}>{car.stock > 0 ? "Tersedia" : "Tidak Tersedia"}</Text>
                <View style={{ alignItems: 'center', backgroundColor: 'black', width: '100%', height: '50%', borderTopEndRadius: 20, borderTopStartRadius: 20, marginTop: 60 }}>
                    <Text fontWeight="bold" style={{ alignItems: 'center', color: 'white' }}>{car.brand}</Text>
                    <Text fontWeight="bold" style={{ alignItems: 'center', color: 'white' }}>{car.description}</Text>
                </View>
                <View style={{ alignItems: 'center', position: 'absolute', top: 600, backgroundColor: 'grey', width: '100%', height: '20%', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
                    <Text style={{ color: 'white', marginTop: '5%' }}>{car.price}</Text>
                    <Button
                        style={{ alignItems: 'center', marginTop: '10%' }}
                        status="primary"
                        text="Booking Now" />
                </View> */}
            </ScrollView>
        </Layout>
    );
}
