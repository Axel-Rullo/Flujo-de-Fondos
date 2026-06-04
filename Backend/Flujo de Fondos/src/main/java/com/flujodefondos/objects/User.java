package com.flujodefondos.objects;

public class User {
	
	private String user;
	private String pass;
	private String name;
	
	public User(String user, String pass, String name) {
		super();
		this.user = user;
		this.pass = pass;
		this.name = name;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}