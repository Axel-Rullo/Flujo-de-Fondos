package com.flujodefondos.login;

import com.flujodefondos.objects.User;
import static spark.Spark.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

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

        post("/login", (req, res) -> {
            res.type("application/json");

            JsonObject body    = JsonParser.parseString(req.body()).getAsJsonObject();
            String usuario     = body.get("user").getAsString();
            String password    = body.get("pass").getAsString();

            User user = Login.login(usuario, password);

            JsonObject respuesta = new JsonObject();

            if (user != null) {
                respuesta.addProperty("ok", true);
                respuesta.addProperty("nombre", user.getName());
            } else {
                res.status(401);
                respuesta.addProperty("ok", false);
                respuesta.addProperty("mensaje", "Usuario o contraseña incorrectos");
            }

            return respuesta.toString();
        });
    }
}