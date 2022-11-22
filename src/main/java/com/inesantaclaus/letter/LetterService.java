package com.inesantaclaus.letter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.inesantaclaus.user.User;
import com.inesantaclaus.user.UserRepository;

@Service
public class LetterService {

  @Autowired
  LetterRepository repository;

  @Autowired
  UserRepository userRepository;

  public Letter detailLetter(Long id) {
    return repository.findById(id).orElseThrow();
  }

  public List<Letter> listLetters() {
    return repository.findAll();
  }

  public Letter create(Letter letter) {
    return repository.save(letter);
  }

  public Letter edit(Letter letter) {
    return repository.save(letter);
  }

  public boolean adopt(Long id) {
    // Check if letter can be adopted
    Letter letter = repository.findById(id).orElseThrow();

    if (letter.getAdopter() != null) {
      // Already adopted
      return false;
    }

    UserDetails userDetails =
    (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    User loggedUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

    // Adopt
    repository.adoptLetterById(id, loggedUser);
    return true;
  }

  public boolean abandon(Long id) {
    // Check if letter can be abandoned
    Letter letter = repository.findById(id).orElseThrow();

    UserDetails userDetails =
    (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    User loggedUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

    if (letter.getAdopter() == null || letter.getAdopter().getId() != loggedUser.getId()) {
      // Wasn't adopted or logged user isn't the one who adopted
      return false;
    }

    // Adopt
    repository.abandonLetterById(id, loggedUser);
    return true;
  }
}
