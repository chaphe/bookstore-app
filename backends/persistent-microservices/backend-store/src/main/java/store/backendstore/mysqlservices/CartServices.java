package store.backendstore.mysqlservices;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import store.backendstore.Cart;
//import store.backendstore.Usuario;

@Service
public class CartServices implements ICartService {
    @Autowired
    private CartRepository repo;

    /*
     * @Override
     * 
     * @Transactional(readOnly = true)
     * public List<Usuario> GetAll() {
     * return (List<Usuario>) repo.GetAllUser();
     * }
     */

    @Override
    public List<Cart> GetCart(String user) {
        return repo.GetCartUser(user);
    }

    @Override
    @Transactional(readOnly = false)
    public void AddCartUser(String isbn, String nameuser, int cantidad) {
        repo.addcart(isbn, nameuser, cantidad);
    }

    @Override
    @Transactional(readOnly = false)
    public void DeleteCartUser(String isbn, String nameuser) {
        repo.deleteCart(isbn, nameuser);
    }

    @Override
    @Transactional(readOnly = false)
    public void DeleteAllCartUser(String nameuser) {
        repo.deleteAllCart(nameuser);
    }

}
