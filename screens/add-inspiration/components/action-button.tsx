import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type ActionButtonProps = {
	children: string;
	disabled?: boolean;
	filled?: boolean;
	loading?: boolean;
	onPress: () => void;
	primaryColor: string;
	inverseTextColor: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
	children,
	disabled = false,
	filled = false,
	inverseTextColor,
	loading = false,
	onPress,
	primaryColor,
}) => (
	<Pressable
		accessibilityRole="button"
		disabled={disabled || loading}
		onPress={onPress}
		style={[
			styles.button,
			{
				backgroundColor: filled ? primaryColor : "transparent",
				borderColor: primaryColor,
				opacity: disabled ? 0.5 : 1,
			},
		]}
	>
		{loading ? (
			<ActivityIndicator color={filled ? inverseTextColor : primaryColor} />
		) : (
			<Text
				style={[
					styles.buttonText,
					{ color: filled ? inverseTextColor : primaryColor },
				]}
			>
				{children}
			</Text>
		)}
	</Pressable>
);

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		justifyContent: "center",
		minHeight: 48,
		paddingHorizontal: 18,
		paddingVertical: 10,
		width: "100%",
	},
	buttonText: {
		fontFamily: "LobsterTwo-Regular",
		fontSize: 24,
		textAlign: "center",
	},
});

export { ActionButton };
