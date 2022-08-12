package store.backendstore.rabbitmq;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import store.backendstore.Cart;

@JsonIdentityInfo(generator = ObjectIdGenerators.None.class )
public class MsjBroker {
    public String usuario;
    public List<Cart> carrito;
    public MsjBroker(String usuario, List<Cart> carrito) {
        this.usuario = usuario;
        this.carrito = carrito;
    }
}
