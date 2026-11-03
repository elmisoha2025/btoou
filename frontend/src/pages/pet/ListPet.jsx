import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Datatable from "../../components/datatable/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import AuthService from "../../services/AuthService";
import HttpService from "../../services/HttpService";
import { petColumns } from "./fields";

// 1. Importas tus archivos de traducción
import esTranslations from "../../locales/es.json";
import enTranslations from "../../locales/en.json";


const translations = {
  es: esTranslations,
  en: enTranslations
};

// 2. Recibes currentLang y setCurrLang como props
const ListPet = ({ currentLang, setCurrLang }) => {
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const userId = AuthService.getCurrentUser()?.id;
    HttpService.getWithAuth("/pets/users/" + userId)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setData([]);
        } else if (error.response?.data?.errors) {
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

  const handleEdit = (params) => {
    navigate("/pets/edit", { state: params.row });
  };

  const handleClickOpen = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    HttpService.deleteWithAuth("/pets/" + id)
      .then((res) => {
        fetchData();
        setOpen(false);
        enqueueSnackbar(t.petDeletedSuccess|| "Pet is deleted successfully", { variant: "success" });
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

  // Traducción de la columna de acciones dentro de la tabla
  const actionColumn = [
    {
      field: "action",
      headerName: t.actionHeader || "Action",
      headerAlign: "left",
      align: "left",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className="editButton" onClick={() => handleEdit(params)}>
              {t.editAction || "Edit"}
            </div>
            <div
              className="deleteButton"
              onClick={() => handleClickOpen(params.row.id)}
            >
              {t.deleteAction || "Delete"}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="list">
      {/* Pasamos el idioma al Sidebar y Navbar */}
      <Sidebar currentLang={currentLang} />
      <div className="listContainer">
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        <Datatable
          title={t.myPetsTitle || "My Pets"}
          userColumns={petColumns}
          actionColumn={actionColumn}
          data={data}
          to={"/pets/new"}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t.deletePetTitle || "Delete pet?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t.deletePetDesc || "Are you sure to delete record?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t.cancelButton || "Cancel"}</Button>
          <Button onClick={handleDelete} autoFocus>
            {t.deleteButton || "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListPet;