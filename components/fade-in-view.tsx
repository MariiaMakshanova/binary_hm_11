import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import type { ReactNode } from "react";

type FadeInViewProps = {
	children: ReactNode;
	delay?: number;
};

const FadeInView: React.FC<FadeInViewProps> = ({ children, delay = 0 }) => {
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(12)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				delay,
				duration: 260,
				toValue: 1,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				delay,
				duration: 260,
				toValue: 0,
				useNativeDriver: true,
			}),
		]).start();
	}, [delay, opacity, translateY]);

	return (
		<Animated.View
			style={[
				styles.container,
				{
					opacity,
					transform: [{ translateY }],
				},
			]}
		>
			{children}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
});

export { FadeInView };
