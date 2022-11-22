package com.inesantaclaus.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inesantaclaus.role.ERole;

@RestController()
@RequestMapping("/users/")
public class UserController {
  @Autowired
  UserService service;

  @GetMapping("/loggedUser")
  public User getLoggedUser() {
    return service.getLoggedUser();
  }

  @GetMapping("/list")
  public List<User> listUsers() {
    return service.listUsers();
  }

  @GetMapping("/listAdoptedLetters")
	@PreAuthorize("hasRole('USER')")
  public List<Long> listAdoptedLetters() {
    return service.listAdoptedLetters();
  }

  @PostMapping("/changeValidated/{id}")
	@PreAuthorize("hasRole('ADMIN')")
  public User changeValidated(@PathVariable(value = "id") long id) 
  throws Exception {
    return service.changeUserRole(id, ERole.ROLE_USER);
  }

  @PostMapping("/changeAdmin/{id}")
	@PreAuthorize("hasRole('ADMIN')")
  public User changeAdmin(@PathVariable(value = "id") long id) 
  throws Exception {
    return service.changeUserRole(id, ERole.ROLE_ADMIN);
  }
}
