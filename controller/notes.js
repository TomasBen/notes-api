import { validateNote, validatePartialNote } from "../Schemas/notes.js";

const ACCEPTED_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:1234",
	"http://localhost:3030",
];

export class NoteController {
	constructor({ noteModel }) {
		this.noteModel = noteModel;
	}

	getAll = async (req, res) => {
		const { important } = req.query;
		const result = await this.noteModel.getAll({ important });

		res.json(result);
	};

	getByID = async (req, res) => {
		const id = req.params.id;
		const result = await this.noteModel.getById({ id });

		if (result) res.json(result);
		else res.status(404).json({ error: "note not found" });
	};

	deleteNote = async (req, res) => {
		const id = req.params;
		const result = await this.noteModel.delete(id);

		if (result) res.status(200).end();
		else res.status(404).json({ error: "note not found" });
	};

	preFlight = async (req, res) => {
		const origin = req.header.origin;

		if (ACCEPTED_ORIGINS.includes(origin)) {
			res.header("Access-Cotrol-Allow-Origin", origin);
			res.header("Access-Control-Allowed-Methods", "GET, POST, PATCH, DELETE");
		}

		res.statusCode(200);
	};

	createNote = async (req, res) => {
		const result = validateNote(req.body);

		if (result.error) {
			return res.status(400).json({
				error: JSON.parse(result.error.message),
			});
		}

		const newNote = await this.noteModel.create({ input: result.data });
		res.json(newNote);
	};

	updateNote = async (req, res) => {
		const { id } = req.params;
		const result = validatePartialNote(req.body);

		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) });
		}

		const updatedNote = await this.noteModel.update({ id, input: result.data });
		if (updatedNote) return res.statusCode(200);
	};
}
