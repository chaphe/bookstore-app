package store.backendstore.mysqlservices;

import java.util.List;

import store.backendstore.Cart;
//import store.backendstore.Usuario;

public interface ICartService {
    public List<Cart> GetCart(String user);
    public void AddCartUser(String isbn, String nameuser,int cantidad);
    public void DeleteCartUser(String isbn, String nameuser);
    public void DeleteAllCartUser(String username);
}
