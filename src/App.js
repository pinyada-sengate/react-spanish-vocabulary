import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Users from "./user/pages/Users";
import AddCategory from "./category/pages/AddCategory";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/category/add" exact>
          <AddCategory />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
