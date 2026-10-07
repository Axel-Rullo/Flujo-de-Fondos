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
public class Movimiento {
    Long id_movimiento;
    String fecha;
    String id_cuenta;
    String id_concepto;
    BigDecimal ingreso;
    BigDecimal egreso;
    BigDecimal saldo;
    String observaciones;
    String operacion;
    String ch_endosado;
    String id_usuario;
    String id_sucursal;
    String usuario;
    String sucursal;
    String cuenta;
    String concepto;
}