import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/provider/AuthProvider";
import { ThemeProvider } from "react-native-rapi-ui";
import { ImageBackground, View, Text, LogBox } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import Loading from "./src/screens/utils/Loading";


// const loadFonts = () => {
//   return Font.loadAsync({
//     'CustomFont': require('./assets/font/Lato-Regular.ttf'),
//   });
// };

export default function App(props) {
  // const [fontsLoaded, setFontsLoaded] = React.useState(false);

  const images = [
    require("./assets/icon.png"),
    require("./assets/splash.png"),
    require("./assets/login.png"),
    require("./assets/register.png"),
    require("./assets/forget.png"),
  ];

  // Ignore firebase v9 AsyncStorage warning
  React.useEffect(() => {
    // async function load() {
    //   await loadFonts();
    //   // setFontsLoaded(true);
    // }
    // load();
    const prepare = async () => {
      // Lakukan tugas asinkron di sini
      await new Promise(resolve => setTimeout(resolve, 10000)); // contoh: tunggu 2 detik

      // Sembunyikan splash screen setelah tugas selesai
      await SplashScreen.hideAsync();
    };
    prepare();
    LogBox.ignoreLogs([
      "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
      "Warning: Unknown: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead."
    ]);
  }, []);

  // if (!fontsLoaded) {
  //   return <Loading />;
  // }

  return (
    <ThemeProvider images={images}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
