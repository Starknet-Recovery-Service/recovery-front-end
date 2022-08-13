import logo from "./logo.svg";
import "./App.css";
import Nav from "./Nav";
import RecoveryDeployment from "./RecoveryDeployment";
import RecoveryExecution from "./RecoveryExecution";
import Allowance from "./Allowance";

function App() {
  return (
    <div className="App">
      <Nav />
      <RecoveryDeployment />
      <RecoveryExecution />
      <Allowance />
    </div>
  );
}

export default App;
