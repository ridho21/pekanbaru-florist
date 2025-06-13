import React, { useEffect } from 'react';
import { Linking, View, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity, Modal } from 'react-native';
import { Layout, Text, Button, TopNav, themeColor } from 'react-native-rapi-ui';
import { FIRESTORE_DB } from '../firebase/Config';
import { signOut, updateProfile, updatePhoneNumber, getAuth, updateEmail } from "firebase/auth";
import { collection, getDocs, getDoc, deleteDoc, doc, where, query, updateDoc } from 'firebase/firestore';

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
		flexDirection: 'row',
		textAlign: 'center',
		// backgroundColor:'yellow',
		// borderColor:'black',
		// borderWidth:1,
		// borderStyle: 'dashed'
	},
	containerPrice: {
		alignItems: 'center',
		padding: 2,
		marginTop: '5%'
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
		textAlign: 'center',
		margin: 3,
		flex: 1,
		fontStyle: 'italic'
	},
	titlePaid: {
		fontSize: 25,
		fontWeight: 'bold',
		color: 'green'
	},
	titleUnpaid: {
		fontSize: 25,
		fontWeight: 'bold',
		color: 'red'
	},
	price: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		margin: 20,
		borderRadius: 8,
		alignItems: 'center',
	},
	logo: {
		height: 60,
		width: 180
	}
})

export default function ({ navigation }) {
	const [order, setOrder] = React.useState([]);
	const [filter, setFilter] = React.useState('ALL');
	const [car, setCar] = React.useState([]);
	const [detail, setDetail] = React.useState([]);
	const [modalVisible, setModalVisible] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);
	const auth = getAuth();

	const fetchPost = async () => {
		const ref = collection(FIRESTORE_DB, 'order');
		const q = query(ref, where('user_id', '==', auth.currentUser.uid))
		// const querySnapshot = await getDocs(q)
		await getDocs(q)
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() }));
				setOrder(newData);
			});
	};


	const handleItemPress = (item) => {
		setDetail(item);
		setModalVisible(true);
	};

	const cancelBooking = async (orderId, carId) => {
		try {
			const docRef = doc(FIRESTORE_DB, 'order', orderId);
			await deleteDoc(docRef);

			const docRefCar = doc(FIRESTORE_DB, 'car-list', carId);

			const carStock = await getDoc(docRefCar);
			const updateStock = await updateDoc(docRefCar, {
				stock: carStock.data().stock + 1
			});

			setModalVisible(false);
			alert("Cancel Success")
			onRefresh();
		} catch (err) {
			alert(err.message);
		}
	}

	const closeModal = () => {
		setModalVisible(false);
	};

	useEffect(() => {
		fetchPost();
		console.log(detail);
	}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchPost();
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const renderCarItem = ({ item }) => (
		<TouchableOpacity>
			<View style={styles.card}>
				<Image style={{ width: '100%', aspectRatio: 1.5 }} source={{ uri: item.img }} />
				{/* <Text>{item.id}</Text> */}
				<View style={{ alignItems: 'center', margin: 5 }}>
					<Text style={item.status == 'UNPAID' ? styles.titleUnpaid : styles.titlePaid}>{item.status}</Text>
				</View>
				<View style={styles.containerTxt}>
					<Text style={{
						textAlign: 'center',
						flex: 1,
						fontSize: 20,
						fontWeight: 'bold'
					}}>Start</Text>
					<Text style={{
						textAlign: 'center',
						flex: 1,
						fontSize: 20,
						fontWeight: 'bold'
					}}>End</Text>
				</View>
				<View style={styles.containerTxt}>
					<Text style={styles.txt}>{new Date(item.pickup_date.seconds * 1000).toDateString()}</Text>
					<Text style={styles.txt}>{new Date(item.dropoff_date.seconds * 1000).toDateString()}</Text>
				</View>
				<View style={styles.containerPrice}>
					<Text style={styles.price}>Total bill: Rp.{item.price}</Text>
				</View>
				<View style={styles.containerBtn}>
					<Button
						status="dark100"
						text="Contact Admin"
						style={styles.btn}
						onPress={() => Linking.openURL('https://wa.me/6282284924141')}
					/>
					<Button
						status="danger"
						text="Cancel"
						disabled={item.status == 'PAID' || item.status == 'DONE' ? true : false}
						style={styles.btn}
						onPress={() => handleItemPress(item)}
					/>
				</View>
				{/* <View style={styles.containerBtn}>
				<Button
					status="primary"
					text="Update"
					style={styles.btn}
				/>
				<Button
					status="danger"
					text="Delete"
					style={styles.btn}
					onPress={() => deleteDocument(item.id)}
				/>
			</View> */}
			</View>
		</TouchableOpacity>

	);
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
			{/* <View style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> */}
			{order.length > 0 ? '' : <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>Data Not Found</Text>}
			<View style={{ alignItems: 'center' }}>
				<View style={{ display: 'flex', flexDirection: 'row', marginVertical: 13, marginHorizontal: 12, alignContent: 'center', borderRadius: 10, borderColor: '#dddddd', borderWidth: 1, padding: 3 }}>
					<View style={{ flex: 0.33 }}>
						<Button onPress={() => {
							setFilter('ALL')
							fetchPost()
						}} status={filter == 'ALL' ? 'maroon' : 'white'} textStyle={{ color: filter == 'ALL' ? '#ffffff' : '#1a1919' }} size="sm" text="Keranjang" />
					</View>
					<View style={{ flex: 0.33 }}>
						<Button onPress={() => {
							// setCar([]);
							setFilter('SUV')
							fetchSUV();
							// onRefresh()
							// onRefresh()
						}} status={filter == 'SUV' ? 'maroon' : 'white'} textStyle={{ color: filter == 'SUV' ? '#ffffff' : '#1a1919' }} size="sm" text="Selesai" />
					</View>
				</View>
			</View>
			<TouchableOpacity style={{ padding: 7 }}>
				<View style={{ backgroundColor: 'white', padding: 3, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderColor: '#dddddd', borderWidth: 1, width: '100%', height: 130, display: 'flex', flexDirection: 'row' }}>
					<View style={{ backgroundColor: 'gray', flex: 0.45 }}>

					</View>
					<View style={{ backgroundColor: 'white', flex: 0.55 }}>
						<Text style={{ marginHorizontal: 15, marginVertical: 8 }}>Papan Bunga Rustik Warna Warni - Single</Text>
						<Text style={{ marginHorizontal: 15, marginVertical: 8 }}>Single Petak</Text>
						<Text style={{ marginHorizontal: 15, marginVertical: 8, fontWeight: 'bold' }}>Rp. 200.000</Text>
					</View>
				</View>
				<View style={{ alignItems: 'flex-end', backgroundColor: '#85d166', padding: 3, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
					<Text style={{ fontSize: 14, color: 'white', marginHorizontal: 10 }}>Selesai</Text>
				</View>
			</TouchableOpacity>
			{/* <FlatList
				data={order}
				renderItem={renderCarItem}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/> */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={closeModal}
			><View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={{ fontSize: 30, margin: 30, padding: 20 }}>Are you sure?</Text>
						<View style={styles.containerBtn}>
							<Button
								status="success"
								text="Confirm"
								style={styles.btn}
								onPress={() => cancelBooking(detail.id, detail.car_id)}
							/>
							<Button
								status="danger"
								text="Close"
								style={styles.btn}
								onPress={closeModal}
							/>
						</View>
					</View>
				</View>
			</Modal>
			{/* </View> */}
		</Layout>
	);
}
