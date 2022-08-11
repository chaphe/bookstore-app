package store.backendstore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart")
@AllArgsConstructor
@Getter
@Setter
public class Cart {
    @Id
    public String id;

    @Column(name = "usuario")
    public String usuario;

    @Column(name = "isbn")
    public String isbn;

    @Column(name = "cantidad")
    public Integer cantidad;

    public Cart(){
    }
}
