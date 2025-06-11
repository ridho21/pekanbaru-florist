import React, { useState, useEffect } from 'react';
import { Image, Platform, TouchableOpacity, FlatList, StyleSheet, View, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { Picker, Section, SectionContent, Layout, Text, TextInput, TopNav, useTheme, themeColor, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { signOut, updateProfile, updatePhoneNumber, getAuth, updateEmail } from "firebase/auth";
import { addDoc, doc, query, where, updateDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_APP } from '../firebase/Config';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Clipboard from "expo-clipboard";
import { v4 as uuidv4 } from "uuid";

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
		alignItems: 'center',
		marginStart:'15%',
		marginEnd:'15%',
		marginTop: '10%',
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

export default function ({ navigation }) {
	const { isDarkmode, setTheme } = useTheme();
	const [user, setUser] = React.useState([]);
	const [editable, setEditable] = React.useState(true);
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const [address, setAddress] = React.useState('');
	const [image, setImage] = useState(null);
	const auth = getAuth();

	const isDisabled = !name || !email || !phone;

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

	const editHandler = async (edit) => {
		if (edit) {
			setEditable(false);
			alert('Edit disable')
		} else {
			setEditable(true);
			alert('Edit enable')
		}
	}

	const profile = () => {
		if (auth.currentUser.photoURL != null) {
			setImage(auth.currentUser.photoURL);
		} else {
			setImage('https://firebasestorage.googleapis.com/v0/b/car-rental-39b9e.appspot.com/o/profile%2Fprofile.jpg?alt=media&token=f232194d-53db-4405-8f03-4b5ecc4e5c9f');
		}
	};

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

		const fileRef = ref(getStorage(), "profile/" + uuidv4());
		const result = await uploadBytes(fileRef, blob);

		// We're done with the blob, close and release it
		blob.close();
		console.log(fileRef)
		const url = await getDownloadURL(fileRef);
		console.log(url);
		return url
	}

	const updProfile = async () => {
		const url = await uploadImageAsync(image);
		try {
			updateProfile(auth.currentUser, {
				displayName: name,
				photoURL: url
			});

			const docRef = doc(FIRESTORE_DB, 'user', user[0].id);
			const usr = updateDoc(docRef, {
				address: address,
				phone: phone
			});
			// updatePhoneNumber(auth.currentUser, {PhoneAuth: phone});
			updateEmail(auth.currentUser, email);
			alert('Profile updated');
		} catch (error) {
			alert('error', console.error(error));
		}
	}

	const loadProfile = async () => {
		const ref = collection(FIRESTORE_DB, 'user');
		const qu = query(ref, where('user_id', '==', auth.currentUser.uid));
		const u = await getDocs(qu);
		u.forEach((doc) => {
			user.push({ id: doc.id, ...doc.data() });
		}); 
		setPhone(user[0].phone);
		setAddress(user[0].address);

		setName(auth.currentUser.displayName);
		setEmail(auth.currentUser.email);
	}


	useEffect(() => {
		loadProfile();
		profile();
	}, []);
	return (
		<Layout>
			<ScrollView>
				<TopNav
					middleContent=""
					leftContent={
						<Ionicons
							name="chevron-back"
							size={20}
							color={isDarkmode ? themeColor.white100 : themeColor.dark}
						/>
					}
					leftAction={() => navigation.goBack()}
					rightContent={
						<Ionicons
							name="log-out-outline"
							size={25}
							color={isDarkmode ? themeColor.danger500 : themeColor.dark}
						/>
					}
					rightAction={() => {
						signOut(FIREBASE_AUTH);
					}}
					backgroundColor="transparent"
					borderColor="transparent"
				/>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					{image && <Image source={{ uri: image }} style={{ width: 180, height: 180, margin: 15, borderRadius: 100 }} />}
					<Button status="gray"
						text="upload"
						size='sm'
						onPress={pickImage}
						style={{ margin: 10 }}
						rightContent={
							<Ionicons name="cloud-upload-outline" size={20} color={'white'} />
						}
						/>
				</View>
				<View style={styles.containerForm}>
					<TextInput
						placeholder="Name"
						// backgroundColor={'transparent'}
						// borderColor={'transparent'}
						// borderWidth={1}
						value={name}
						onChangeText={(val) => setName(val)}
						editable={editable}
						leftContent={<Ionicons name="person-outline" size={20} color={isDarkmode ? themeColor.white : themeColor.dark} />}
					// rightContent={
					// 	<Ionicons name="pencil" size={23} onPress={() => { editable == false ? setEditable(true) : setEditable(false) }} />
					// }
					/>

					<Text></Text>
					<TextInput
						placeholder="E-mail"
						value={email}
						onChangeText={(val) => setEmail(val)}
						editable={false}
						// editable={false}
						leftContent={<Ionicons name="mail-outline" size={20} color={isDarkmode ? themeColor.white : themeColor.dark} />}
					/>
					<Text></Text>
					<TextInput
						placeholder="Phone Number"
						value={phone}
						onChangeText={(val) => setPhone(val)}
						keyboardType='numeric'
						editable={editable}
						leftContent={<Ionicons name="call-outline" size={20} color={isDarkmode ? themeColor.white : themeColor.dark} />}
					/>
					<Text></Text>
					<TextInput
						placeholder="Address"
						value={address}
						onChangeText={(val) => setAddress(val)}
						editable={editable}
						leftContent={<Ionicons name="compass-outline" size={20} color={isDarkmode ? themeColor.white : themeColor.dark} />}
					/>
					{/* <Button status="gray"
						text="Edit"
						size='sm'
						// disabled={editable}
						rightContent={
							<Ionicons style={{ color: 'white' }} name="create-outline" size={15} />
						}
						onPress={() => editHandler(editable)}
						style={{ marginLeft: '75%', margin: 10 }} /> */}
					<Button
						status="dark100"
						text="UPDATE"
						onPress={() => updProfile()}
						style={styles.btn}
						disabled={isDisabled}
					/>
				</View>
			</ScrollView>
		</Layout>
	);
}
