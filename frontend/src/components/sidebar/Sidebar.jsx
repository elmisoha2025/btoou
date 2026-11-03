import { Home } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PetsIcon from "@mui/icons-material/Pets";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import AuthService from "../../services/AuthService";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./sidebar.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang como propiedad desde el componente padre
const Sidebar = ({ currentLang }) => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const userRoles = AuthService.getCurrentUser()?.roles || [];
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img className="companyLogo" />
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          {/* Títulos y textos traducidos */}
          <p className="title">{t.mainTitle || "MAIN"}</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <Home className="icon" />
              <span>{t.home || "Home"}</span>
            </li>
          </Link>
          
          {isAdmin && (
            <div>
              <p className="title">{t.adminTitle || "ADMIN"}</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span onClick={() => navigate("/users")}>{t.users || "Users"}</span>
                </li>
              </Link>
              <Link to="/statistics" style={{ textDecoration: "none" }}>
                <li>
                  <InsertChartIcon className="icon" />
                  <span>{t.statistics || "Statistics"}</span>
                </li>
              </Link>
            </div>
          )}
          
          <p className="title">{t.userTitle || "USER"}</p>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>{t.profile || "Profile"}</span>
            </li>
          </Link>
          <Link to="/pets" style={{ textDecoration: "none" }}>
            <li>
              <PetsIcon className="icon" />
              <span>{t.myPets || "My Pets"}</span>
            </li>
          </Link>
          <Link
            to="/login"
            onClick={() => AuthService.logout()}
            style={{ textDecoration: "none" }}
          >
            <li>
              <ExitToAppIcon className="icon" />
              <span>{t.logout || "Logout"}</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;