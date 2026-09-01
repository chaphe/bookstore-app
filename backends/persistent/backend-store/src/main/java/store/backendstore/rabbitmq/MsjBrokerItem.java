package store.backendstore.rabbitmq;

public class MsjBrokerItem {
    public String isbn;
    public Integer cantidad;

    public MsjBrokerItem(String isbn, Integer cantidad) {
        this.isbn = isbn;
        this.cantidad = cantidad;
    }
}
