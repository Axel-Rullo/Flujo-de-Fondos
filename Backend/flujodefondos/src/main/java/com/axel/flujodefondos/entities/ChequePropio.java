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
    Long id_chequepro;
    String numero;
    String importe;
    String fechacob;
    String fechaent;
    String estado;
    String observacion;
    String uso;
    String id_titular;
    String id_cuentasal;
}