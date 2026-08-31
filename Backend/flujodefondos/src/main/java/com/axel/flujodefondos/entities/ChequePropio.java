package com.axel.flujodefondos.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChequePropio {
    Long id_cheque;
    String numero;
    String importe;
    String tipo;
    String fecha_entrega;
    String fecha_cobro;
    String fecha_destino;
    String estado;
    String observacion;
    String id_titular;
    String id_cuenta_salida;
    String id_usuario;
}