package com.inesantaclaus.letter;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController()
@RequestMapping("/letters")
public class LetterController {

	private static final Logger logger = LoggerFactory.getLogger(LetterController.class);

  @Autowired
  LetterService service;

  @GetMapping("/{id}")
	@PreAuthorize("hasRole('USER')")
  public Letter get(@PathVariable(value = "id") long id) {
    return service.get(id);
  }

  @GetMapping("/list")
	@PreAuthorize("hasRole('USER')")
  public List<Letter> list() {
    return service.listLetters();
  }

  @PostMapping("/add")
	@PreAuthorize("hasRole('ADMIN')")
  public Letter create(@RequestBody Letter letter) {
    return service.create(letter);
  }

  @PostMapping("/add/file")
	@PreAuthorize("hasRole('ADMIN')")
  public String createByUpload(@RequestBody MultipartFile file) throws Exception { 
    // Path uploadPath = Paths.get("uploads/");

    // if (!Files.exists(uploadPath)) {
    //   Files.createDirectories(uploadPath);
    // }

    // logger.info("Received file: " + file.getOriginalFilename() + " with " + file.getSize() + " bytes");
    // Path filePath = uploadPath.resolve(file.getOriginalFilename());
    
    // // file.transferTo(filePath.toFile());
    // try (InputStream is = file.getInputStream()) {
    //     Files.copy(is, filePath);
    // }

    service.createByFile(file);

    logger.info("Saved");
    return "File uploaded: " + file.getOriginalFilename();    
  }

  @PostMapping("/edit/{id}") 
	@PreAuthorize("hasRole('ADMIN')")
  public Letter edit(@RequestBody Letter letter, @PathVariable long id) throws Exception {
    if (letter.getId() != id) {
      throw new Exception("Carta inválida");
    }
    return service.edit(letter);
  }

  @PostMapping("/adopt/{id}") 
	@PreAuthorize("hasRole('USER')")
  public Boolean adopt(@PathVariable long id) throws Exception {
    return service.adopt(id);
  }

  @PostMapping("/abandon/{id}") 
	@PreAuthorize("hasRole('USER')")
  public Boolean abandon(@PathVariable long id) throws Exception {
    return service.abandon(id);
  }

  @PostMapping("/delete/{id}") 
	@PreAuthorize("hasRole('ADMIN')")
  public Boolean delete(@PathVariable long id) throws Exception {
    return service.delete(id);
  }
}
