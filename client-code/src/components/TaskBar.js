import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import MonacoEditor from "@monaco-editor/react";

export default function TaskBar() {
  return (
    <div className="task-bar">
      <div className="task-bar-files">
        <div>
          <i className="language-icon"></i>
          <button className="task-bar-file-name"></button>
          <button className="task-bar-file-close"></button>
        </div>
      </div>
      <div className="task-bar-actions"></div>
    </div>
  );
}
