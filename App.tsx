import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

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
		return null;
	}

	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<RootNavigator />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
