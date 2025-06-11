import React, { useEffect } from 'react';
import { RefreshControl, TouchableOpacity, FlatList, ScrollView, View, StyleSheet, Image } from 'react-native';
import { Section, SectionContent, SectionImage, Layout, Text, TextInput, TopNav, useTheme, themeColor, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebase/Config';
import { collection, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';

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
	button: {
		margin: 3
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
	paid: {
		color: 'green',
		fontSize: 20,
		fontWeight: 'bold'
	},
	unpaid: {
		color: 'red',
		fontSize: 20,
		fontWeight: 'bold'
	}, 
	logo: {
        height: 60,
        width: 180
    },
});


export default function ({ navigation }) {
	const { isDarkmode, setTheme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);
	const [filter, setFilter] = React.useState('ALL');
	const [order, setOrder] = React.useState([]);
	const [search, setSearch] = React.useState('');
	const [car, setCar] = React.useState([]);

	const completeOrder = async (documentId, status) => {
		if (status == 'PAID') {
			try {
				const docRef = doc(FIRESTORE_DB, 'order', documentId);
				await updateDoc(docRef, {
					status: 'DONE',
				});
				alert('Order Complete');
				onRefresh();
			} catch (error) {
				alert('FAILED, ', error);
				console.log(error)
			}
		} else {
			alert('Booking Unpaid!')
		}
	};

	const deleteDocument = async (documentId) => {
		try {
			const docRef = doc(FIRESTORE_DB, 'order', documentId);
			await deleteDoc(docRef);
			alert('Cancel Order Success');
		} catch (error) {
			alert('Failed, ', error);
		}
	};

	const confirmPayment = async (documentId) => {
		try {
			const docRef = doc(FIRESTORE_DB, 'order', documentId);
			await updateDoc(docRef, {
				status: 'PAID',
			});
			alert('Confirm PAID');
			onRefresh();
		} catch (error) {
			alert('FAILED, ', error);
			console.log(error)
		}
	};

	const fetchDone = async () => {
		const ref = collection(FIRESTORE_DB, "order");
		const q = query(ref, where("status", "==", 'DONE'))
		const snap = await getDocs(q);
		const item = [];
		snap.forEach((doc) => {
			item.push({ id: doc.id, ...doc.data() });
		});
		setOrder(item);
	};
	const fetchPaid = async () => {
		const ref = collection(FIRESTORE_DB, "order");
		const q = query(ref, where("status", "==", 'PAID'))
		const snap = await getDocs(q);
		const item = [];
		snap.forEach((doc) => {
			item.push({ id: doc.id, ...doc.data() });
		});
		setOrder(item);
	};
	const fetchUnpaid = async () => {
		const ref = collection(FIRESTORE_DB, "order");
		const q = query(ref, where("status", "==", 'UNPAID'))
		const snap = await getDocs(q);
		const item = [];
		snap.forEach((doc) => {
			item.push({ id: doc.id, ...doc.data() });
		});
		setOrder(item);
	};

	const fetchPost = async () => {
		const ref = collection(FIRESTORE_DB, 'order');
		await getDocs(ref)
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() }));
				setOrder(newData);
			});
	};

	const searchData = async () => {
		const ref = collection(FIRESTORE_DB, "order");
		const q = query(ref, where("customer_name", ">=", search), where("customer_name", "<=", search + '\uf8ff'))
		const snap = await getDocs(q);
		const item = [];
		if (search.length > 0) {
			snap.forEach((doc) => {
				item.push({ id: doc.id, ...doc.data() });
				console.log(doc.id, " => ", doc.data());
			});
			setOrder(item);
		} else {
			fetchPost();
		}
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchPost();
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const renderCarItem = ({ item }) => (
		<View style={styles.card}>
			<Image style={{ width: '100%', aspectRatio: 1.5 }} source={{ uri: item.img }} />
			{/* <Text>{item.id}</Text> */}
			<View style={{ alignItems: 'center', margin: 10 }}>
				<Text style={styles.title}>{item.car_name}</Text>
				<Text>{item.brand}</Text>
			</View>
			<View style={styles.containerTxt}>
				<Text style={styles.txt}>{item.customer_name}</Text>
				<Text style={styles.txt}>{item.customer_nik}</Text>
				<Text style={styles.txt}>{item.driver_option ? 'Need Driver' : 'No Driver'}</Text>
				<Text style={styles.txt}>Order at: {new Date(item.created_at.seconds * 1000).toDateString()}</Text>
				<Text style={styles.txt}>Pickup date: {new Date(item.pickup_date.seconds * 1000).toDateString()}</Text>
				<Text style={styles.txt}>Dropoff date: {new Date(item.dropoff_date.seconds * 1000).toDateString()}</Text>
				<Text style={styles.txt}>Pickup address: {item.pickup_address}</Text>
			</View>
			<View style={styles.containerPrice}>
				<Text style={styles.price}>Rp.{item.price}</Text>
				<Text style={item.status == 'PAID' || item.status == 'DONE' ? styles.paid : styles.unpaid}>{item.status}</Text>
			</View>

			<View style={styles.containerBtn}>
				<Button
					status="dark100"
					text="Confirm Payment"
					disabled={item.status == 'PAID' || item.status == 'DONE' ? true : false}
					style={styles.btn}
					onPress={() => confirmPayment(item.id)}
				/>
				<Button
					status="danger"
					text="Cancel Order"
					disabled={item.status == 'PAID' || item.status == 'DONE' ? true : false}
					style={styles.btn}
					onPress={() => deleteDocument(item.id)}
				/>
			</View>
			<Button
				status="success"
				text="Complete"
				disabled={item.status == 'DONE' ? true : false}
				style={styles.btn}
				onPress={() => completeOrder(item.id, item.status)}
			/>

		</View>
	);

	useEffect(() => {
		fetchPost();
		searchData();
	}, [search]);

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
					data={order}
					renderItem={renderCarItem}
					initialNumToRender={5}
					maxToRenderPerBatch={5}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.id}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					ListHeaderComponent={
						<View style={{ padding: 15 }}>
							<TextInput
								placeholder="Search"
								value={search}
								onChangeText={(val) => setSearch(val)}
								rightContent={
									<Ionicons name="search-outline" size={25} color={'grey'} />
								}
							/>
							<View style={{ display: 'flex', flexDirection: 'row', marginTop: '2%' }}>
								<Button onPress={() => {
									setFilter('ALL')
									fetchPost()
								}} status={filter == 'ALL' ? 'danger' : 'dark100'} style={styles.button} size="sm" text="ALL" />
								<Button onPress={() => {
									setFilter('DONE')
									fetchDone();
								}} status={filter == 'DONE' ? 'danger' : 'dark100'} style={styles.button} size="sm" text="DONE" />
								<Button onPress={() => {
									setFilter('PAID')
									fetchPaid();
								}} status={filter == 'PAID' ? 'danger' : 'dark100'} style={styles.button} size="sm" text="PAID" />
								<Button onPress={() => {
									setFilter('UNPAID')
									fetchUnpaid();
								}} status={filter == 'UNPAID' ? 'danger' : 'dark100'} style={styles.button} size="sm" text="UNPAID" />
							</View>
						</View>

					}
				/>
			</View>

		</Layout>
	);
}
