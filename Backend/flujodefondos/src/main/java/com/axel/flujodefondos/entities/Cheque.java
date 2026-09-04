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
public class Cheque {
    Long id_cheque;
    String clase;
    String clasificacion;
    String numero;
    String banco;
    BigDecimal importe;
    String tipo;
    String fecha_entrega;
    String fecha_cobro;
    String fecha_destino;
    String estado;
    String observacion;
    String uso;
    String id_titular;
    String id_titular_destino;
    String id_cuenta_entrada;
    String id_cuenta_salida;
    String id_usuario;
    String titular;
    String titular_destino;
    String cuenta_entrada;
    String cuenta_salida;
    String usuario;
    
}