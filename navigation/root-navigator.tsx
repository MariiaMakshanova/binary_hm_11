import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";

import { BottomTabsNavigator } from "./bottom-tabs-navigator";
import { AddInspiration } from "../screens";
import { ROUTE_NAME } from "../enums";
import { useTheme } from "../hooks";
import type { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
	const { theme, themeName } = useTheme();

	return (
		<>
			<StatusBar style={themeName === "dark" ? "light" : "dark"} />
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerStyle: { backgroundColor: theme.APP_BACKGROUND },
						headerTitleStyle: {
							color: theme.PRIMARY,
							fontFamily: "LobsterTwo-Regular",
							fontSize: 28,
						},
						headerTintColor: theme.PRIMARY,
					}}
				>
					<Stack.Screen
						component={BottomTabsNavigator}
						name={ROUTE_NAME.BOTTOM_TABS_NAVIGATOR}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						component={AddInspiration}
						name={ROUTE_NAME.ADD_INSPIRATION}
						options={({ navigation, route }) => ({
							headerBackVisible: false,
							headerLeft: () => (
								<Pressable
									accessibilityRole="button"
									onPress={() =>
										navigation.navigate(ROUTE_NAME.BOTTOM_TABS_NAVIGATOR, {
											screen: ROUTE_NAME.DASHBOARD,
										})
									}
									style={{ paddingRight: 16 }}
								>
									<Ionicons
										color={theme.PRIMARY}
										name="arrow-back"
										size={28}
									/>
								</Pressable>
							),
							title: route.params?.inspiration
								? "Edit inspiration"
								: "Add inspiration",
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
};

export { RootNavigator };
