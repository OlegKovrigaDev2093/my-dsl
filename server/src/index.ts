import express from "express";
import cors from "cors";
import { Type, Static } from "@sinclair/typebox";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

const CreateUserActionSchema = Type.Object(
  {
    type: Type.Literal("create-user"),
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
    password: Type.String(),
  },
  {
    title: "User Create",
    description: "Create New User",
  }
);

const DeleteUserActionSchema = Type.Object(
  { type: Type.Literal("delete-user"), id: Type.String() },
  { title: "Delete User" }
);

const SendMessageToChatActionSchema = Type.Object(
  {
    type: Type.Literal("send-message-to-chat"),
    chatId: Type.String(),
    message: Type.String(),
  },
  { title: "Send message from chat" }
);

const SenderDslSchema = Type.Object(
  {
    actions: Type.Array(
      Type.Union([
        CreateUserActionSchema,
        DeleteUserActionSchema,
        SendMessageToChatActionSchema,
      ])
    ),
  },
  { title: "Basic Structure" }
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/sender/dsl-schema", (req, res) => {
  res.json(SenderDslSchema);
});

app.post("/sender/dsl", (req, res) => {
  const dsl = req.body;
  console.log(dsl);
  const result = SenderDslSchema.Parse(dsl);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}}`);
});
