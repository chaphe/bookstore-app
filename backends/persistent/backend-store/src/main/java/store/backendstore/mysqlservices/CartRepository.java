package store.backendstore.mysqlservices;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import store.backendstore.Cart;
import store.backendstore.CartId;

@Repository
public interface CartRepository extends CrudRepository<Cart, CartId> {
    List<Cart> findByUsuario(String usuario);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.usuario = :usuario AND c.isbn = :isbn")
    void deleteByUsuarioAndIsbn(@Param("usuario") String usuario, @Param("isbn") String isbn);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.usuario = :usuario")
    void deleteByUsuario(@Param("usuario") String usuario);
}