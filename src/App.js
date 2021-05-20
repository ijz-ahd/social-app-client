import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostPage from "./pages/PostPage";
import { Container } from "semantic-ui-react";
import { AuthProvider } from "./context/authContext";
import AuthRoute from "./utils/authRoute";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={PostPage} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
