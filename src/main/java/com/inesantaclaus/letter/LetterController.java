package com.inesantaclaus.letter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/letters")
public class LetterController {

  @Autowired
  LetterService service;

  @GetMapping("/{id}")
  public Letter detail(@PathVariable long id) {
    return service.detailLetter(id);
  }

  @GetMapping("/list")
  public List<Letter> list() {
    return service.listLetters();
  }

  @PostMapping("/add")
	@PreAuthorize("hasRole('ADMIN')")
  public Letter create(@RequestBody Letter letter) {
    return service.create(letter);
  }
}
