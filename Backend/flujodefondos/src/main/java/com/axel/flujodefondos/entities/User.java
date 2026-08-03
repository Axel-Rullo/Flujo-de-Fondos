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
public class User {
    private Long id;
    private String usuario;
    private String password;
    private String dni;
    private String nombre;
    private String email;
    private String telefono;
    private String rango;
    private String id_sucursal;
    private String photo;
    private String estado;
    private String sucursalNombre;
}