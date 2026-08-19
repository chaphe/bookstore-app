package example.libraries.mysqlservices;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import example.libraries.Book;
import example.libraries.exception.BookNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServicesTest {

    @Mock
    private BookRepository repo;

    @InjectMocks
    private BookServices services;

    private Book book(String isbn, String titulo, String autor, String descripcion, String valor, Integer unidades) {
        return new Book(isbn, titulo, autor, descripcion, valor, unidades);
    }

    @Test
    void updateBookWithNonExistingIsbnThrowsBookNotFoundException() {
        String isbn = "9789585579668";
        Book book = book(isbn, "Foundation", "Isaac Asimov", "desc", "12.99", 10);

        when(repo.findBookByISBN(isbn)).thenReturn(null);

        assertThrows(BookNotFoundException.class, () -> services.updateBook(book));

        verify(repo, never()).save(any(Book.class));
    }

    @Test
    void updateBookWithExistingIsbnUpdatesFieldsAndSaves() {
        String isbn = "9789585579668";
        Book existing = book(isbn, "old title", "old autor", "old desc", "1", 1);
        Book book = book(isbn, "Foundation", "Isaac Asimov", "desc", "12.99", 10);

        when(repo.findBookByISBN(isbn)).thenReturn(existing);
        when(repo.save(existing)).thenReturn(existing);

        Book result = services.updateBook(book);

        assertEquals("Foundation", result.getTitulo());
        assertEquals("Isaac Asimov", result.getAutor());
        assertEquals("desc", result.getDescripcion());
        assertEquals("12.99", result.getValor());
        assertEquals(10, result.getUnidades());
        verify(repo).save(existing);
    }

    @Test
    void deleteWithNonExistingIsbnThrowsBookNotFoundException() {
        String isbn = "9789585579668";

        when(repo.existsById(isbn)).thenReturn(false);

        assertThrows(BookNotFoundException.class, () -> services.Delete(isbn));

        verify(repo, never()).deleteByISBN(isbn);
    }

    @Test
    void deleteWithExistingIsbnDeletesBook() {
        String isbn = "9789585579668";

        when(repo.existsById(isbn)).thenReturn(true);

        services.Delete(isbn);

        verify(repo).deleteByISBN(isbn);
    }
}