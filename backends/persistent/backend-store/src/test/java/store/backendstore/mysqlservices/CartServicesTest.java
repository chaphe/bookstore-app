package store.backendstore.mysqlservices;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import store.backendstore.Cart;
import store.backendstore.CartId;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.argThat;

@ExtendWith(MockitoExtension.class)
class CartServicesTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartServices cartServices;

    private Cart sampleCart;
    private CartId sampleCartId;

    @BeforeEach
    void setUp() {
        sampleCartId = new CartId("usuario1", "9789584295446");
        sampleCart = new Cart();
        sampleCart.setUsuario("usuario1");
        sampleCart.setIsbn("9789584295446");
        sampleCart.setCantidad(2);
    }

    @Test
    void getCart_returnsCartListForUser() {
        when(cartRepository.findByUsuario("usuario1")).thenReturn(List.of(sampleCart));

        List<Cart> result = cartServices.GetCart("usuario1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsuario()).isEqualTo("usuario1");
        assertThat(result.get(0).getIsbn()).isEqualTo("9789584295446");
        assertThat(result.get(0).getCantidad()).isEqualTo(2);
        verify(cartRepository).findByUsuario("usuario1");
    }

    @Test
    void getCart_returnsEmptyListWhenNoCart() {
        when(cartRepository.findByUsuario("usuario2")).thenReturn(List.of());

        List<Cart> result = cartServices.GetCart("usuario2");

        assertThat(result).isEmpty();
        verify(cartRepository).findByUsuario("usuario2");
    }

    @Test
    void addCartUser_createsNewCartWhenNotExists() {
        when(cartRepository.findById(any(CartId.class))).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        cartServices.AddCartUser("9789584295446", "usuario1", 3);

        verify(cartRepository).findById(eq(new CartId("usuario1", "9789584295446")));
        verify(cartRepository).save(argThat(cart -> 
            cart.getUsuario().equals("usuario1") &&
            cart.getIsbn().equals("9789584295446") &&
            cart.getCantidad() == 3
        ));
    }

    @Test
    void addCartUser_incrementsQuantityWhenExists() {
        Cart existingCart = new Cart();
        existingCart.setUsuario("usuario1");
        existingCart.setIsbn("9789584295446");
        existingCart.setCantidad(2);
        
        when(cartRepository.findById(any(CartId.class))).thenReturn(Optional.of(existingCart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        cartServices.AddCartUser("9789584295446", "usuario1", 3);

        verify(cartRepository).findById(eq(new CartId("usuario1", "9789584295446")));
        verify(cartRepository).save(argThat(cart -> 
            cart.getUsuario().equals("usuario1") &&
            cart.getIsbn().equals("9789584295446") &&
            cart.getCantidad() == 5
        ));
    }

    @Test
    void deleteCartUser_deletesByUsuarioAndIsbn() {
        cartServices.DeleteCartUser("9789584295446", "usuario1");

        verify(cartRepository).deleteByUsuarioAndIsbn("usuario1", "9789584295446");
    }

    @Test
    void deleteAllCartUser_deletesByUsuario() {
        cartServices.DeleteAllCartUser("usuario1");

        verify(cartRepository).deleteByUsuario("usuario1");
    }
}