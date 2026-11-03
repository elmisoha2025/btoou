import {
  Button,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import HttpService from "../../services/HttpService";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";
import "./pet.scss";

const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como props
const EditPet = ({ currentLang, setCurrLang }) => {
  const { state } = useLocation();
  const defaultValues = {
    id: state?.id || "",
    name: state?.name || "",
    typeId: state?.type?.id || "",
    userId: state?.user?.id || "",
  };
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(defaultValues);
  const [types, setTypes] = useState([]);

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  useEffect(() => {
    const getTypes = async () => {
      try {
        const response = await HttpService.getWithAuth("/types");
        const typesData = await response.data.content;
        setTypes(typesData);
      } catch (error) {
        console.error("Error fetching types", error);
      }
    };
    getTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    HttpService.putWithAuth("/pets", formValues)
      .then((response) => {
        enqueueSnackbar(t.petUpdatedSuccess || "Pet updated successfully", { variant: "success" });
        navigate("/pets");
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
          {/* Título de la página traducido */}
          <h1 className="title">{t.editPetTitle || "Edit Pet"}</h1>
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
                  autoFocus
                  required
                  id="name"
                  name="name"
                  label={t.petNameLabel || "Name"}
                  type="text"
                  value={formValues.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <FormControl sx={{ width: 240 }}>
                  <InputLabel id="demo-select-small">{t.petTypeLabel || "Type"}</InputLabel>
                  <Select
                    required
                    name="typeId"
                    label={t.petTypeLabel || "Type"}
                    value={formValues.typeId}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">
                      <em>{t.noneOption || "------------ none ------------"}</em>
                    </MenuItem>
                    {types.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Stack spacing={2} sx={{ py: 3, paddingRight: 0 }} direction="row">
              <Button
                sx={{ minWidth: 112 }}
                variant="outlined"
                onClick={() => navigate("/pets")}
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

export default EditPet;