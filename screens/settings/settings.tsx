import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Switch, View } from "react-native";

import { FadeInView, ScreenBackground } from "../../components";
import { useTheme } from "../../hooks";
import {
	cancelDailyNotifications,
	getDailyNotificationsEnabled,
	scheduleDailyNotifications,
} from "../../services";

const Settings: React.FC = () => {
	const { theme, themeName, toggleTheme } = useTheme();
	const isDarkTheme = themeName === "dark";
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);

	useEffect(() => {
		const loadNotificationSettings = async () => {
			try {
				const enabled = await getDailyNotificationsEnabled();

				setNotificationsEnabled(enabled);
			} catch {
				Alert.alert(
					"Notifications error",
					"Could not load notification settings.",
				);
			} finally {
				setIsNotificationsLoading(false);
			}
		};

		void loadNotificationSettings();
	}, []);

	const handleNotificationsToggle = async (enabled: boolean) => {
		setIsNotificationsLoading(true);

		try {
			if (enabled) {
				await scheduleDailyNotifications();
			} else {
				await cancelDailyNotifications();
			}

			setNotificationsEnabled(enabled);
		} catch (error) {
			Alert.alert(
				"Notifications error",
				error instanceof Error
					? error.message
					: "Could not update notification settings.",
			);
		} finally {
			setIsNotificationsLoading(false);
		}
	};

	return (
		<ScreenBackground>
			<View style={styles.container}>
				<FadeInView>
					<View style={styles.settingRow}>
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
				</FadeInView>
				<FadeInView delay={80}>
					<View style={styles.settingRow}>
						<Ionicons color={theme.PRIMARY} name="notifications" size={34} />
						{isNotificationsLoading ? (
							<ActivityIndicator color={theme.PRIMARY} />
						) : (
							<Switch
								onValueChange={(enabled) =>
									void handleNotificationsToggle(enabled)
								}
								thumbColor={theme.PRIMARY}
								trackColor={{
									false: theme.GREY,
									true: theme.SECONDARY,
								}}
								value={notificationsEnabled}
							/>
						)}
						<Ionicons
							color={theme.PRIMARY}
							name={notificationsEnabled ? "alarm" : "alarm-outline"}
							size={34}
						/>
					</View>
				</FadeInView>
			</View>
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		gap: 28,
		justifyContent: "center",
	},
	settingRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 18,
		justifyContent: "center",
		minHeight: 52,
	},
});

export { Settings };
