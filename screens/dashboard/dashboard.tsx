import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import { InspirationCard, ScreenBackground } from "../../components";
import { ROUTE_NAME } from "../../enums";
import { useTheme } from "../../hooks";
import type { BottomTabsScreenProps, Inspiration } from "../../types";

const Dashboard: React.FC<
	BottomTabsScreenProps<typeof ROUTE_NAME.DASHBOARD>
> = ({ navigation, route }) => {
	const { theme } = useTheme();
	const [inspirations, setInspirations] = useState<Inspiration[]>([]);

	useEffect(() => {
		const createdInspiration = route.params?.inspiration;

		if (!createdInspiration) {
			return;
		}

		setInspirations((currentInspirations) => [
			createdInspiration,
			...currentInspirations,
		]);
		navigation.setParams({ inspiration: undefined });
	}, [navigation, route.params?.inspiration]);

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
					keyExtractor={(_, index) => `inspiration-${index}`}
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
