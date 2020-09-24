//Requiring react
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Requiring components
import Home from "./views/home.jsx";
import Login from "./views/login.jsx";
import Register from "./views/register.jsx";
import Logout from "./views/logout.jsx";
import Profile from "./views/profile.jsx";
import Feed from "./views/feed.jsx";
import UserSettings from "./views/userSettings.jsx";
import DefaultView from "./views/defaultView.jsx";



function App() {

  return <div>
  {/* Defining routes to reach the specified view*/}
  <Router>
    <Route exact path="/" component={Home}/>
    <Route path="/login" component={Login}/>
    <Route path="/register" component={Register} reqLoginStatus={false}/>
    <Route path="/logout" component={Logout} reqLoginStatus={false}/>
    <Route path="/profile/user/:username" component={Profile}/>
    <Route path="/settings/user/:username" component={UserSettings}/>
    <Route exact path="/profile/user/" component={DefaultView}/>
    <Route exact path="/settings/user/" component={DefaultView}/>
    <Route path="/feed" component={Feed}/>
  </Router>
  </div>
}

export default App;
