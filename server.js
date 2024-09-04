import express from "express";
import { validateNote, validatePartialNote } from "./notes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.disable("x-powered-by");

app.listen(PORT, () => {
	console.log(`server running on https://localhost:${PORT}`);
});

let notes = [
	{ id: "1", content: "HTML is easy", important: true },
	{ id: "2", content: "Browser can execute only JavaScript", important: false },
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
];

const ACCEPTED_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:1234",
	"http://localhost:3030",
];

app.get("/", (request, response) => {
	const origin = request.header.origin;

	if (ACCEPTED_ORIGINS.includes(origin)) {
		response.header("Access-Cotrol-Allow-Origin", origin);
	}

	response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
	response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	let note = notes.find((note) => note.id === id);

	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/notes/:id", (request, response) => {
	const { id } = request.params.id;

	notes = notes.filter((note) => note.id !== id);

	response.status(204).end();
});

app.options("/api/notes/:id", (request, response) => {
	const origin = request.header.origin;

	if (ACCEPTED_ORIGINS.includes(origin)) {
		response.header("Access-Cotrol-Allow-Origin", origin);
		response.header(
			"Access-Control-Allowed-Methods",
			"GET, POST, PATCH, DELETE"
		);
	}

	response.status(200).end();
});

app.use(express.json());

app.post("/api/notes", (request, response) => {
	const result = validateNote(request.body);

	if (result.error) {
		return response.status(400).json({
			error: JSON.parse(result.error.message),
		});
	}

	const note = {
		id: `${crypto.randomUUID()}`,
		...result.data,
	};

	notes = notes.concat(note);

	response.json(notes);
});

app.patch("/api/notes/:id", (request, response) => {
	const { id } = request.params;
	const result = validatePartialNote(request.body);

	if (!result.success) {
		return response
			.status(400)
			.json({ error: JSON.parse(result.error.message) });
	}

	const noteIndex = notes.findIndex((note) => note.id == id);

	if (noteIndex === -1) {
		return response.status(404).json({
			error: "movie not found ",
		});
	}

	const updatedNote = {
		...notes[noteIndex],
		...result.data,
	};

	notes[noteIndex] = updatedNote;

	return response.json(updatedNote);
});

const unknownEndpoit = (request, response) => {
	response.status(404).send({
		error: "unkown endpoint",
	});
};

app.use(unknownEndpoit);
