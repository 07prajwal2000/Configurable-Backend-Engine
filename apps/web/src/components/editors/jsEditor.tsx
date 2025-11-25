import { Editor } from "@monaco-editor/react";

type CodeEditorProps = {
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: string;
  readonly?: boolean;
  height?: number;
  showLineNumbers?: boolean;
};

const JsEditor = (props: CodeEditorProps) => {
  const showLineNumbers = props.showLineNumbers ?? true;
  const height = props.height ? `${props.height}px` : "350px";
  return (
    <Editor
      language="javascript"
      height={height}
      defaultValue={props.defaultValue}
      theme="vs-dark"
      value={props.value}
      onChange={(e) => props.onChange && props.onChange(e!)}
      options={{
        readOnly: props.readonly,
        lineNumbers: showLineNumbers ? "on" : "off",
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
      }}
    />
  );
};

export default JsEditor;
