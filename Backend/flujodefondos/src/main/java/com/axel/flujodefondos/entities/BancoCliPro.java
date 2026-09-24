package com.axel.flujodefondos.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BancoCliPro {
    Long id_banco;
    Long id_clipro;
    String alias;
}