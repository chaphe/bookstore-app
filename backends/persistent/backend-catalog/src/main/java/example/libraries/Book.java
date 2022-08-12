package example.libraries;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Entity
@Table(name = "Book")
@AllArgsConstructor
@Getter
public class Book {

    @Id
    @Column(name="ISBN")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String ISBN;

    @Column(name="titulo")
    private String titulo;

    @Column(name="autor")
    private String autor;

    @Column(name="descripcion")
    private String descripcion;

    @Column(name="valor")
    private String valor;

    @Column(name="unidades")
    private Integer unidades;

    public Book(){}
}
