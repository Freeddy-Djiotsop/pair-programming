import "./App.css";
import MainComponent from "./components/MainComponent";
import MenuBar from "./components/MenuBar";

export default function App() {
  return (
    <div className="App">
      <MenuBar />
      <MainComponent />
    </div>
  );
}
