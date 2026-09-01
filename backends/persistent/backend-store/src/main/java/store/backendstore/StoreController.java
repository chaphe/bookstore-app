package store.backendstore;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import store.backendstore.dto.AddCartRequest;
import store.backendstore.dto.BuyCartRequest;
import store.backendstore.dto.DeleteCartRequest;
import store.backendstore.mysqlservices.ICartService;
import store.backendstore.rabbitmq.MsjBroker;
import store.backendstore.rabbitmq.MsjBrokerItem;
import store.backendstore.rabbitmq.RabbitMQSender;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE })
@Validated
public class StoreController {

    @Autowired
    private ICartService service;

    @Autowired
    RabbitMQSender rabbitMQSender;

    public StoreController() {
    }

    @GetMapping("/getcart")
    public ResponseEntity<List<Cart>> GetCartUser(@RequestParam("usuario") String usuario) {
        List<Cart> booksList = service.GetCart(usuario);
        return new ResponseEntity<>(booksList, HttpStatus.OK);
    }

    @PostMapping("/addcart")
    public ResponseEntity<?> PostCart(@Valid @RequestBody AddCartRequest request) {
        service.AddCartUser(request.isbn(), request.usuario(), request.cantidad());
        return new ResponseEntity<>("{\"status\":\"OK\"}", HttpStatus.OK);
    }

    @DeleteMapping("/deletecart")
    public ResponseEntity<?> DeleteCart(@Valid @RequestBody DeleteCartRequest request) {
        service.DeleteCartUser(request.isbn(), request.usuario());
        return new ResponseEntity<>("{\"status\":\"OK\"}", HttpStatus.OK);
    }

    @PostMapping("/buycart")
    public ResponseEntity<?> BuyCart(@Valid @RequestBody BuyCartRequest request) {
        List<Cart> carrito = service.GetCart(request.usuario());
        List<MsjBrokerItem> items = carrito.stream()
                .map(c -> new MsjBrokerItem(c.isbn, c.cantidad))
                .collect(Collectors.toList());
        var SendMsj = rabbitMQSender.send(new MsjBroker(request.usuario(), items));
        if (SendMsj) {
            service.DeleteAllCartUser(request.usuario());
            return new ResponseEntity<>("{\"status\":\"OK\"}", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("{\"status\":\"ERROR\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
}