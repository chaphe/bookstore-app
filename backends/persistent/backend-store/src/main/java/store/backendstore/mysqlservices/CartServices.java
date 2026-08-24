package store.backendstore.mysqlservices;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import store.backendstore.Cart;
import store.backendstore.CartId;

@Service
public class CartServices implements ICartService {
    @Autowired
    private CartRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<Cart> GetCart(String user) {
        return repo.findByUsuario(user);
    }

    @Override
    @Transactional
    public void AddCartUser(String isbn, String nameuser, int cantidad) {
        CartId id = new CartId(nameuser, isbn);
        Optional<Cart> existing = repo.findById(id);
        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setCantidad(cart.getCantidad() + cantidad);
            repo.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUsuario(nameuser);
            cart.setIsbn(isbn);
            cart.setCantidad(cantidad);
            repo.save(cart);
        }
    }

    @Override
    @Transactional
    public void DeleteCartUser(String isbn, String nameuser) {
        repo.deleteByUsuarioAndIsbn(nameuser, isbn);
    }

    @Override
    @Transactional
    public void DeleteAllCartUser(String nameuser) {
        repo.deleteByUsuario(nameuser);
    }
}