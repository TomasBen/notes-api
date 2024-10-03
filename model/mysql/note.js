import mysql from "mysql2/promise";

const config = {
	host: "localhost",
	port: 3306,
	user: "root",
	database: "notesdb",
};

const connection = await mysql.createConnection(config);

export class NoteModel {
	static async getAll({ important }) {
		const [notes, tableInfo] = await connection.query(
			"SELECT content, important, BIN_TO_UUID(id) from notes; "
		);

		return notes;
	}

	static async getById({ id }) {
		const [notes, info] = await connection.query(
			`SELECT content, important, BIN_TO_UUID(id) FROM notes WHERE id=UUID_TO_BIN(?);`,
			[id]
		);

		if (notes.length === 0) return null;

		return notes;
	}

	static async create({ input }) {
		const { content, important } = input;
		const [uuidResult] = await connection.query("SELECT UUID() uuid");
		const [{ uuid }] = uuidResult;

		try {
			const result = await connection.query(
				`INSERT INTO notes (id, content, important) VALUES (UUID_TO_BIN("${uuid}"), ?, ?);`,
				[content, important]
			);
		} catch (e) {
			console.log(e);
		}

		const [newNote] = await connection.query(
			"SELECT BIN_TO_UUID(id), content, important, creation FROM notes WHERE id=UUID_TO_BIN(?)",
			[uuid]
		);

		return newNote;
	}

	static async delete({ id }) {
		const notes = await connection.query(
			`DELETE FROM notes WHERE id=UUID_TO_BIN(?);`,
			[id]
		);

		console.log(notes, id);

		if (notes > 0) return true;
		else false;
	}

	static async update({ id, input }) {}
}
