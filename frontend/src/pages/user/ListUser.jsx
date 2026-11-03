import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const ListUser = ({ currentLang, setCurrLang }) => {
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // 3. Seleccionas el diccionario activo (por defecto 'es')
  const t = translations[currentLang || "es"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    HttpService.getWithAuth("/users")
      .then((response) => {
        setRows(response.data.content);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setRows([]);
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

  return (
    <div className="single">
      {/* Pasamos currentLang al Sidebar */}
      <Sidebar currentLang={currentLang} />
      
      <div className="singleContainer">
        {/* Pasamos currentLang y setCurrLang al Navbar */}
        <Navbar currentLang={currentLang} setCurrLang={setCurrLang} />
        
        <div className="bottom">
          {/* Título traducido */}
          <h1 className="title">{t.usersTitle || "Users"}</h1>
          
          <div className="listContainer">
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 30 }} />
                    <TableCell style={{ width: 100 }}>{t.idHeader || "Id"}</TableCell>
                    <TableCell style={{ flex: 1 }}>{t.firstNameHeader || "First Name"}</TableCell>
                    <TableCell style={{ flex: 1 }}>{t.lastNameHeader || "Last Name"}</TableCell>
                    <TableCell style={{ flex: 1 }}>{t.usernameHeader || "Username"}</TableCell>
                    <TableCell style={{ flex: 0, width: 100 }}>
                      {t.actionHeader || "Action"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.id} row={row} currentLang={currentLang} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUser;

function Row(props) {
  const { row, currentLang } = props;
  const [open, setOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Diccionario local para el componente Row
  const t = translations[currentLang || "es"];

  useEffect(() => {
    if (open && id) {
      HttpService.getWithAuth("/pets/users/" + id)
        .then((response) => {
          setPets(response.data);
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setPets([]);
          } else if (error.response?.data?.errors) {
            error.response?.data?.errors.map((e) =>
              enqueueSnackbar(e.field + " " + e.message, { variant: "error" })
            );
          } else if (error.response?.data?.message) {
            enqueueSnackbar(error.response?.data?.message, {
              variant: "error",
            });
          } else {
            enqueueSnackbar(error.message, { variant: "error" });
          }
        });
    }
  }, [open, id]);

  const handleExpand = (userId) => {
    setId(userId);
    setOpen(!open);
  };

  const handleEdit = (rowData) => {
    navigate("/users/edit", { state: rowData });
  };

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleExpand(row.id)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.firstName}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.lastName}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.username}
        </TableCell>
        <TableCell component="th" scope="row">
          <div className="editButton" onClick={() => handleEdit(row)}>
            {t.editAction || "Edit"}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* Título de la tabla expandida traducido */}
              <h1 className="title" style={{ marginBottom: 0, paddingTop: 10 }}>
                {t.petsOfUserTitle || "Pets of the User"}
              </h1>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>{t.petNameHeader || "Name"}</TableCell>
                    <TableCell>{t.petTypeHeader || "Type"}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell component="th" scope="row">
                        {pet.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {pet.type.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}