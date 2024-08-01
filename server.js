const express = require("express");
const app = express();
const PORT = 3000;

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

app.get("/", (request, response) => {
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
	const id = request.params.id;
	notes = notes.filter((note) => note.id !== id);
	response.status(204).end();
});

app.use(express.json());

const generateId = () => {
	const MaxId =
		notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
	return String(MaxId + 1);
};

app.post("/api/notes", (request, response) => {
	const body = request.body;

	if (!body.content) {
		return response.status(404).json({
			error: "missing content",
		});
	}

	const note = {
		id: generateId(),
		content: body.content,
		important: Boolean(body.important) || false,
	};

	notes = notes.concat(note);

	response.json(notes);
});

const unknownEndpoit = (request, response) => {
	response.status(404).send({
		error: "unkown endpoint",
	});
};

app.use(unknownEndpoit);
