import { useEffect } from "react";
import * as Notifications from "expo-notifications";

const useNotificationResponse = () => {
	useEffect(() => {
		const subscription =
			Notifications.addNotificationResponseReceivedListener(() => {
				// Tapping the reminder only needs to bring the user back into the app.
			});

		return () => subscription.remove();
	}, []);
};

export { useNotificationResponse };
