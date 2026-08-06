import "react-native-gesture-handler";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { RootNavigator } from "./navigation";
import { ThemeProvider } from "./contexts";
import { useStoreReady } from "./store";

export default function App() {
	const [fontsLoaded] = useFonts({
		"LobsterTwo-Italic": require("./assets/fonts/LobsterTwo-Italic.otf"),
		"LobsterTwo-Regular": require("./assets/fonts/LobsterTwo-Regular.otf"),
	});
	const isStoreReady = useStoreReady();

	if (!fontsLoaded || !isStoreReady) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<SafeAreaProvider>
				<ThemeProvider>
					<RootNavigator />
				</ThemeProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loader: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});
