import * as SQLite from "expo-sqlite";

import type { Inspiration } from "../types";

const DATABASE_NAME = "inspiration.db";
const TABLE_NAME = "inspirations";

type InspirationRow = {
	id: string;
	quote: string;
	image_url: string;
	created_at: string;
	updated_at: string;
};

let database: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
	if (!database) {
		database = await SQLite.openDatabaseAsync(DATABASE_NAME);
	}

	return database;
};

const initDb = async () => {
	const db = await getDb();

	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
			id TEXT PRIMARY KEY NOT NULL,
			quote TEXT NOT NULL,
			image_url TEXT NOT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);
	`);
};

const addInspiration = async (inspiration: Inspiration) => {
	const db = await getDb();

	await db.runAsync(
		`
			INSERT INTO ${TABLE_NAME} (id, quote, image_url, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?);
		`,
		inspiration.id,
		inspiration.quote,
		inspiration.image_url,
		inspiration.created_at,
		inspiration.updated_at,
	);
};

const updateInspiration = async (
	id: string,
	inspiration: Pick<Inspiration, "image_url" | "quote" | "updated_at">,
) => {
	const db = await getDb();

	await db.runAsync(
		`
			UPDATE ${TABLE_NAME}
			SET quote = ?, image_url = ?, updated_at = ?
			WHERE id = ?;
		`,
		inspiration.quote,
		inspiration.image_url,
		inspiration.updated_at,
		id,
	);
};

const deleteInspiration = async (id: string) => {
	const db = await getDb();

	await db.runAsync(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, id);
};

const getInspirations = async (): Promise<Inspiration[]> => {
	const db = await getDb();
	const rows = await db.getAllAsync<InspirationRow>(
		`SELECT * FROM ${TABLE_NAME} ORDER BY created_at DESC;`,
	);

	return rows.map((row) => ({
		created_at: row.created_at,
		id: row.id,
		image_url: row.image_url,
		quote: row.quote,
		updated_at: row.updated_at,
	}));
};

export {
	addInspiration,
	deleteInspiration,
	getInspirations,
	initDb,
	updateInspiration,
};
