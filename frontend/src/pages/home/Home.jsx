import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./home.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como propiedades
const Home = ({ currentLang, setCurrLang }) => {
  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  return (
    <div className="single">
      {/* Pasamos el idioma al Sidebar */}
      <Sidebar currentLang={currentLang} />
      
      <div className="singleContainer">
        {/* Pasamos el idioma y la función para cambiarlo al Navbar (donde está tu botón de idioma) */}
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        
        <div className="bottom">
          {/* Título de la página traducido */}
          <h1 className="title">{t.home || "Home"}</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;