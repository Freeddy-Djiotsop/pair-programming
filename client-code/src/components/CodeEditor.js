import Editor from "@monaco-editor/react";

export default function CodeEditor({ codeEditorTheme }) {
  return (
    <Editor
      className="code-editor"
      height="100vh"
      width="100vw"
      theme={codeEditorTheme}
      defaultLanguage="javascript"
    />
  );
}
