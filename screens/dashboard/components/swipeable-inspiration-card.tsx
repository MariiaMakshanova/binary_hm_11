import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { InspirationCard } from "../../../components";
import { useSwipeableCard } from "../../../contexts";
import { useTheme } from "../../../hooks";
import type { Inspiration } from "../../../types";

type SwipeableInspirationCardProps = {
	inspiration: Inspiration;
	onDelete: (id: string) => void;
	onEdit: (inspiration: Inspiration) => void;
};

const SwipeableInspirationCard: React.FC<SwipeableInspirationCardProps> = ({
	inspiration,
	onDelete,
	onEdit,
}) => {
	const { closeCurrent, openSwipeable } = useSwipeableCard();
	const { theme } = useTheme();
	const swipeableRef = useRef<Swipeable | null>(null);

	const handleSwipeableWillOpen = () => {
		openSwipeable(inspiration.id, () => swipeableRef.current?.close());
	};

	const handleDelete = () => {
		closeCurrent();
		onDelete(inspiration.id);
	};

	const handleEdit = () => {
		closeCurrent();
		onEdit(inspiration);
	};

	return (
		<Swipeable
			ref={swipeableRef}
			containerStyle={styles.container}
			onSwipeableWillOpen={handleSwipeableWillOpen}
			overshootLeft={false}
			overshootRight={false}
			renderLeftActions={() => (
				<View style={[styles.actionContainer, styles.leftAction]}>
					<Pressable
						accessibilityLabel="Edit inspiration"
						accessibilityRole="button"
						onPress={handleEdit}
						style={styles.actionButton}
					>
						<Ionicons color={theme.SECONDARY} name="create" size={36} />
					</Pressable>
				</View>
			)}
			renderRightActions={() => (
				<View style={[styles.actionContainer, styles.rightAction]}>
					<Pressable
						accessibilityLabel="Delete inspiration"
						accessibilityRole="button"
						onPress={handleDelete}
						style={styles.actionButton}
					>
						<Ionicons color={theme.PRIMARY} name="trash" size={36} />
					</Pressable>
				</View>
			)}
		>
			<InspirationCard
				imageUrl={inspiration.image_url}
				quote={inspiration.quote}
			/>
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	actionButton: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		width: 88,
	},
	actionContainer: {
		justifyContent: "center",
	},
	container: {
		borderRadius: 24,
		marginBottom: 22,
	},
	leftAction: {
		alignItems: "flex-start",
	},
	rightAction: {
		alignItems: "flex-end",
	},
});

export { SwipeableInspirationCard };
