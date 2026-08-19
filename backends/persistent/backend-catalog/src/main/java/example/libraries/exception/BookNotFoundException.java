package example.libraries.exception;

public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(String isbn) {
        super("Libro con ISBN " + isbn + " no encontrado");
    }
}