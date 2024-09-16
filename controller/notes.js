import { validateNote, validatePartialNote } from "../Schemas/notes.js";
import { NoteModel } from "../model/note.js";

const ACCEPTED_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:1234",
	"http://localhost:3030",
];

export class NoteController {
	static async getAll(req, res) {
		const { important } = req.query;
		const result = await NoteModel.getAll({ important });

		res.json(result);
	}

	static async getByID(req, res) {
		const id = req.params.id;
		const result = await NoteModel.getById({ id });

		if (result) res.json(result);
		else res.status(404).json({ error: "note not found" });
	}

	static async deleteNote(req, res) {
		const { id } = req.params.id;
		const result = await NoteModel.delete(id);

		if (result) res.statusCode(200);
		else res.status(404).json({ error: "note not found" });
	}

	static async preFlight(req, res) {
		const origin = req.header.origin;

		if (ACCEPTED_ORIGINS.includes(origin)) {
			res.header("Access-Cotrol-Allow-Origin", origin);
			res.header("Access-Control-Allowed-Methods", "GET, POST, PATCH, DELETE");
		}

		res.statusCode(200);
	}

	static async createNote(req, res) {
		const result = validateNote(req.body);

		if (result.error) {
			return res.status(400).json({
				error: JSON.parse(result.error.message),
			});
		}

		const newNote = await NoteModel.create({ input: result.data });
		res.json(newNote);
	}

	static async updateNote(req, res) {
		const { id } = req.params;
		const result = validatePartialNote(req.body);

		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) });
		}

		const updatedNote = await NoteModel.update({ id, input: result.data });
		if (updatedNote) return res.statusCode(200);
	}
}
