import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  styled,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React from "react";
import axios from "axios";
const host = process.env.REACT_APP_CATALOG_URL;

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

export default function Main() {
  interface Libro {
    titulo: string;
    autor: string;
    descripcion: string;
    valor: string;
    unidades: number;
    isbn: string;
  }

  const [libros, setLibros] = React.useState<Libro[]>([]);

  const getLibros = async () => {
    const response = await fetch(host + "/getlibros");
    const data = await response.json();
    setLibros(data);
  };

  React.useEffect(() => {
    getLibros();
  }, []);

  // Agregar libro
  function AgregarLibro() {
    handleClickOpenAgregar();
  }

  function guardarNuevoLibro() {
    handleCloseAgregar();
    axios
      .post(host +"/libro", libroNuevo)
      .then((res) => {
        getLibros();
      });
  }

  const [openAgregar, setOpenAgregar] = React.useState(false);

  const handleClickOpenAgregar = () => {
    setLibroNuevo({
      titulo: "",
      autor: "",
      descripcion: "",
      valor: "",
      unidades: 0,
      isbn: "",
    });
    setOpenAgregar(true);
  };

  const handleCloseAgregar = () => {
    setOpenAgregar(false);
  };

  const [libroNuevo, setLibroNuevo] = React.useState<Libro>({
    titulo: "",
    autor: "",
    descripcion: "",
    valor: "",
    unidades: 0,
    isbn: "",
  });

  //Editar libro

  const [openEditar, setOpenEditar] = React.useState(false);

  const handleClickOpenEditar = () => {
    setOpenEditar(true);
  };

  const handleCloseEditar = () => {
    setOpenEditar(false);
  };

  function EditarLibro(libro: Libro) {
    setLibroNuevo(libro);
    handleClickOpenEditar();
  }

  function guardarLibroEditado() {
    handleCloseEditar();
    axios.put(host + "/libro", libroNuevo).then((res) => {
      getLibros();
    });
  }

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function eliminarLibro() {
    setOpenDelete(false);
    axios.delete(host + `/deletelibro?ISBN=${libroNuevo.isbn}`).then((res) => {
      setLibros(libros.filter((libro) => libro.isbn !== libroNuevo.isbn));
    });
  }

  function confirmarEliminarLibro(isbn: string) {
    setLibroNuevo(libros.filter((libro) => libro.isbn === isbn)[0]);
    handleClickOpenDelete();
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            color="primary"
            onClick={AgregarLibro}
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
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, isbn: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="titulo"
                label="Titulo"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, titulo: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="autor"
                label="Autor"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, autor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="descripcion"
                label="Descripcion"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, descripcion: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="valor"
                label="Valor"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, valor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="unidades"
                label="Unidades"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: string; }; }) =>
                  setLibroNuevo({
                    ...libroNuevo,
                    unidades: parseInt(e.target.value),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAgregar}>Cancelar</Button>
              <Button onClick={() => guardarNuevoLibro()}>Guardar</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openEditar} onClose={handleClickOpenEditar}>
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
                value={libroNuevo.isbn}
                type="text"
                fullWidth
                variant="standard"
                disabled
              />
              <TextField
                autoFocus
                margin="dense"
                id="titulo"
                label="Titulo"
                value={libroNuevo.titulo}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, titulo: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="autor"
                label="Autor"
                value={libroNuevo.autor}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, autor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="descripcion"
                label="Descripcion"
                value={libroNuevo.descripcion}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, descripcion: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="valor"
                label="Valor"
                value={libroNuevo.valor}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: any; }; }) =>
                  setLibroNuevo({ ...libroNuevo, valor: e.target.value })
                }
              />
              <TextField
                margin="dense"
                id="unidades"
                label="Unidades"
                value={libroNuevo.unidades}
                type="text"
                fullWidth
                variant="standard"
                onChange={(e: { target: { value: string; }; }) =>
                  setLibroNuevo({
                    ...libroNuevo,
                    unidades: parseInt(e.target.value),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditar}>Cancelar</Button>
              <Button onClick={() => guardarLibroEditado()}>Guardar</Button>
            </DialogActions>
          </Dialog>
          <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Eliminar libro
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Esta seguro que desea eliminar el libro {libroNuevo.titulo}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button onClick={ eliminarLibro }>Eliminar</Button>
        </DialogActions>
      </Dialog>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" width="250px">
                    Titulo
                  </StyledTableCell>
                  <StyledTableCell align="center">Autor</StyledTableCell>
                  <StyledTableCell align="center">Decripción</StyledTableCell>
                  <StyledTableCell align="center">Valor</StyledTableCell>
                  <StyledTableCell align="center">Unidades</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {libros.map((libro) => (
                  <StyledTableRow
                    key={libro.isbn}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
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
                        onClick={() => {
                          EditarLibro(libro);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          confirmarEliminarLibro(libro.isbn);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </>
  );
}
