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
    Long id_cuenta;
    String id_concepto;
    BigDecimal ingreso;
    BigDecimal egreso;
    BigDecimal saldo;
    String observaciones;
    Boolean ch_endosado;
    Long id_usuario;
    Long id_sucursal;
    String cuenta;
    String concepto;
}