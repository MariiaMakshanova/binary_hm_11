import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import { InspirationCard, ScreenBackground } from "../../components";
import { ROUTE_NAME } from "../../enums";
import { useTheme } from "../../hooks";
import { useAppSelector } from "../../store";
import type { BottomTabsScreenProps } from "../../types";

const Dashboard: React.FC<
	BottomTabsScreenProps<typeof ROUTE_NAME.DASHBOARD>
> = () => {
	const { theme } = useTheme();
	const inspirations = useAppSelector(
		(state) => state.inspirations.inspirations,
	);

	return (
		<ScreenBackground>
			{inspirations.length === 0 ? (
				<View style={styles.placeholder}>
					<Image
						resizeMode="contain"
						source={require("../../assets/empty-placeholder.png")}
						style={styles.placeholderImage}
					/>
					<Text style={[styles.placeholderText, { color: theme.PRIMARY }]}>
						No inspirations yet
					</Text>
				</View>
			) : (
				<FlatList
					contentContainerStyle={styles.list}
					data={inspirations}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.cardWrapper}>
							<InspirationCard imageUrl={item.image_url} quote={item.quote} />
						</View>
					)}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	cardWrapper: {
		marginBottom: 22,
	},
	list: {
		paddingBottom: 24,
	},
	placeholder: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	placeholderImage: {
		height: 220,
		width: 220,
	},
	placeholderText: {
		fontFamily: "LobsterTwo-Italic",
		fontSize: 34,
		marginTop: 18,
		textAlign: "center",
	},
});

export { Dashboard };
