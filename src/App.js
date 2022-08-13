import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./Nav";
import RecoveryDeployment from "./RecoveryDeployment";
import RecoveryExecution from "./RecoveryExecution";
import Allowance from "./Allowance";

function App() {
  const [page, setPage] = useState("deployment");

  const renderPage = () => {
    if (page === "deployment") {
      return <RecoveryDeployment />;
    } else if (page === "allowance") {
      return <Allowance />;
    } else if (page === "recovery") {
      return <RecoveryExecution />;
    }
  };
  return (
    <div className="App">
      <Nav setPage={setPage} />
      {renderPage()}
    </div>
  );
}

export default App;
