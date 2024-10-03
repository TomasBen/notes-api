import { json } from "express";
import { Router } from "express";
import { NoteController } from "../controller/notes.js";

export const createNoteRouter = ({ noteModel }) => {
	const notesRouter = Router();

	const noteController = new NoteController({ noteModel });

	notesRouter.use(json());
	notesRouter.get("/", noteController.getAll);
	notesRouter.get("/:id", noteController.getByID);
	notesRouter.delete("/:id", noteController.deleteNote);
	notesRouter.options("/:id", noteController.preFlight);
	notesRouter.post("/", noteController.createNote);
	notesRouter.patch("/:id", noteController.updateNote);

	return notesRouter;
};
