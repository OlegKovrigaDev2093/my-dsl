import { Editor, useMonaco } from "@monaco-editor/react";
import YamlWorker from "./yaml.worker.ts?worker";
import { use, useEffect, useState } from "react";
import { configureMonacoYaml } from "monaco-yaml";

const HOST = "http://localhost:3000/sender";

window.MonacoEnvironment = {
  getWorker: (_, label) => {
    switch (label) {
      case "yaml":
        return new YamlWorker();
      default:
        throw new Error(`Unknown worker label: ${label}`);
    }
  },
};

const dslSchemaPromise = fetch(`${HOST}/dsl-schema`).then((res) => res.json());

export const SenderDSL = () => {
  const [dsl, setDsl] = useState<string>("");
  const monaco = useMonaco();
  const [result, setResults] = useState<unknown[]>([]);

  const dslSchema = use(dslSchemaPromise);

  const send = () => {
    fetch(`${HOST}/dsl`, {
      method: "POST",
      body: JSON.stringify({ dsl }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  };

  useEffect(() => {
    if (!monaco) return;

    configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [
        {
          fileMatch: ["*"],
          schema: dslSchema,
          uri: "https://examlpe.com/schema.json",
        },
      ],
    });
  }, [monaco]);

  return (
    <div>
      <h1>Sender DSL</h1>
      <Editor
        height="500px"
        theme="vs-dark"
        defaultLanguage="yaml"
        language="yaml"
        defaultValue=""
        value={dsl}
        onChange={(value) => setDsl(value ?? "")}
      />
      <button onClick={send}>Send</button>
      <div>{JSON.stringify(result)}</div>
    </div>
  );
};
