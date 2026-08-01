import React, { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
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
import { ActionButton } from "./components";
import type { RootStackScreenProps } from "../../types";

const NO_IMAGE_SOURCE = require("../../assets/no-image.jpg");

const AddInspiration: React.FC<
	RootStackScreenProps<typeof ROUTE_NAME.ADD_INSPIRATION>
> = ({ navigation }) => {
	const { theme, themeName } = useTheme();
	const [imageUrl, setImageUrl] = useState("");
	const [inputQuote, setInputQuote] = useState("");
	const [generatedQuote, setGeneratedQuote] = useState("");
	const quote = inputQuote.trim() || generatedQuote.trim();
	const isSaveDisabled = !imageUrl || !quote;

	const pickImageFromGallery = async () => {
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
	};

	const pickImageFromCamera = async () => {
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
	};

	const handleChooseImage = () => {
		Alert.alert("Choose image", "Select image source", [
			{ text: "Gallery", onPress: () => void pickImageFromGallery() },
			{ text: "Camera", onPress: () => void pickImageFromCamera() },
			{ style: "cancel", text: "Cancel" },
		]);
	};

	const handleRandomImage = async () => {
		const image = await getRandomImage();
		setImageUrl(image.download_url);
	};

	const handleRandomQuote = async () => {
		const randomQuote = await getRandomQuote();

		setInputQuote("");
		setGeneratedQuote(randomQuote.quoteText.trim());
	};

	const handleInputChange = (value: string) => {
		setGeneratedQuote("");
		setInputQuote(value);
	};

	const handleSave = () => {
		if (isSaveDisabled) {
			return;
		}

		navigation.navigate(ROUTE_NAME.BOTTOM_TABS_NAVIGATOR, {
			screen: ROUTE_NAME.DASHBOARD,
			params: {
				inspiration: {
					image_url: imageUrl,
					quote,
				},
			},
		});
	};

	return (
		<ScreenBackground>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
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
						inverseTextColor={theme.FONT_INVERSE}
						onPress={handleChooseImage}
						primaryColor={theme.PRIMARY}
					>
						Choose image
					</ActionButton>
					<ActionButton
						inverseTextColor={theme.FONT_INVERSE}
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
					<ActionButton
						inverseTextColor={theme.FONT_INVERSE}
						onPress={() => void handleRandomQuote()}
						primaryColor={theme.PRIMARY}
					>
						Get random quote
					</ActionButton>
					<ActionButton
						disabled={isSaveDisabled}
						filled
						inverseTextColor={theme.FONT_INVERSE}
						onPress={handleSave}
						primaryColor={theme.PRIMARY}
					>
						Save
					</ActionButton>
				</ScrollView>
			</KeyboardAvoidingView>
		</ScreenBackground>
	);
};

const styles = StyleSheet.create({
	content: {
		gap: 14,
		paddingBottom: 28,
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
	preview: {
		alignSelf: "center",
		maxWidth: 360,
		width: "100%",
	},
});

export { AddInspiration };
