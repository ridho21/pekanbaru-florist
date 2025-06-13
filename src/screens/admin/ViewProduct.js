import React, { useEffect } from 'react';
import { RefreshControl, TouchableOpacity, FlatList, ScrollView, View, StyleSheet, Image } from 'react-native';
import { Section, SectionContent, SectionImage, Layout, Text, TextInput, TopNav, useTheme, themeColor, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebase/Config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		// alignItems: 'center',
		justifyContent: 'center',
	},
	containerBtn: {
		display: 'flex',
		padding: 2,
		flexDirection: 'row',
	},
	containerTxt: {
		display: 'flex',
		padding: 2,
		flexDirection: 'column',
		alignItems: 'left',
	},
	containerPrice: {
		alignItems: 'center',
		padding: 2,
		// marginLeft: '70%'
	},
	card: {
		flex: 0,
		padding: 16,
		marginVertical: 8,
		marginHorizontal: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
	},
	btn: {
		marginTop: 10,
		margin: 2,
		flex: 1
	},
	txt: {
		// backgroundColor: 'green',
		margin: 2,
		flex: 1
	},
	title: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	price: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	logo: {
        height: 60,
        width: 180
    },
});


export default function ({ navigation }) {
	const { isDarkmode, setTheme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);
	// const docRef = doc(FIRESTORE_DB, "car-rental", "03vH6Kc69575t3iaYmMQ");
	// const docSnap = getDoc(docRef);
	const [car, setCar] = React.useState([]);
	// const [data, setData] = React.useState([]);

	const deleteDocument = async (documentId) => {
		try {
			const docRef = doc(FIRESTORE_DB, 'car-list', documentId);
			await deleteDoc(docRef);
			alert('Dokumen berhasil dihapus');
		} catch (error) {
			alert('Gagal menghapus dokumen:', error);
		}
	};

	const fetchPost = async () => {
		await getDocs(collection(FIRESTORE_DB, "car-list"))
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() }));
				setCar(newData);
				// console.log(newData);
			});
	}
	useEffect(() => {
		fetchPost();
		console.log(car);
	}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchPost();
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const renderCarItem = ({ item }) => (
		<View style={styles.card}>
			<Image style={{ width: '100%', aspectRatio: 1.5 }} source={{ uri: item.image_url }} />
			{/* <Text>{item.id}</Text> */}
			<View style={{ alignItems: 'center', margin: 10 }}>
				<Text style={styles.title}>{item.car_name}</Text>
				<Text>{item.brand}</Text>
			</View>
			<View style={styles.containerTxt}>
				<Text style={styles.txt}>Transmisi: {item.transmision}</Text>
				<Text style={styles.txt}>Jumlah Bangku: {item.seats}</Text>
			</View>
			<View style={styles.containerPrice}>
				<Text style={styles.price}>Rp.{item.price}/hari</Text>
			</View>

			<View style={styles.containerBtn}>
				<Button
					status="dark100"
					text="Update"
					style={styles.btn}
					onPress={() => {
						item.isUpdate = true;
						navigation.navigate("AddProduct", item)
					}}
				/>
				<Button
					status="danger"
					text="Delete"
					style={styles.btn}
					onPress={() => deleteDocument(item.id)}
				/>
			</View>

		</View>
	);
	return (
		<Layout>
			<TopNav
				backgroundColor={themeColor.maroon}
				borderColor='#FFFFFF'
				middleContent={
					<Image
						style={styles.logo}
						source={require('../../../assets/logo-horizontal.png')}
					/>
				}
				leftContent={
					<Ionicons
						// name={isDarkmode ? "sunny" : "moon"}
						name='person-circle-outline'
						size={28}
						color={isDarkmode ? themeColor.white100 : themeColor.white100}
					/>
				}
				rightContent={
					<Ionicons
						name="log-out-outline"
						size={25}
						color={isDarkmode ? themeColor.white100 : themeColor.white100}
					/>
				}
				// leftAction={() => {
				//     if (isDarkmode) {
				//         setTheme("light");
				//     } else {
				//         setTheme("dark");
				//     }
				// }}
				rightAction={() => {
					signOut(FIREBASE_AUTH);
				}}
			/>


			<View style={styles.container}>
				<FlatList
					data={car}
					renderItem={renderCarItem}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
			</View>

		</Layout>
	);
}
