import { configureStore } from "@reduxjs/toolkit";
import { useEffect, useState, useSyncExternalStore } from "react";

import {
	createInspiration,
	editInspiration,
	inspirationSlice,
	loadInspirations,
	removeInspiration,
} from "./inspirationSlice";

const store = configureStore({
	reducer: {
		inspirations: inspirationSlice.reducer,
	},
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppSelector = <Selected>(
	selector: (state: RootState) => Selected,
): Selected =>
	useSyncExternalStore(
		store.subscribe,
		() => selector(store.getState()),
		() => selector(store.getState()),
	);

const useAppDispatch = (): AppDispatch => store.dispatch;

const useStoreReady = () => {
	const [isReady, setIsReady] = useState(false);
	const dispatch = useAppDispatch();

	useEffect(() => {
		void dispatch(loadInspirations()).finally(() => setIsReady(true));
	}, [dispatch]);

	return isReady;
};

export {
	createInspiration,
	editInspiration,
	loadInspirations,
	removeInspiration,
	store,
	useAppDispatch,
	useAppSelector,
	useStoreReady,
};
export type { AppDispatch, RootState };
