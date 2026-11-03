import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import HttpService from "../../services/HttpService";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./user.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como props
const EditUser = ({ currentLang, setCurrLang }) => {
  const { state } = useLocation();

  const [isAdmin, setIsAdmin] = useState(
    state?.roles?.find((r) => r.type === "ROLE_ADMIN") !== undefined
  );

  const defaultValues = {
    id: state?.id || "",
    firstName: state?.firstName || "",
    lastName: state?.lastName || "",
    username: state?.username || "",
    password: state?.password || "",
    roles: state?.roles?.map((r) => r.type) || [],
  };
  
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaultValues);
  const { enqueueSnackbar } = useSnackbar();

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsAdmin(checked);
    setFormValues({
      ...formValues,
      [name]: checked ? ["ROLE_ADMIN"] : [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    HttpService.putWithAuth("/users", formValues)
      .then((response) => {
        enqueueSnackbar(t.userUpdatedSuccess || "User updated successfully", { variant: "success" });
        navigate("/users");
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
  };

  return (
    <div className="single">
      {/* Pasamos el idioma al Sidebar */}
      <Sidebar currentLang={currentLang} />
      
      <div className="singleContainer">
        {/* Pasamos el idioma y la función para cambiarlo al Navbar */}
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        
        <div className="bottom">
          {/* Título traducido */}
          <h1 className="title">{t.editUserTitle || "Edit User"}</h1>
          
          <form onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="left"
              direction="column"
              spacing={2}
            >
              <Grid item>
                <TextField
                  sx={{ width: 240 }}
                  required
                  autoFocus
                  id="firstName"
                  name="firstName"
                  label={t.firstNameLabel || "First Name"}
                  type="text"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  sx={{ width: 240 }}
                  required
                  id="lastName"
                  name="lastName"
                  label={t.lastNameLabel || "Last Name"}
                  type="text"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            
            <Grid item sx={{ mt: 2 }}>
              <FormControlLabel
                label={t.roleAdminLabel || "Role Admin?"}
                control={
                  <Checkbox
                    name="roles"
                    checked={isAdmin}
                    onChange={handleCheckboxChange}
                  />
                }
              />
            </Grid>
            
            <Stack spacing={2} sx={{ py: 3, paddingRight: 0 }} direction="row">
              <Button
                sx={{ minWidth: 112 }}
                variant="outlined"
                onClick={() => navigate("/users")}
              >
                {t.cancelButton || "Cancel"}
              </Button>
              <Button sx={{ minWidth: 112 }} type="submit" variant="contained">
                {t.saveButton || "Save"}
              </Button>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;