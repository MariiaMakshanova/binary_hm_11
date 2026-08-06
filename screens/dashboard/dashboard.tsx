import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { ScreenBackground } from "../../components";
import { SwipeableCardProvider } from "../../contexts";
import { ROUTE_NAME } from "../../enums";
import { useTheme } from "../../hooks";
import { removeInspiration, useAppDispatch, useAppSelector } from "../../store";
import { SwipeableInspirationCard } from "./components";
import type {
	BottomTabsScreenProps,
	Inspiration,
	RootStackParamList,
} from "../../types";

const Dashboard: React.FC<
	BottomTabsScreenProps<typeof ROUTE_NAME.DASHBOARD>
> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { theme } = useTheme();
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const inspirations = useAppSelector(
		(state) => state.inspirations.inspirations,
	);
	const { error, isLoading } = useAppSelector(
		(state) => state.inspirations,
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
	const handleDelete = async (id: string) => {
		try {
			await dispatch(removeInspiration(id)).unwrap();
		} catch {
			Alert.alert("Delete failed", "Please try again.");
		}
	};
	const handleEdit = (inspiration: Inspiration) => {
		const rootNavigation = navigation.getParent() as
			| NativeStackNavigationProp<RootStackParamList>
			| undefined;

		rootNavigation?.navigate(ROUTE_NAME.ADD_INSPIRATION, {
			inspiration,
		});
	};

	useEffect(() => {
		if (error) {
			Alert.alert("Storage error", error);
		}
	}, [error]);

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
				<SwipeableCardProvider>
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
							<SwipeableInspirationCard
								inspiration={item}
								onDelete={handleDelete}
								onEdit={handleEdit}
							/>
						)}
						showsVerticalScrollIndicator={false}
					/>
				</SwipeableCardProvider>
			)}
			{isLoading && (
				<View style={styles.loaderOverlay}>
					<ActivityIndicator color={theme.PRIMARY} size="large" />
				</View>
			)}
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	list: {
		paddingBottom: 24,
	},
	loaderOverlay: {
		alignItems: "center",
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		pointerEvents: "none",
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
