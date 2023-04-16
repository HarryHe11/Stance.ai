import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import StanceDetection from "./components/StanceDetection";

function App() {
  return (
    <div style={{
      backgroundImage:`url(${process.env.PUBLIC_URL + 'assets/bg_pic.png'})`
    }} className="container">
      <div class="overlay">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/predict" component={StanceDetection} />
          {/* <Route exact path="/login" component={Login} />

          <Route exact path="/register" component={Register} /> */}

          {/* <Route exact path="/stance" component={StanceDetection} /> */}

        </Switch>
      </Router>
      </div>
    </div>
  );
}

export default App;
