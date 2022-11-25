import React, { useState } from "react";
import "./App.css";
import { UserContext } from "./UserContext";
import {AppRouter} from './routers/AppRouter';
import {createBrowserRouter, RouterProvider, Route} from 'react-router-dom';
import { Home } from './pages/Home';
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Root } from "./routers/Root";
import { Detail } from "./pages/Detail";
import { PrivateRouter } from "./routers/PrivateRouter";
import { Profile } from "./pages/Profile";

function App() {

  const dataUser = sessionStorage.getItem('MercadoLiebreReact') ? JSON.parse(sessionStorage.getItem('MercadoLiebreReact')) : {
    logged : false,
    name : null,
    rolId : null,
    token : null
  }

  const [user, setUser] = useState(dataUser);

  

  const router = createBrowserRouter([
    {
      path: "/",
      element : <Root/>,
      errorElement : <NotFound/>,
      children : [
        {
          path : '/',
          element : <Home/>,
        },
        {
          path : 'users/login',
          element : <Login/>,
        },
        {
          path: "products/detail/:id",
          element: <Detail />
        },
        {
          path: "users/profile",
          element: <Profile />
        }
      ]
    }
  ])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <RouterProvider router={router}/>
    </UserContext.Provider>
  );
}

export default App;
