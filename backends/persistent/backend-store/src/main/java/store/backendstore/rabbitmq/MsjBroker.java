package store.backendstore.rabbitmq;

import java.util.List;

public class MsjBroker {
    public String usuario;
    public List<MsjBrokerItem> carrito;

    public MsjBroker(String usuario, List<MsjBrokerItem> carrito) {
        this.usuario = usuario;
        this.carrito = carrito;
    }
}
