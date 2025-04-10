package example.libraries.mysqlservices;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import example.libraries.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    public List<Book> findAll();
    public void deleteByISBN(String isbn);
    public Book save(Book book);
    public Book findBookByISBN(String isbn);
}
