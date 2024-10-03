import { createApp } from "./app.js";
import { NoteModel } from "./model/mysql/note.js";

createApp({ noteModel: NoteModel });
