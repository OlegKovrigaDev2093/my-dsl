import express from "express";
import cors from "cors";
import { Static, Type } from "@sinclair/typebox";
import YAML from "yaml";
import Ajv from "ajv";

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

const GetUsersListActionSchema = Type.Object(
  {
    type: Type.Literal("get-users-list"),
    id: Type.Optional(Type.String()),
  },
  {
    title: "Get users list",
  }
);

const SenderDslSchema = Type.Object(
  {
    actions: Type.Array(
      Type.Union([
        CreateUserActionSchema,
        DeleteUserActionSchema,
        SendMessageToChatActionSchema,
        GetUsersListActionSchema,
      ])
    ),
  },
  { title: "Basic Structure" }
);

type SenderDslType = Static<typeof SenderDslSchema>;

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/sender/dsl-schema", (req, res) => {
  res.json(SenderDslSchema);
});

const ajv = new Ajv();

const validate = ajv.compile(SenderDslSchema);

let users: { id: string; name: string; email: string; password: string }[] = [];

app.post("/sender/dsl", (req, res) => {
  const dsl = req.body.dsl;
  const parsedDsl = YAML.parse(dsl);
  const valid = validate(parsedDsl);
  if (!valid) {
    res.status(400).json({
      error: ajv.errors,
    });
  }

  const result = parsedDsl as SenderDslType;

  const results: unknown[] = [];

  for (const action of result.actions) {
    switch (action.type) {
      case "create-user":
        console.log("create-user", action);
        users.push({
          id: action.id,
          name: action.name,
          email: action.email,
          password: action.password,
        });
        break;
      case "delete-user":
        console.log("delete-user", action);
        users = users.filter((user) => user.id !== action.id);
        break;
      case "send-message-to-chat":
        console.log("send-message-to-chat", action);
        break;
      case "get-users-list":
        console.log("get-users-list", action);
        if (action.id) {
          results.push(users.find((user) => user.id === action.id));
        } else {
          results.push(users);
        }
        break;
    }
  }
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}}`);
});
