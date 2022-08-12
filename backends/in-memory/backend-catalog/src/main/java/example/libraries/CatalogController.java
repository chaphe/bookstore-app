package example.libraries;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", 
methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE })
public class CatalogController {


    private Hashtable<String, Book> books = new Hashtable<String, Book>();

    public CatalogController() {
    	initialize();
    }

    @GetMapping("/getlibros")
    public ResponseEntity<?> GetLibraries() {
    	List<Book> booksList = new ArrayList<Book>(books.values());
        return new ResponseEntity<List<Book>>(booksList, HttpStatus.OK);
    }

    @PostMapping("/agregarlibro")
    public ResponseEntity<?> PostLibrary(@RequestParam(value = "titulo") String titulo,
            @RequestParam(value = "ISBN") String iSBN, @RequestParam(value = "autor") String autor,
            @RequestParam(value = "resena") String reseña, @RequestParam(value = "valor") String valor,
            @RequestParam(value = "unidades") Integer unidades) {
    	
    	
    	Book newlibro = new Book(titulo, iSBN, autor, reseña, valor, unidades);
    	books.put(iSBN, newlibro);
    	
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @DeleteMapping("/deletelibro")
    public Map<String, HttpStatus> PostLibrary(@RequestParam(value = "ISBN") String iSBN) {
        var map = new HashMap<String, HttpStatus>();        
        Book removedBook = books.remove(iSBN);
        
        if (removedBook!=null)
            map.put("code", HttpStatus.OK);
        else
            map.put("code", HttpStatus.BAD_REQUEST);
    
        return map;
    }
    
    
    public void initialize() {
    	books = new Hashtable<String, Book>();
    	books.put("9789584276971", new Book("El milagro metabolico", "9789584276971", "Carlos Jaramillo", "En este libro, el célebre doctor Carlos Jaramillo ofrece respuestas contundentes a esas preguntas y plantea que la clave para un peso óptimo y una salud plena está en el metabolismo", "49", 10));
    	books.put("9789584295446", new Book("A fuego lento", "9789584295446", "Paula Hawkins", "El descubrimiento del cuerpo de un joven asesinado brutalmente en una casa flotante de Londres desencadena sospechas sobre tres mujeres. ", "59", 20));
    	books.put("9789585191426", new Book("Silence", "9789585191426", "Flor M. Salvador", "La confusión se ha disipado y ya no hay nada que perturbe la relación entre Patch y Nora", "55", 15));
    }
}
