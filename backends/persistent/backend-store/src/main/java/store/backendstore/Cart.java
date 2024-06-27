package store.backendstore;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cart {
    /// The id
    @Id
    @Schema(example = "1")
    public String id;

    /// The user
    @Schema(example = "Juan")
    @Column(name = "usuario")
    public String usuario;

    /// The ISBN
    @Schema(example = "987654321")
    @Column(name = "isbn")
    public String isbn;

    /// The number of books
    @Schema(example = "10")
    @Column(name = "cantidad")
    public Integer cantidad;


}