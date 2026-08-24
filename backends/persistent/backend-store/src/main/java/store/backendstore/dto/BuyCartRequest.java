package store.backendstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BuyCartRequest(
    @NotNull(message = "Usuario es requerido")
    @NotBlank(message = "Usuario es requerido")
    String usuario
) {}