import express from "express";
import { notesRouter } from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
app.disable("x-powered-by");
app.use("/notes", notesRouter);

app.listen(PORT, () => {
	console.log(`server running on https://localhost:${PORT}`);
});

const unknownEndpoit = (request, response) => {
	response.status(404).send({
		error: "unkown endpoint",
	});
};

app.use(unknownEndpoit);
