import {
	createAsyncThunk,
	createSlice,
	nanoid,
	type PayloadAction,
} from "@reduxjs/toolkit";

import {
	addInspiration,
	deleteInspiration,
	getInspirations,
	initDb,
	updateInspiration,
} from "./dbUtils";
import type { Inspiration } from "../types";

type CreateInspirationPayload = {
	image_url: string;
	quote: string;
};

type UpdateInspirationPayload = {
	id: string;
	image_url: string;
	quote: string;
};

type InspirationState = {
	error: string | null;
	inspirations: Inspiration[];
	isLoading: boolean;
};

const initialState: InspirationState = {
	error: null,
	inspirations: [],
	isLoading: false,
};

const loadInspirations = createAsyncThunk(
	"inspirations/load",
	async (): Promise<Inspiration[]> => {
		await initDb();

		return getInspirations();
	},
);

const createInspiration = createAsyncThunk(
	"inspirations/create",
	async (payload: CreateInspirationPayload): Promise<Inspiration> => {
		const now = new Date().toISOString();
		const inspiration: Inspiration = {
			created_at: now,
			id: nanoid(),
			image_url: payload.image_url,
			quote: payload.quote,
			updated_at: now,
		};

		await addInspiration(inspiration);

		return inspiration;
	},
);

const editInspiration = createAsyncThunk(
	"inspirations/update",
	async (payload: UpdateInspirationPayload): Promise<Inspiration> => {
		const updatedAt = new Date().toISOString();
		const current = {
			image_url: payload.image_url,
			quote: payload.quote,
			updated_at: updatedAt,
		};

		await updateInspiration(payload.id, current);

		return {
			created_at: "",
			id: payload.id,
			...current,
		};
	},
);

const removeInspiration = createAsyncThunk(
	"inspirations/delete",
	async (id: string): Promise<string> => {
		await deleteInspiration(id);

		return id;
	},
);

const inspirationSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadInspirations.pending, (state) => {
				state.error = null;
				state.isLoading = true;
			})
			.addCase(
				loadInspirations.fulfilled,
				(state, action: PayloadAction<Inspiration[]>) => {
					state.inspirations = action.payload;
					state.isLoading = false;
				},
			)
			.addCase(loadInspirations.rejected, (state, action) => {
				state.error = action.error.message ?? "Failed to load inspirations";
				state.isLoading = false;
			})
			.addCase(
				createInspiration.fulfilled,
				(state, action: PayloadAction<Inspiration>) => {
					state.inspirations.unshift(action.payload);
				},
			)
			.addCase(
				editInspiration.fulfilled,
				(state, action: PayloadAction<Inspiration>) => {
					const target = state.inspirations.find(
						(inspiration) => inspiration.id === action.payload.id,
					);

					if (target) {
						target.image_url = action.payload.image_url;
						target.quote = action.payload.quote;
						target.updated_at = action.payload.updated_at;
					}
				},
			)
			.addCase(
				removeInspiration.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.inspirations = state.inspirations.filter(
						(inspiration) => inspiration.id !== action.payload,
					);
				},
			);
	},
	initialState,
	name: "inspirations",
	reducers: {},
});

export {
	createInspiration,
	editInspiration,
	loadInspirations,
	removeInspiration,
};
export { inspirationSlice };
export type { InspirationState };
