package com.inesantaclaus.user;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.inesantaclaus.role.Role;

@Entity
@Table(	name = "users", 
		uniqueConstraints = { 
			@UniqueConstraint(columnNames = "username"),
			@UniqueConstraint(columnNames = "phone") 
		})
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotBlank
  @Size(min = 3, max = 20)
	private String username;

	@NotBlank
	@Size(max = 120)
	@JsonIgnore
	private String password;

	@NotBlank
	@Size(max = 120)
	private String name;

	@NotBlank
	@Size(min = 10, max = 11)
	private String phone;

	private EUserType userType;

	@Size(max = 120)
	private String volunteer;


	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "user_roles", 
				joinColumns = @JoinColumn(name = "user_id"), 
				inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	public User() {
	}

	public User(String username, String password, String name, String phone, EUserType userType, String volunteer) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.phone = phone;
		this.userType = userType;
		this.volunteer = volunteer;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
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
	
	public String getVolunteer() {
		return volunteer;
	}

	public void setVolunteer(String volunteer) {
		this.volunteer = volunteer;
	}
}