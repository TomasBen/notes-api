import { createApp } from "./app.js";
import { NoteModel } from "./model/local-file-system/note.js";

createApp({ noteModel: NoteModel });
