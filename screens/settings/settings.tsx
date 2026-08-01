import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";

import { ScreenBackground } from "../../components";
import { useTheme } from "../../hooks";

const Settings: React.FC = () => {
	const { theme, themeName, toggleTheme } = useTheme();
	const isDarkTheme = themeName === "dark";

	return (
		<ScreenBackground>
			<View style={styles.container}>
				<Ionicons color={theme.PRIMARY} name="sunny" size={34} />
				<Switch
					onValueChange={toggleTheme}
					thumbColor={theme.PRIMARY}
					trackColor={{
						false: theme.GREY,
						true: theme.SECONDARY,
					}}
					value={isDarkTheme}
				/>
				<Ionicons color={theme.PRIMARY} name="moon" size={34} />
			</View>
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		gap: 18,
		justifyContent: "center",
	},
});

export { Settings };
