package com.inesantaclaus.security.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.inesantaclaus.user.EUserType;

public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

	@NotBlank
	@Size(max = 120)
	private String name;

	@NotBlank
  @Size(min = 10, max = 11)
	private String phone;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;

	private EUserType userType;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

	public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public EUserType getUserType() {
    return userType;
  }

  public void setUserType(EUserType userType) {
    this.userType = userType;
  }

}