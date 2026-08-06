import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { InspirationCard, ScreenBackground } from "../../components";
import { ROUTE_NAME } from "../../enums";
import { useTheme } from "../../hooks";
import { getRandomImage, getRandomQuote } from "../../services";
import {
	createInspiration,
	editInspiration,
	useAppDispatch,
} from "../../store";
import { ActionButton, IconActionButton } from "./components";
import type { RootStackScreenProps } from "../../types";

const NO_IMAGE_SOURCE = require("../../assets/no-image.jpg");
type LoadingAction = "image" | "quote" | "save" | null;

const AddInspiration: React.FC<
	RootStackScreenProps<typeof ROUTE_NAME.ADD_INSPIRATION>
> = ({ navigation, route }) => {
	const dispatch = useAppDispatch();
	const { theme, themeName } = useTheme();
	const editingInspiration = route.params?.inspiration;
	const isEditMode = Boolean(editingInspiration);
	const [imageUrl, setImageUrl] = useState(
		editingInspiration?.image_url ?? "",
	);
	const [inputQuote, setInputQuote] = useState(
		editingInspiration?.quote ?? "",
	);
	const [generatedQuote, setGeneratedQuote] = useState("");
	const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
	const quote = inputQuote.trim() || generatedQuote.trim();
	const isSaveDisabled = !imageUrl || !quote;
	const isBusy = loadingAction !== null;

	useEffect(() => {
		setImageUrl(editingInspiration?.image_url ?? "");
		setInputQuote(editingInspiration?.quote ?? "");
		setGeneratedQuote("");
	}, [editingInspiration]);

	const pickImageFromGallery = async () => {
		setLoadingAction("image");

		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Please allow gallery access.");
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
			});
			const selectedImage = result.assets?.[0];

			if (!result.canceled && selectedImage?.uri) {
				setImageUrl(selectedImage.uri);
			}
		} catch {
			Alert.alert("Image error", "Could not choose image.");
		} finally {
			setLoadingAction(null);
		}
	};

	const pickImageFromCamera = async () => {
		setLoadingAction("image");

		try {
			const permission = await ImagePicker.requestCameraPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Please allow camera access.");
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
			});
			const selectedImage = result.assets?.[0];

			if (!result.canceled && selectedImage?.uri) {
				setImageUrl(selectedImage.uri);
			}
		} catch {
			Alert.alert("Camera error", "Could not take a photo.");
		} finally {
			setLoadingAction(null);
		}
	};

	const handleChooseImage = () => {
		Alert.alert("Choose image", "Select image source", [
			{ text: "Gallery", onPress: () => void pickImageFromGallery() },
			{ text: "Camera", onPress: () => void pickImageFromCamera() },
			{ style: "cancel", text: "Cancel" },
		]);
	};

	const handleRandomImage = async () => {
		setLoadingAction("image");

		try {
			const image = await getRandomImage();

			if (!image.download_url) {
				throw new Error("Random image is empty");
			}

			setImageUrl(image.download_url);
		} catch {
			Alert.alert("Image error", "Could not load a random image.");
		} finally {
			setLoadingAction(null);
		}
	};

	const handleRandomQuote = async () => {
		setLoadingAction("quote");

		try {
			const randomQuote = await getRandomQuote();
			const nextQuote = randomQuote.quoteText.trim();

			if (!nextQuote) {
				throw new Error("Random quote is empty");
			}

			setInputQuote("");
			setGeneratedQuote(nextQuote);
		} catch {
			Alert.alert("Quote error", "Could not load a random quote.");
		} finally {
			setLoadingAction(null);
		}
	};

	const handleInputChange = (value: string) => {
		setGeneratedQuote("");
		setInputQuote(value);
	};

	const handleSave = async () => {
		if (isSaveDisabled) {
			return;
		}

		setLoadingAction("save");

		try {
			if (editingInspiration) {
				await dispatch(
					editInspiration({
						id: editingInspiration.id,
						image_url: imageUrl,
						quote,
					}),
				).unwrap();
			} else {
				await dispatch(
					createInspiration({
						image_url: imageUrl,
						quote,
					}),
				).unwrap();
			}

			navigation.navigate(ROUTE_NAME.BOTTOM_TABS_NAVIGATOR, {
				screen: ROUTE_NAME.DASHBOARD,
			});
		} catch {
			Alert.alert("Save failed", "Please try again.");
		} finally {
			setLoadingAction(null);
		}
	};

	return (
		<ScreenBackground>
			<KeyboardAvoidingView
				behavior="height"
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.preview}>
						<InspirationCard
							imageUrl={imageUrl}
							placeholderSource={NO_IMAGE_SOURCE}
							quote={quote}
						/>
					</View>
					<ActionButton
						disabled={isBusy}
						inverseTextColor={theme.FONT_INVERSE}
						loading={loadingAction === "image"}
						onPress={handleChooseImage}
						primaryColor={theme.PRIMARY}
					>
						Choose image
					</ActionButton>
					<ActionButton
						disabled={isBusy}
						inverseTextColor={theme.FONT_INVERSE}
						loading={loadingAction === "image"}
						onPress={() => void handleRandomImage()}
						primaryColor={theme.PRIMARY}
					>
						Get random image
					</ActionButton>
					<TextInput
						multiline
						onChangeText={handleInputChange}
						placeholder="Enter your quote here..."
						placeholderTextColor={theme.SECONDARY}
						style={[
							styles.input,
							{
								borderColor: theme.PRIMARY,
								color:
									themeName === "dark"
										? theme.FONT_INVERSE
										: theme.FONT_MAIN,
							},
						]}
						textAlignVertical="top"
						value={inputQuote}
					/>
					<View style={styles.footerActions}>
						<IconActionButton
							accessibilityLabel="Get random quote"
							disabled={isBusy}
							iconName="download-sharp"
							inverseTextColor={theme.FONT_INVERSE}
							loading={loadingAction === "quote"}
							onPress={() => void handleRandomQuote()}
							primaryColor={theme.PRIMARY}
						/>
						<IconActionButton
							accessibilityLabel={
								isEditMode ? "Save inspiration changes" : "Save inspiration"
							}
							disabled={isSaveDisabled || isBusy}
							filled
							iconName="save-sharp"
							inverseTextColor={theme.FONT_INVERSE}
							loading={loadingAction === "save"}
							onPress={() => void handleSave()}
							primaryColor={theme.PRIMARY}
						/>
					</View>
				</ScrollView>
				{isBusy && (
					<View style={styles.loaderOverlay}>
						<ActivityIndicator color={theme.PRIMARY} size="large" />
					</View>
				)}
			</KeyboardAvoidingView>
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	content: {
		gap: 14,
		paddingBottom: 28,
	},
	footerActions: {
		flexDirection: "row",
		gap: 14,
		width: "100%",
	},
	input: {
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		fontFamily: "LobsterTwo-Regular",
		fontSize: 22,
		minHeight: 120,
		padding: 14,
		width: "100%",
	},
	keyboardView: {
		flex: 1,
	},
	loaderOverlay: {
		alignItems: "center",
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		pointerEvents: "none",
	},
	preview: {
		alignSelf: "center",
		maxWidth: 360,
		width: "100%",
	},
});

export { AddInspiration };
