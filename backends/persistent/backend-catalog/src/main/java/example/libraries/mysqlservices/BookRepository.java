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
//    @Query(value = "CALL GetAllBooks()", nativeQuery = true)
//    public List<Book> GetAll();
//
//    @Modifying
//    // @Query(value = "CALL AddOrUpdateBook(\n-- #book.titulo\n,\n--
//    // #book.isbn\n,\n-- #book.autor\n,\n-- #book.descripcion\n,\n--
//    // #book.valor\n,\n-- #book.unidades\n)", nativeQuery = true)
//    @Query(value = "CALL AddOrUpdateBook(:titulo, :isbn, :autor, :descripcion, :valor, :unidades)", nativeQuery = true)
//    public void Insert(@Param("isbn") String isbn, @Param("titulo") String titulo, @Param("autor") String autor,
//            @Param("descripcion") String descripcion, @Param("valor") String valor,
//            @Param("unidades") Integer unidades);
//
//    @Modifying
//    @Query(value = "CALL DeleteBook(:isbn)", nativeQuery = true)
//    public void DeletebyISBN(@Param("isbn") String isbn);

    public List<Book> findAll();

//    public void DeleteByISBN(String isbn);

    public void deleteByISBN(String isbn);
    public Book save(Book book);

//    @Modifying
//    @Query("UPDATE Book b SET b.titulo = :titulo, b.autor = :autor, b.descripcion = :descripcion, b.valor = :valor, b.unidades = :unidades WHERE b.ISBN = :isbn")
//    public Book updateBook(Book book);

    public Book findBookByISBN(String isbn);
}
