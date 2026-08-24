package store.backendstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCartRequest(
    @NotNull(message = "Usuario es requerido")
    @NotBlank(message = "Usuario es requerido")
    String usuario,

    @NotNull(message = "ISBN es requerido")
    @NotBlank(message = "ISBN es requerido")
    String isbn,

    @NotNull(message = "Cantidad es requerida")
    @Min(value = 1, message = "Cantidad debe ser mayor a 0")
    Integer cantidad
) {}