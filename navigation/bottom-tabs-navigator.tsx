import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";

import { ROUTE_NAME } from "../enums";
import { useTheme } from "../hooks";
import { Dashboard, Settings } from "../screens";
import type { BottomTabsParamList, RootStackParamList } from "../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabsNavigator = () => {
	const { theme } = useTheme();

	return (
		<BottomTabs.Navigator
			screenOptions={({ route }) => ({
				headerStyle: { backgroundColor: theme.APP_BACKGROUND },
				headerTitleStyle: {
					color: theme.PRIMARY,
					fontFamily: "LobsterTwo-Regular",
					fontSize: 28,
				},
				tabBarActiveTintColor: theme.PRIMARY,
				tabBarInactiveTintColor: theme.SECONDARY,
				tabBarIcon: ({ color, size }) => (
					<Ionicons
						color={color}
						name={route.name === ROUTE_NAME.DASHBOARD ? "home" : "settings"}
						size={size}
					/>
				),
				tabBarLabelStyle: {
					fontFamily: "LobsterTwo-Regular",
					fontSize: 18,
				},
				tabBarStyle: { backgroundColor: theme.APP_BACKGROUND },
			})}
		>
			<BottomTabs.Screen
				component={Dashboard}
				name={ROUTE_NAME.DASHBOARD}
				options={({ navigation }) => ({
					headerRight: () => {
						const rootNavigation = navigation.getParent() as
							| NativeStackNavigationProp<RootStackParamList>
							| undefined;

						return (
							<Pressable
								accessibilityRole="button"
								onPress={() =>
									rootNavigation?.navigate(ROUTE_NAME.ADD_INSPIRATION, {
										inspiration: undefined,
									})
								}
								style={{ paddingHorizontal: 18 }}
							>
								<Ionicons color={theme.PRIMARY} name="add-circle" size={30} />
							</Pressable>
						);
					},
					title: "Home",
				})}
			/>
			<BottomTabs.Screen
				component={Settings}
				name={ROUTE_NAME.SETTINGS}
				options={{ title: "Settings" }}
			/>
		</BottomTabs.Navigator>
	);
};

export { BottomTabsNavigator };
