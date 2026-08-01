import React from "react";
import {
	ImageBackground,
	StyleSheet,
	Text,
	View,
	type ImageSourcePropType,
} from "react-native";

import { useTheme } from "../hooks";

type InspirationCardProps = {
	imageUrl?: string;
	quote?: string;
	placeholderSource?: ImageSourcePropType;
};

const DEFAULT_SOURCE = require("../assets/default-inspiration.jpg");

const InspirationCard: React.FC<InspirationCardProps> = ({
	imageUrl,
	quote,
	placeholderSource = DEFAULT_SOURCE,
}) => {
	const { theme } = useTheme();
	const source: ImageSourcePropType = imageUrl
		? { uri: imageUrl }
		: placeholderSource;

	return (
		<ImageBackground source={source} resizeMode="cover" style={styles.card}>
			<View
				style={[
					styles.overlay,
					{ backgroundColor: `${theme.APP_BACKGROUND}4D` },
				]}
			>
				{Boolean(quote) && (
					<View style={styles.quoteContainer}>
						<Text style={[styles.quote, { color: theme.FONT_INVERSE }]}>
							{quote}
						</Text>
					</View>
				)}
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	card: {
		aspectRatio: 0.78,
		borderRadius: 24,
		overflow: "hidden",
		width: "100%",
	},
	overlay: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	quote: {
		fontFamily: "LobsterTwo-Regular",
		fontSize: 28,
		lineHeight: 36,
		textAlign: "center",
	},
	quoteContainer: {
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.38)",
		justifyContent: "center",
		minHeight: "50%",
		padding: 18,
		width: "100%",
	},
});

export { InspirationCard };
