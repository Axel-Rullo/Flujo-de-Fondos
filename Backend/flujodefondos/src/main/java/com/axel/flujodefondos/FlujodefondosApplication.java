package com.axel.flujodefondos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.LazyInitializationExcludeFilter;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FlujodefondosApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlujodefondosApplication.class, args);
    }

}