import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { useTheme } from "../hooks";
import type { ReactNode } from "react";

type ScreenBackgroundProps = {
	children: ReactNode;
};

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => {
	const { theme } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: theme.APP_BACKGROUND }]}>
			<Image source={require("../assets/leaf.png")} style={styles.topLeaf} />
			<Image source={require("../assets/leaf.png")} style={styles.bottomLeaf} />
			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: "hidden",
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingVertical: 20,
	},
	topLeaf: {
		height: 170,
		opacity: 0.45,
		position: "absolute",
		right: -54,
		top: -44,
		transform: [{ rotate: "205deg" }],
		width: 170,
	},
	bottomLeaf: {
		bottom: -56,
		height: 190,
		left: -68,
		opacity: 0.45,
		position: "absolute",
		transform: [{ rotate: "26deg" }],
		width: 190,
	},
});

export { ScreenBackground };
