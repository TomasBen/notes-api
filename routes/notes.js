import express from "express";
import { Router } from "express";

import { NoteController } from "../controller/notes.js";

export const notesRouter = Router();

notesRouter.use(express.json());
notesRouter.get("/", NoteController.getAll);
notesRouter.get("/:id", NoteController.getByID);
notesRouter.delete("/:id", NoteController.deleteNote);
notesRouter.options("/:id", NoteController.preFlight);
notesRouter.post("/notes", NoteController.createNote);
notesRouter.patch("/:id", NoteController.updateNote);
