package com.axel.flujodefondos.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;
    private String usuario;
    private String password;
    private String nombre;
    private String email;
    private String telefono;
    private String rango;
}