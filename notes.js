import { z } from "zod";

const notesSchema = z.object({
	content: z.string({}),
	important: z.boolean({
		invalid_type_error: "important must be either true or false",
	}),
});

function validateNote(object) {
	return notesSchema.safeParse(object);
}

function validatePartialNote(input) {
	return notesSchema.partial().safeParse(input);
}

export { validateNote, validatePartialNote };
