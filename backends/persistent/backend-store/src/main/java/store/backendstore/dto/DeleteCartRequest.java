package store.backendstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeleteCartRequest(
    @NotNull(message = "Usuario es requerido")
    @NotBlank(message = "Usuario es requerido")
    String usuario,

    @NotNull(message = "ISBN es requerido")
    @NotBlank(message = "ISBN es requerido")
    String isbn
) {}