import express from "express";
import { createNoteRouter } from "./routes/notes.js";

export const createApp = ({ noteModel }) => {
	const app = express();
	const PORT = process.env.PORT ?? 3000;

	app.disable("x-powered-by");
	app.listen(PORT, () => {
		console.log(`server running on https://localhost:${PORT}`);
	});

	app.use("/notes", createNoteRouter({ noteModel: noteModel }));

	const unknownEndpoit = (request, response) => {
		const endpoint = request.originalUrl;

		response.status(404).send({
			error: endpoint,
		});
	};

	app.use(unknownEndpoit);
};
