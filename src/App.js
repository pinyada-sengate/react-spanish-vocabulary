import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AddCategory from "./category/pages/AddCategory";
import Categories from "./category/pages/Categories";

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/category/getCategories" exact>
            <Categories />
          </Route>
          <Route path="/category/add" exact>
            <AddCategory />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
