package example.libraries.mysqlservices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import example.libraries.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    public void deleteByISBN(String isbn);
    public Book findBookByISBN(String isbn);
}
