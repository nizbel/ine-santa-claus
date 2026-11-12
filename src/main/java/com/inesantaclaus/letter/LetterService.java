package com.inesantaclaus.letter;

import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.inesantaclaus.user.User;
import com.inesantaclaus.user.UserRepository;

@Service
public class LetterService {

	private static final Logger logger = LoggerFactory.getLogger(LetterService.class);

  @Autowired
  private Environment env;
 
  @Autowired
  LetterRepository repository;

  @Autowired
  UserRepository userRepository;

  private final RestTemplate restTemplate;

  public LetterService(RestTemplateBuilder restTemplateBuilder) {
      this.restTemplate = restTemplateBuilder.build();
  }

  public Letter get(Long id) {
    return repository.findById(id).orElseThrow();
  }

  public List<Letter> listLetters() {
    return repository.findAll();
  }

  public Letter create(Letter letter) {
    return repository.save(letter);
  }

  public void createByFile(MultipartFile file) throws IOException {
    String s3Bucket = env.getProperty("inesantaclaus.app.s3_bucket");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);
    headers.setContentLength(file.getSize());   

    MultiValueMap<String, Object> body  = new LinkedMultiValueMap<>();
    body.add("key", file.getOriginalFilename());
    body.add("file", file.getBytes());
    HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

    // Post letter
    String response = restTemplate.postForObject(s3Bucket, request, String.class);

    logger.info(response);
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

  public boolean delete(Long id) {
    // Check letter amount
    int initialAmount = repository.findAll().size();

    Letter letter = repository.findById(id).orElseThrow();

    repository.delete(letter);

    return repository.findAll().size() - initialAmount != 0;
  }
}
