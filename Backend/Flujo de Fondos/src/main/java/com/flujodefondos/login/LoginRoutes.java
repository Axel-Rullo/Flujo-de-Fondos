package com.flujodefondos.login;

import com.flujodefondos.objects.User;
import static spark.Spark.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LoginRoutes {
    public static void register() {

        post("/login", (req, res) -> {
            res.type("application/json");

            JsonObject body = JsonParser.parseString(req.body()).getAsJsonObject();
            String usuario  = body.get("user").getAsString();
            String password = body.get("pass").getAsString();

            User user = Login.login(usuario, password);

            JsonObject respuesta = new JsonObject();

            if (user != null) {
                respuesta.addProperty("ok", true);
            } else {
                res.status(401);
                respuesta.addProperty("ok", false);
                respuesta.addProperty("mensaje", "Usuario o contraseña incorrectos");
            }

            return respuesta.toString();
        });
    }
}