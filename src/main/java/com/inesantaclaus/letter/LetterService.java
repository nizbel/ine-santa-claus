package com.inesantaclaus.letter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LetterService {

  @Autowired
  LetterRepository repository;

  public Letter detailLetter(Long id) {
    return repository.findById(id).orElseThrow();
  }

  public List<Letter> listLetters() {
    return repository.findAll();
  }

  public Letter create(Letter letter) {
    return repository.save(letter);
  }
}
