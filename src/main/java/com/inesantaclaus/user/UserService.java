package com.inesantaclaus.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.inesantaclaus.role.ERole;
import com.inesantaclaus.role.RoleRepository;

@Service
public class UserService {

  @Autowired
  UserRepository repository;

  @Autowired
  RoleRepository roleRepository;

  public User getLoggedUser() {
    // Get logged user
    UserDetails userDetails =
    (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    User loggedUser = repository.findByUsername(userDetails.getUsername()).orElseThrow();

    return repository.findById(loggedUser.getId()).orElseThrow();
  }

  public List<User> listUsers() {
    return repository.findAll();
  }

  public List<Long> listAdoptedLetters() {
    // Get logged user
    UserDetails userDetails =
    (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    User loggedUser = repository.findByUsername(userDetails.getUsername()).orElseThrow();

    return repository.listAdoptedLettersById(loggedUser);
  }

  public User changeUserRole(Long id, ERole roleType) throws Exception {
    // Check if user exists
    User user = repository.findById(id).orElseThrow();

    // Check if user isn't changing his own roles
    UserDetails userDetails =
    (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    User loggedUser = repository.findByUsername(userDetails.getUsername()).orElseThrow();

    if (loggedUser.getId() == user.getId()) {
      throw new Exception("Usuário não pode alterar as próprias permissões");
    }

    // Check if user has letters
    List<Long> letersAdopted = repository.listAdoptedLettersById(user);

    // If no letters, add role or remove if already has role
    if (letersAdopted.isEmpty()) {
      boolean removed = user.getRoles().removeIf(
        role -> role.getName().equals(roleType));

      if (!removed) {
        user.getRoles().add(roleRepository.findByName(roleType).orElseThrow());
      }
    }

    repository.save(user);
    return user;
  }
}
