package com.axel.flujodefondos.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CuentaPropia {
    // Cuenta Propia
    Long id_cuenta;
    String nombre;
    Long id_banco;
    BigDecimal saldo;
    String banco;

    // Transacción
    Long id_transaccion;
    String fecha;
    Long id_cuenta_origen;
    Long id_cuenta_destino;
    BigDecimal monto;
    Long id_usuario;
    String cuenta_origen;
    String cuenta_destino;
    String usuario;
}