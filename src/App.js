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
import Auth from "./user/pages/Auth";
import AddVocabulary from "./vocabulary/pages/AddVocabulary";
import Vocabularies from "./vocabulary/pages/Vocabularies";
import EditCategory from "./category/pages/EditCategory";
import EditVocabulary from "./vocabulary/pages/EditVocabulary";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/category/getCategories" exact>
          <Categories />
        </Route>
        <Route path="/category/add" exact>
          <AddCategory />
        </Route>
        <Route path="/category/edit/:id" exact>
          <EditCategory />
        </Route>
        <Route path="/vocabulary/add/:categoryId" exact>
          <AddVocabulary />
        </Route>
        <Route path="/vocabulary/getVocabularies/:categoryId" exact>
          <Vocabularies />
        </Route>
        <Route path="/vocabulary/edit/:id" exact>
          <EditVocabulary />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/category/getCategories" exact>
          <Categories />
        </Route>
        <Route path="/vocabulary/getVocabularies/:categoryId" exact>
          <Vocabularies />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
