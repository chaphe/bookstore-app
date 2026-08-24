package store.backendstore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cart")
@IdClass(CartId.class)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cart {
    @Id
    @Schema(example = "usuario1")
    @Column(name = "usuario")
    public String usuario;

    @Id
    @Schema(example = "9789584295446")
    @Column(name = "isbn")
    public String isbn;

    @Schema(example = "2")
    @Column(name = "cantidad")
    public Integer cantidad;
}