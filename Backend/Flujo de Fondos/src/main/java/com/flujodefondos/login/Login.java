package com.flujodefondos.login;

import com.flujodefondos.conector.Conector;
import com.flujodefondos.objects.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Login {
	
	public static User login(String usuario, String password) {
	
	    String sql = "SELECT user, pass, nombre FROM usuarios WHERE user = ? AND pass = ?";
	
	    try (
	        Connection conn = Conector.getConnection();
	        PreparedStatement ps = conn.prepareStatement(sql)
	    ) {
	
	        ps.setString(1, usuario);
	        ps.setString(2, password);
	
	        try (ResultSet rs = ps.executeQuery()) {
	            if (rs.next()) {
	
	                User user = new User(
	                    rs.getString("user"),
	                    rs.getString("pass"),
	                    rs.getString("nombre")
	                );
	                
	                return user;
	            }
	        }
	
	    } catch (SQLException e) {
	        System.err.println("Error login: " + e.getMessage());
	    }
	
	    return null;
	}
}