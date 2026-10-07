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
    BigDecimal importe;
    String tipo;
    String fecha_emision;
    String fecha_pago;
    String fecha_destino;
    String estado;
    String observacion;
    String motivo;
    String uso;
    String id_clipro_emision; // CH T y CH P
    String id_clipro_imputar; // CH T
    String id_banco_emision; // CH T
    String id_cuenta_propia_emision; // CH P
    String id_cuenta_propia_imputar; // CH T
    String id_concepto_emision; // CH T y CH P
    String id_concepto_imputar; // CH T
    String id_usuario; // User que ingresa
    String clipro_emision;
    String clipro_imputar;
    String banco_emision;
    String cuenta_propia_emision;
    String cuenta_propia_imputar;
    String concepto_emision;
    String concepto_imputar;
    String usuario;
    String busqueda; // Listados: texto a buscar
    Integer limit; // Listados: cantidad por página
    Integer offset; // Listados: cantidad ya cargada
}