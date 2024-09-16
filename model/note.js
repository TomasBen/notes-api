import { randomUUID } from "node:crypto";
import { readJSON } from "../utils/readJSON.js";

const notes = readJSON("../notes.json");

export class NoteModel {
	static async getAll({ important }) {
		if (important) {
			return notes.filter((note) =>
				note.important.some(i.toLowerCase() === important.toLowerCase())
			);
		}

		return notes;
	}

	static async getById({ id }) {
		let note = notes.find((note) => note.id === id);
		return note;
	}

	static async create({ input }) {
		const newNote = {
			id: `${randomUUID()}`,
			...input,
		};

		notes.push(newNote);

		return newNote;
	}

	static async delete({ id }) {
		const noteIndex = notes.findIndex((note) => note.id === id);

		if (noteIndex === -1) return false;
		notes.splice(noteIndex, 1);
		return true;
	}

	static async update({ id, input }) {
		const noteIndex = notes.findIndex((note) => note.id === id);
		if (noteIndex === -1) return false;

		notes[noteIndex] = {
			...notes[noteIndex],
			...input,
		};

		return true;
	}
}
