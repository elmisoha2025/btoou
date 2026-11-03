import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import AuthService from "../../services/AuthService";
import HttpService from "../../services/HttpService";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./profile.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como props
const Profile = ({ currentLang, setCurrLang }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  useEffect(() => {
    const userId = AuthService.getCurrentUser()?.id;
    HttpService.getWithAuth("/users/" + userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          error.response?.data?.errors.map((e) =>
            enqueueSnackbar(e.field + " " + e.message, { variant: "error" })
          );
        } else if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, { variant: "error" });
        } else {
          enqueueSnackbar(error.message, { variant: "error" });
        }
      });
  }, [enqueueSnackbar]);

  const handleEdit = () => {
    navigate("/profile/edit", { state: user });
  };

  return (
    <div className="single">
      {/* Pasamos currentLang al Sidebar */}
      <Sidebar currentLang={currentLang} />
      
      <div className="singleContainer">
        {/* Pasamos currentLang y setCurrLang al Navbar */}
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={() => handleEdit()}>
              {t.editButton || "Edit"}
            </div>
            
            {/* Título traducido */}
            <h1 className="title">{t.profileTitle || "Profile"}</h1>
            
            <div className="item">
              <img
                src={`${process.env.PUBLIC_URL}/profile.png`}
                alt="user"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{user.fullName}</h1>
                <div className="detailItem">
                  {/* Etiqueta de Username traducida */}
                  <span className="itemKey">{t.usernameLabelField || "Username:"}</span>
                  <span className="itemValue">{user.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;