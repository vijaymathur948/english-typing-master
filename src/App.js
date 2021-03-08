import logo from "./logo.svg"
import "./App.css"
import TextBox from "./Components/TextBox"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom"

function App() {
  return (
    <Router>
      <TextBox />
    </Router>
  )
}

export default App
