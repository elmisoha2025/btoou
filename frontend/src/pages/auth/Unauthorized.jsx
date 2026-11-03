import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./auth.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como props
const Unauthorized = ({ currentLang, setCurrLang }) => {
  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  return (
    <div className="single">
      {/* Pasamos el idioma al Sidebar */}
      <Sidebar currentLang={currentLang} />
      
      <div className="singleContainer">
        {/* Pasamos el idioma y la función para cambiarlo al Navbar */}
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        
        <div className="bottom">
          {/* Título traducido */}
          <h1 className="title">{t.unauthorizedTitle || "Unauthorized"}</h1>
          
          {/* Mensaje traducido */}
          <p>{t.unauthorizedDesc || "You are not authorized to view this page"}</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;