package store.backendstore;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import store.backendstore.dto.AddCartRequest;
import store.backendstore.dto.BuyCartRequest;
import store.backendstore.dto.DeleteCartRequest;
import store.backendstore.dto.GetCartRequest;
import store.backendstore.mysqlservices.ICartService;
import store.backendstore.rabbitmq.RabbitMQSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StoreController.class)
class StoreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ICartService cartService;

    @MockBean
    private RabbitMQSender rabbitMQSender;

    @Test
    void getCart_returnsCartList() throws Exception {
        Cart cart = new Cart();
        cart.setUsuario("usuario1");
        cart.setIsbn("9789584295446");
        cart.setCantidad(2);

        doReturn(List.of(cart)).when(cartService).GetCart("usuario1");

        mockMvc.perform(get("/api/getcart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].usuario").value("usuario1"))
                .andExpect(jsonPath("$[0].isbn").value("9789584295446"))
                .andExpect(jsonPath("$[0].cantidad").value(2));
    }

    @Test
    void getCart_returnsEmptyListWhenNoCart() throws Exception {
        doReturn(List.of()).when(cartService).GetCart("usuario2");

        mockMvc.perform(get("/api/getcart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario2\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void addCart_validRequest_returnsOk() throws Exception {
        mockMvc.perform(post("/api/addcart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\",\"isbn\":\"9789584295446\",\"cantidad\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"));

        verify(cartService).AddCartUser("9789584295446", "usuario1", 3);
    }

    @Test
    void addCart_missingUsuario_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/addcart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"isbn\":\"9789584295446\",\"cantidad\":3}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void addCart_invalidCantidad_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/addcart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\",\"isbn\":\"9789584295446\",\"cantidad\":0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void deleteCart_validRequest_returnsOk() throws Exception {
        mockMvc.perform(delete("/api/deletecart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\",\"isbn\":\"9789584295446\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"));

        verify(cartService).DeleteCartUser("9789584295446", "usuario1");
    }

    @Test
    void deleteCart_missingIsbn_returnsBadRequest() throws Exception {
        mockMvc.perform(delete("/api/deletecart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void buyCart_success_returnsOkAndClearsCart() throws Exception {
        Cart cart = new Cart();
        cart.setUsuario("usuario1");
        cart.setIsbn("9789584295446");
        cart.setCantidad(2);

        doReturn(List.of(cart)).when(cartService).GetCart("usuario1");
        doReturn(true).when(rabbitMQSender).send(any());

        mockMvc.perform(post("/api/buycart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"));

        verify(cartService).GetCart("usuario1");
        verify(rabbitMQSender).send(any());
        verify(cartService).DeleteAllCartUser("usuario1");
    }

    @Test
    void buyCart_rabbitMqFails_returnsInternalServerError() throws Exception {
        Cart cart = new Cart();
        cart.setUsuario("usuario1");
        cart.setIsbn("9789584295446");
        cart.setCantidad(2);

        doReturn(List.of(cart)).when(cartService).GetCart("usuario1");
        doReturn(false).when(rabbitMQSender).send(any());

        mockMvc.perform(post("/api/buycart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuario\":\"usuario1\"}"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value("ERROR"));
    }

    @Test
    void buyCart_missingUsuario_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/buycart")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}