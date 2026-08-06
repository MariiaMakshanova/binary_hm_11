import React, { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";

type SwipeableCardContextValue = {
	closeCurrent: () => void;
	openSwipeable: (id: string, close: () => void) => void;
};

type OpenedSwipeable = {
	close: () => void;
	id: string;
};

const SwipeableCardContext =
	createContext<SwipeableCardContextValue | null>(null);

const SwipeableCardProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const openedSwipeableRef = useRef<OpenedSwipeable | null>(null);

	const closeCurrent = () => {
		openedSwipeableRef.current?.close();
		openedSwipeableRef.current = null;
	};

	const openSwipeable = (id: string, close: () => void) => {
		if (
			openedSwipeableRef.current &&
			openedSwipeableRef.current.id !== id
		) {
			openedSwipeableRef.current.close();
		}

		openedSwipeableRef.current = { close, id };
	};

	return (
		<SwipeableCardContext.Provider value={{ closeCurrent, openSwipeable }}>
			{children}
		</SwipeableCardContext.Provider>
	);
};

const useSwipeableCard = () => {
	const context = useContext(SwipeableCardContext);

	if (!context) {
		throw new Error(
			"useSwipeableCard must be used within SwipeableCardProvider",
		);
	}

	return context;
};

export { SwipeableCardProvider, useSwipeableCard };
