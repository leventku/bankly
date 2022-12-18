import reactLogo from "./assets/react.svg";
import "./app.css";
import { Home } from "./views/home";

const App = () => (
  <div className="app">
    <div className="app__row">
      <div className="top-bar">
        <a href="https://www.thisisbud.com/" target="_blank" rel="noreferrer">
          <img src="/bankly.svg" className="logo" alt="Bud logo" />
        </a>
      </div>
    </div>
    <div className="divider"></div>
    <div className="app__row">
      <Home />
    </div>
  </div>
);

export default App;
