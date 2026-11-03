import { Fragment, useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/auth/Unauthorized";
import Home from "./pages/home/Home";
import EditPet from "./pages/pet/EditPet";
import ListPet from "./pages/pet/ListPet";
import NewPet from "./pages/pet/NewPet";
import EditProfile from "./pages/profile/EditProfile";
import Profile from "./pages/profile/Profile";
import Statistic from "./pages/statistic/Statistic";
import EditUser from "./pages/user/EditUser";
import ListUser from "./pages/user/ListUser";
import PrivateRoute from "./PrivateRoute";
import RoleAccess from "./RoleAccess";
import "./style/dark.scss";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  // Estado global del idioma (Español por defecto o recuperado de localStorage)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_lang") || "es";
  });

  // Función para cambiar el idioma y guardarlo de forma persistente
  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Fragment>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<Login currentLang={lang} />} />
            <Route path="/signup" element={<Signup currentLang={lang} />} />

           <Route path="unauthorized" element={<PrivateRoute />}>
            <Route index element={<Unauthorized currentLang={lang} setCurrLang={handleSetLang} />} />
          </Route>

            {/* Rutas Privadas / Home */}
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Home currentLang={lang} setCurrLang={handleSetLang} />} />
              <Route path="home" element={<Home currentLang={lang} setCurrLang={handleSetLang} />} />
            </Route>

            {/* Rutas de Mascotas */}
            <Route path="pets" element={<PrivateRoute />}>
              <Route element={<RoleAccess roles={["ROLE_USER"]} />} >
                <Route index element={<ListPet currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
              <Route element={<RoleAccess roles={["ROLE_USER"]} />} >
                <Route path="new" element={<NewPet currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
              <Route element={<RoleAccess roles={["ROLE_USER"]} />} >
                <Route path="edit" element={<EditPet currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
            </Route>

            {/* Rutas de Perfil */}
            <Route path="profile" element={<PrivateRoute />}>
              <Route element={<RoleAccess roles={["ROLE_USER"]} />} >
                <Route index element={<Profile currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
              <Route element={<RoleAccess roles={["ROLE_USER"]} />} >
                <Route path="edit" element={<EditProfile currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
            </Route>

            {/* Rutas de Usuarios (Admin) */}
           <Route path="users" element={<PrivateRoute />}>
            <Route element={<RoleAccess roles={["ROLE_ADMIN"]} />} >
              <Route index element={<ListUser currentLang={lang} setCurrLang={handleSetLang} />} />
            </Route>
            <Route element={<RoleAccess roles={["ROLE_ADMIN"]} />}>
              <Route path="edit" element={<EditUser currentLang={lang} setCurrLang={handleSetLang} />} />
            </Route>
          </Route>

            {/* Rutas de Estadísticas (Admin) */}
            <Route path="statistics" element={<PrivateRoute />}>
              <Route element={<RoleAccess roles={["ROLE_ADMIN"]} />} >
                <Route index element={<Statistic currentLang={lang} setCurrLang={handleSetLang} />} />
              </Route>
            </Route>

          </Routes>
        </Fragment>
      </BrowserRouter>
    </div>
  );
}

export default App;