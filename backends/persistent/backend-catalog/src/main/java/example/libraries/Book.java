package example.libraries;

import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "Book")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "Book", description = "Book entity")
public class Book {

    @Id
    @JsonProperty("ISBN")
    @Schema(example = "9789585579668")
    @Column(name = "ISBN")
    private String ISBN;

    @Schema(example = "Foundation")
    @Column(name = "titulo")
    private String titulo;

    @Schema(example = "Isaac Asimov")
    @Column(name = "autor")
    private String autor;

    @Schema(example = "The Foundation series is a science fiction book series written by American author Isaac Asimov.")
    @Column(name = "descripcion")
    private String descripcion;

    @Schema(example = "$12.99")
    @Column(name = "valor")
    private String valor;

    @Schema(example = "10")
    @Column(name = "unidades")
    private Integer unidades;

}