const notesSchema = z.object({
  id: z
    .number({
      invalid_type_error: "id must be a number",
      required_error: "an id is required for all notes",
    })
    .positive()
    .int()
    .default(crypto.randomUUID()),
  important: z.string({
    invalid_type_error: "movie must be a string",
  }),
  content: z.string({}),
});

export default function validateNote(object) {
  return notesSchema.safeParse(object);
}
