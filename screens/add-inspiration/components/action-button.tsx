import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ActionButtonProps = {
	children: string;
	disabled?: boolean;
	filled?: boolean;
	onPress: () => void;
	primaryColor: string;
	inverseTextColor: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
	children,
	disabled = false,
	filled = false,
	inverseTextColor,
	onPress,
	primaryColor,
}) => (
	<Pressable
		accessibilityRole="button"
		disabled={disabled}
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
		<Text
			style={[
				styles.buttonText,
				{ color: filled ? inverseTextColor : primaryColor },
			]}
		>
			{children}
		</Text>
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
