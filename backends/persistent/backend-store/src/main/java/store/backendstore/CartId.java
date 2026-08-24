package store.backendstore;

import java.io.Serializable;
import java.util.Objects;

public class CartId implements Serializable {
    private String usuario;
    private String isbn;

    public CartId() {}

    public CartId(String usuario, String isbn) {
        this.usuario = usuario;
        this.isbn = isbn;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartId cartId = (CartId) o;
        return Objects.equals(usuario, cartId.usuario) && Objects.equals(isbn, cartId.isbn);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, isbn);
    }
}