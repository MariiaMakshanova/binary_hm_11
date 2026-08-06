import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { InspirationCard, ScreenBackground } from "../../components";
import { ROUTE_NAME } from "../../enums";
import { useTheme } from "../../hooks";
import { useAppSelector } from "../../store";
import type { BottomTabsScreenProps } from "../../types";

const Dashboard: React.FC<
	BottomTabsScreenProps<typeof ROUTE_NAME.DASHBOARD>
> = () => {
	const { theme } = useTheme();
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const inspirations = useAppSelector(
		(state) => state.inspirations.inspirations,
	);
	const sortedInspirations = useMemo(
		() =>
			[...inspirations].sort((firstInspiration, secondInspiration) => {
				const firstDate = new Date(firstInspiration.created_at).getTime();
				const secondDate = new Date(secondInspiration.created_at).getTime();

				return sortDirection === "asc"
					? firstDate - secondDate
					: secondDate - firstDate;
			}),
		[inspirations, sortDirection],
	);
	const isSortingAvailable = inspirations.length > 1;
	const sortLabel =
		sortDirection === "asc" ? "Oldest first" : "Newest first";

	const handleSortPress = () => {
		setSortDirection((currentDirection) =>
			currentDirection === "asc" ? "desc" : "asc",
		);
	};

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
					data={sortedInspirations}
					keyExtractor={(item) => item.id}
					ListHeaderComponent={
						isSortingAvailable ? (
							<Pressable
								accessibilityLabel={`Sort inspirations by date. ${sortLabel}`}
								accessibilityRole="button"
								onPress={handleSortPress}
								style={[
									styles.sortButton,
									{ borderColor: theme.PRIMARY },
								]}
							>
								<Text style={[styles.sortText, { color: theme.PRIMARY }]}>
									{sortLabel}
								</Text>
								<Ionicons
									color={theme.PRIMARY}
									name={
										sortDirection === "asc"
											? "arrow-up-circle"
											: "arrow-down-circle"
									}
									size={26}
								/>
							</Pressable>
						) : null
					}
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
	sortButton: {
		alignItems: "center",
		alignSelf: "flex-end",
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		gap: 8,
		justifyContent: "center",
		marginBottom: 16,
		minHeight: 44,
		paddingHorizontal: 14,
		paddingVertical: 8,
	},
	sortText: {
		fontFamily: "LobsterTwo-Regular",
		fontSize: 22,
	},
});

export { Dashboard };
