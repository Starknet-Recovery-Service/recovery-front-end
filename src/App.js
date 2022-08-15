import logo from "./logo.svg";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import "./App.css";
import Nav from "./Nav";
import About from "./About";
import RecoveryDeployment from "./RecoveryDeployment";
import RecoveryExecution from "./RecoveryExecution";
import Allowance from "./Allowance";
import Claim from "./Claim";

function App() {
  const [page, setPage] = useState("deployment");

  const renderPage = () => {
    if (page === "deployment") {
      return <RecoveryDeployment />;
    } else if (page === "allowance") {
      return <Allowance />;
    } else if (page === "recovery") {
      return <RecoveryExecution />;
    } else if (page === "about") {
      return <About />;
    } else if (page === "claim") {
      return <Claim />;
    }
  };
  return (
    <Box className="App">
      <Nav setPage={setPage} />
      <Box>{renderPage()}</Box>
    </Box>
  );
}

export default App;
