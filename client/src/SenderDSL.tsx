import { Editor, useMonaco } from "@monaco-editor/react";
import YamlWorker from "./yaml.worker.ts?worker";
import { useEffect } from "react";
import { configureMonacoYaml } from 'monaco-yaml'

window.MonacoEnvironment = {
  getWorker: (moduleId, label) => {
    switch (label) {
      case "yaml":
        return new YamlWorker();
      default:
        throw new Error(`Unknown worker label: ${label}`);
    }
  },
};

const SenderDslSchema = {
    type: 'object',
    properties: {
        операция: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    тіп: {
                        enum: ['відправити','видалити']
                    }
                }
            }
        }
    }
}

const SenderDSL = () => {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    configureMonacoYaml(monaco, {
        enableSchemaRequest: true,
        schemas: [
          {
            fileMatch: ['*'],
            schema: SenderDslSchema,
            uri: 'https://examlpe.com/schema.json'
          }
        ]
      })
  }, [monaco]);

  return (
    <div>
      <h1>Sender DSL</h1>
      <Editor
        height="500px"
        theme="vs-dark"
        defaultLanguage="yaml"
        language="yaml"
        defaultValue={""}
      />
      <button>Send</button>
    </div>
  );
};

export default SenderDSL;
