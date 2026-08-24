import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  tableCellClasses,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React from "react";
import axios from "axios";
import Libro from "../models/Libro";

// Runtime config: env variable (build-time) -> window.env (runtime Docker) -> default
declare global {
  interface Window {
    env?: {
      CATALOG_URL?: string;
    };
  }
}
const runtimeCatalogUrl = (typeof window !== 'undefined' && window.env?.CATALOG_URL)
  ? window.env.CATALOG_URL
  : null;
const host = process.env.REACT_APP_CATALOG_URL || runtimeCatalogUrl || "http://localhost:8081/api";

const libroVacio: Libro = {
  titulo: "",
  autor: "",
  descripcion: "",
  valor: "",
  unidades: 0,
  isbn: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

export default function Main() {
  const [libros, setLibros] = React.useState<Libro[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [libroForm, setLibroForm] = React.useState<Libro>(libroVacio);

  const [openAgregar, setOpenAgregar] = React.useState(false);
  const [openEditar, setOpenEditar] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const mostrarMensaje = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const cerrarMensaje = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getLibros = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Libro[]>(host + "/getlibros");
      setLibros(response.data);
    } catch (error) {
      mostrarMensaje(
        "No se pudieron cargar los libros. Verifique que el backend este activo.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getLibros();
  }, []);

  const validarLibro = (libro: Libro): string | null => {
    if (!libro.isbn.trim()) return "El ISBN es requerido";
    if (!libro.titulo.trim()) return "El titulo es requerido";
    if (!libro.autor.trim()) return "El autor es requerido";
    if (!libro.descripcion.trim()) return "La descripcion es requerida";
    if (libro.valor === "" || isNaN(Number(libro.valor)) || Number(libro.valor) <= 0)
      return "El valor debe ser un numero mayor que 0";
    if (!Number.isInteger(libro.unidades) || libro.unidades < 0)
      return "Las unidades deben ser un entero mayor o igual que 0";
    return null;
  };

  const handleClickOpenAgregar = () => {
    setLibroForm(libroVacio);
    setOpenAgregar(true);
  };

  const handleCloseAgregar = () => {
    setOpenAgregar(false);
  };

  function guardarNuevoLibro() {
    const error = validarLibro(libroForm);
    if (error) {
      mostrarMensaje(error, "error");
      return;
    }
    axios
      .post(host + "/libro", libroForm)
      .then(() => {
        handleCloseAgregar();
        getLibros();
        mostrarMensaje("Libro agregado correctamente", "success");
      })
      .catch(() => {
        mostrarMensaje("No se pudo agregar el libro", "error");
      });
  }

  const handleCloseEditar = () => {
    setOpenEditar(false);
  };

  function EditarLibro(libro: Libro) {
    setLibroForm(libro);
    setOpenEditar(true);
  }

  function guardarLibroEditado() {
    const error = validarLibro(libroForm);
    if (error) {
      mostrarMensaje(error, "error");
      return;
    }
    axios
      .put(host + "/libro", libroForm)
      .then(() => {
        handleCloseEditar();
        getLibros();
        mostrarMensaje("Libro actualizado correctamente", "success");
      })
      .catch(() => {
        mostrarMensaje("No se pudo actualizar el libro", "error");
      });
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function eliminarLibro() {
    handleCloseDelete();
    axios
      .delete(host + `/deletelibro?ISBN=${libroForm.isbn}`)
      .then(() => {
        getLibros();
        mostrarMensaje("Libro eliminado correctamente", "success");
      })
      .catch(() => {
        mostrarMensaje("No se pudo eliminar el libro", "error");
      });
  }

  function confirmarEliminarLibro(isbn: string) {
    const libro = libros.find((l) => l.isbn === isbn);
    if (libro) setLibroForm(libro);
    setOpenDelete(true);
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenAgregar}
            sx={{
              marginTop: 4,
              marginBottom: 1,
            }}
          >
            Agregar libro
          </Button>
          <Dialog open={openAgregar} onClose={handleCloseAgregar}>
            <DialogTitle>Agregar libro</DialogTitle>
            <DialogContent>
              <DialogContentText>
                A continuacion, ingrese los datos del libro a agregar.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="isbn"
                label="Isbn"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, isbn: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="titulo"
                label="Titulo"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, titulo: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="autor"
                label="Autor"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, autor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="descripcion"
                label="Descripcion"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, descripcion: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="valor"
                label="Valor"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, valor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="unidades"
                label="Unidades"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({
                    ...libroForm,
                    unidades: parseInt(e.target.value) || 0,
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAgregar}>Cancelar</Button>
              <Button onClick={() => guardarNuevoLibro()}>Guardar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openEditar} onClose={handleCloseEditar}>
            <DialogTitle>Editar libro</DialogTitle>
            <DialogContent>
              <DialogContentText>
                A continuacion, ingrese los datos del libro a editar.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="isbn"
                label="Isbn"
                value={libroForm.isbn}
                type="text"
                fullWidth
                variant="standard"
                disabled
              />
              <TextField
                margin="dense"
                id="titulo"
                label="Titulo"
                value={libroForm.titulo}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, titulo: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="autor"
                label="Autor"
                value={libroForm.autor}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, autor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="descripcion"
                label="Descripcion"
                value={libroForm.descripcion}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, descripcion: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="valor"
                label="Valor"
                value={libroForm.valor}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({ ...libroForm, valor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="unidades"
                label="Unidades"
                value={libroForm.unidades}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setLibroForm({
                    ...libroForm,
                    unidades: parseInt(e.target.value) || 0,
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditar}>Cancelar</Button>
              <Button onClick={() => guardarLibroEditado()}>Guardar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDelete} onClose={handleCloseDelete}>
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              Eliminar libro
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Esta seguro que desea eliminar el libro {libroForm.titulo}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseDelete}>
                Cancel
              </Button>
              <Button onClick={eliminarLibro}>Eliminar</Button>
            </DialogActions>
          </Dialog>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ISBN</StyledTableCell>
                  <StyledTableCell align="center">Titulo</StyledTableCell>
                  <StyledTableCell align="center">Autor</StyledTableCell>
                  <StyledTableCell align="center">Descripcion</StyledTableCell>
                  <StyledTableCell align="center">Valor</StyledTableCell>
                  <StyledTableCell align="center">Unidades</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <StyledTableCell colSpan={7} align="center">
                      <CircularProgress size={30} />
                    </StyledTableCell>
                  </TableRow>
                ) : libros.length === 0 ? (
                  <TableRow>
                    <StyledTableCell colSpan={7} align="center">
                      <Typography variant="body1">
                        No hay libros en el catalogo.
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                ) : (
                  libros.map((libro) => (
                    <StyledTableRow key={libro.isbn}>
                      <StyledTableCell align="center">
                        {libro.isbn}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {libro.titulo}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {libro.autor}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {libro.descripcion}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {libro.valor}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {libro.unidades}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton
                          aria-label="editar"
                          onClick={() => EditarLibro(libro)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="eliminar"
                          onClick={() => confirmarEliminarLibro(libro.isbn)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={cerrarMensaje}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={cerrarMensaje}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}