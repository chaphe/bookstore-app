package example.libraries;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class Book {    

    private String titulo, ISBN, autor, descripcion, valor;
    private Integer unidades;
}
