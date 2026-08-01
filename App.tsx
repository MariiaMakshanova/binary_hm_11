import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import { RootNavigator } from "./navigation";
import { ThemeProvider } from "./contexts";

export default function App() {
	const [fontsLoaded] = useFonts({
		"LobsterTwo-Italic": require("./assets/fonts/LobsterTwo-Italic.otf"),
		"LobsterTwo-Regular": require("./assets/fonts/LobsterTwo-Regular.otf"),
	});

	if (!fontsLoaded) {
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
