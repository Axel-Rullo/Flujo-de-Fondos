package com.flujodefondos.apiserver;

import com.flujodefondos.login.LoginRoutes;
import static spark.Spark.*;

public class ApiServer {
    public static void main(String[] args) {
        port(8080);

        options("/*", (req, res) -> {
            res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            return "OK";
        });

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
        });

        LoginRoutes.register();
    }
}