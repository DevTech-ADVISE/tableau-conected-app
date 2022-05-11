import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const serverUrl = "https://public.tableau.com/views/Superstore_24/Overview";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    axios.get("/api/jwt").then((res) => {
      const jwt = res.data;
      setToken(jwt);
    });
  }, []);

  return (
    <div className="App">
      <p>Let's see if this loads</p>
      {token ? (
        <tableau-viz
          id="tableauViz"
          src={serverUrl}
          device="phone"
          toolbar="bottom"
          //token={token}
          hide-tabs
        ></tableau-viz>
      ) : (
        <p>Not loaded</p>
      )}
    </div>
  );
}

export default App;
