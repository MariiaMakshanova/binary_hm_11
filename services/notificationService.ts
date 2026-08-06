import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const REMINDERS_ENABLED_KEY = "inspiration-reminders-enabled";
const REMINDER_NOTIFICATION_ID_KEY = "inspiration-reminder-notification-id";
const REMINDER_CHANNEL_ID = "inspiration-reminders";
const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowAlert: true,
	}),
});

const configureNotificationChannel = async () => {
	await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
		importance: Notifications.AndroidImportance.DEFAULT,
		name: "Inspiration reminders",
	});
};

const getDailyNotificationsEnabled = async () => {
	const storedValue = await AsyncStorage.getItem(REMINDERS_ENABLED_KEY);

	return storedValue === "true";
};

const requestNotificationPermissions = async () => {
	const currentPermission = await Notifications.getPermissionsAsync();

	if (currentPermission.granted) {
		return true;
	}

	const requestedPermission = await Notifications.requestPermissionsAsync();

	return requestedPermission.granted;
};

const cancelDailyNotifications = async () => {
	const scheduledNotificationId = await AsyncStorage.getItem(
		REMINDER_NOTIFICATION_ID_KEY,
	);

	if (scheduledNotificationId) {
		await Notifications.cancelScheduledNotificationAsync(scheduledNotificationId);
	}

	await AsyncStorage.multiRemove([
		REMINDERS_ENABLED_KEY,
		REMINDER_NOTIFICATION_ID_KEY,
	]);
};

const scheduleDailyNotifications = async () => {
	await configureNotificationChannel();

	const hasPermission = await requestNotificationPermissions();

	if (!hasPermission) {
		throw new Error("Notifications permission was not granted.");
	}

	await cancelDailyNotifications();

	const scheduledNotificationId =
		await Notifications.scheduleNotificationAsync({
			content: {
				body: "Open the app and create a new inspiration card.",
				sound: true,
				title: "Time for inspiration",
			},
			trigger: {
				channelId: REMINDER_CHANNEL_ID,
				repeats: true,
				seconds: EIGHT_HOURS_IN_SECONDS,
			},
		});

	await AsyncStorage.multiSet([
		[REMINDERS_ENABLED_KEY, "true"],
		[REMINDER_NOTIFICATION_ID_KEY, scheduledNotificationId],
	]);
};

export {
	cancelDailyNotifications,
	getDailyNotificationsEnabled,
	scheduleDailyNotifications,
};
