import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Tooltip, Button } from "@mui/material";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import AuthService from "../../services/AuthService";

// 1. Importas tus archivos JSON de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./navbar.scss";

// 2. Mapeas los diccionarios
const translations = {
  es: esTranslations,
  en: enTranslations
};

// 3. Recibes currentLang y setCurrLang como propiedades
const Navbar = ({ currentLang, setCurrLang }) => {
  const { dispatch } = useContext(DarkModeContext);
  const username = AuthService.getCurrentUser()?.username;

  // 4. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  // 5. Función para alternar el idioma y guardarlo en el navegador
  const toggleLanguage = () => {
    const nextLang = currentLang === "es" ? "en" : "es";
    setCurrLang(nextLang);
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <div className="wrapper">
          <div className="search">
            {/* Texto traducido para el buscador */}
            <input type="text" placeholder={t.search || "Search..."} />
            <SearchOutlinedIcon />
          </div>
          <div className="items">
            
            {/* Botón para cambiar el idioma (Muestra "EN" si estás en español, o "ES" si estás en inglés) */}
            <div className="item">
              <Button 
                variant="outlined" 
                size="small" 
                onClick={toggleLanguage}
                sx={{ textTransform: "none", minWidth: "45px", fontWeight: "bold" }}
              >
                {currentLang === "es" ? "EN" : "ES"}
              </Button>
            </div>

            <div className="item">
              <DarkModeOutlinedIcon
                className="icon"
                onClick={() => dispatch({ type: "TOGGLE" })}
              />
            </div>
            <div className="item">
              <Tooltip title={username} placement="bottom-end">
                <img
                  src={`${process.env.PUBLIC_URL}/avatar.png`}
                  alt="avatar"
                  className="itemImg"
                  width={30}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;