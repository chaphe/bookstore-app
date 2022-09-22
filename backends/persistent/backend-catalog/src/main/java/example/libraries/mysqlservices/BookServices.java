package example.libraries.mysqlservices;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import example.libraries.Book;

@Service
public class BookServices implements IbookService {
    @Autowired
    private BookRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<Book> GetAll() {
        return (List<Book>) repo.findAll();
    }

//    @Override
//    @Transactional(readOnly = false)
//    public void Insert(String iSBN, String titulo, String autor, String descripcion, String valor, Integer unidades) {
//        repo.Insert(iSBN, titulo, autor, descripcion, valor, unidades);
//    }

    @Override
    @Transactional(readOnly = false)
    public void Delete(String isbn) {
        repo.deleteByISBN(isbn);
    }

    @Override
    public Book saveBook(Book book) {
        return repo.save(book);
    }

    @Override
    public Book updateBook(Book book) {
        var bookToUpdate = repo.findBookByISBN(book.getISBN());
        bookToUpdate.setAutor(book.getAutor());
        bookToUpdate.setDescripcion(book.getDescripcion());
        bookToUpdate.setTitulo(book.getTitulo());
        bookToUpdate.setUnidades(book.getUnidades());
        bookToUpdate.setValor(book.getValor());
        return repo.save(bookToUpdate);
    }

}
