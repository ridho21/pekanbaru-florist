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
        height: 60,
        width: 180
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 14,
        margin: 8,
        alignSelf: 'flex-start'
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 10 }}>
                    <Image style={{ width: '100%', aspectRatio: 1.5 }} source={{ uri: car.image_url }} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.text}>Jenis Acara</Text>
                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={styles.text}>Kalimat Tujuan</Text>
                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={styles.text}>Pengirim</Text>
                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={styles.text}>Tanggal Acara</Text>
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
                    <Text style={styles.text}>Nomor Telepon</Text>
                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={styles.text}>Catatan</Text>
                    <TextInput
                        placeholder=""
                        value={name}
                        onChangeText={(val) => setName(val)}
                    />
                    <Text style={styles.text}>Lokasi Acara</Text>
                    <View style={{ alignItems: 'center', width: '100%'}}>
                        <View style={{ flexDirection: 'row' }}>
                            <Button text="Keranjang" status='dark100' disabled={isDisable} onPress={transactionHandler} style={{ marginHorizontal: 10, flex: 0.5 }}></Button>
                            <Button text="Pesan Sekarang" status='dark100' disabled={isDisable} onPress={transactionHandler} style={{ marginHorizontal: 10, flex: 0.5 }}></Button>
                        </View>
                    </View>

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
