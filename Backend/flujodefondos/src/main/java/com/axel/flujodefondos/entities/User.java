package com.axel.flujodefondos.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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