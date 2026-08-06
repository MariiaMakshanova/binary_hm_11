import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

type IconActionButtonProps = {
	accessibilityLabel: string;
	disabled?: boolean;
	filled?: boolean;
	iconName: keyof typeof Ionicons.glyphMap;
	onPress: () => void;
	primaryColor: string;
	inverseTextColor: string;
};

const IconActionButton: React.FC<IconActionButtonProps> = ({
	accessibilityLabel,
	disabled = false,
	filled = false,
	iconName,
	inverseTextColor,
	onPress,
	primaryColor,
}) => (
	<Pressable
		accessibilityLabel={accessibilityLabel}
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
		<Ionicons
			color={filled ? inverseTextColor : primaryColor}
			name={iconName}
			size={30}
		/>
	</Pressable>
);

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		borderRadius: 14,
		borderWidth: StyleSheet.hairlineWidth,
		flex: 1,
		justifyContent: "center",
		minHeight: 54,
	},
});

export { IconActionButton };
