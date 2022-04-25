import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Battle from "./pages/index.js";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Battle/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
