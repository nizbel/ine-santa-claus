package com.inesantaclaus.letter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.transaction.Transactional;

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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.inesantaclaus.security.PureJavaAwsSigV4Interceptor;
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

  @PostConstruct 
  public void init() {
      String accessKey = env.getProperty("inesantaclaus.app.s3_bucket.username");
      String secretKey = env.getProperty("inesantaclaus.app.s3_bucket.access_key");
      String region = "us-east-2";
      String service = "s3"; 

      this.restTemplate.setInterceptors(Collections.singletonList(
          new PureJavaAwsSigV4Interceptor(accessKey, secretKey, region, service)
      ));
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

  public void createByFile(MultipartFile file) throws Exception {
    String s3Bucket = env.getProperty("inesantaclaus.app.s3_bucket");

    String filename = file.getOriginalFilename();
    int fileTypeIndex = filename.lastIndexOf('.');
    String baseFilename = filename.substring(0,fileTypeIndex);

    // Check if file exists already
    boolean fileExists = false;
    try {
      String response = restTemplate.getForObject(s3Bucket + filename, 
        String.class);
      fileExists = response != null && !response.contains("<Code>NoSuchKey</Code>");
    } catch (HttpClientErrorException e) {
      logger.error(e.getLocalizedMessage());

      if (e.getLocalizedMessage().contains("<Code>SignatureDoesNotMatch</Code>")) {
        throw new Exception("Nome de arquivo inválido");
      }
    }

    if (fileExists) {
      throw new Exception("Arquivo já existe");
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG);
    headers.setContentLength(file.getSize());

    HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);

    // Post letter
    try {
      restTemplate.put(s3Bucket + filename, request);
    } catch (RestClientException e) {
      throw new Exception(e.getLocalizedMessage());
    }

    // Generate thumb
    BufferedImage original = ImageIO.read(file.getInputStream());

    // Define ratio
    double ratio = Math.min((double) 370 / original.getWidth(), (double) 300 / original.getHeight());
    int targetWidth = (int) (original.getWidth() * ratio);
    int targetHeight = (int) (original.getHeight() * ratio);

    BufferedImage thumbnail = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
    thumbnail.getGraphics().drawImage(original, 0, 0, targetWidth, targetHeight, null);
    thumbnail.getGraphics().dispose();
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    ImageIO.write(thumbnail, "jpg", outputStream);

    // Prepare request
    HttpHeaders headersThumb = new HttpHeaders();
    headersThumb.setContentType(MediaType.IMAGE_JPEG);
    headersThumb.setContentLength(outputStream.toByteArray().length);   

    // Prepare thumb filename
    String thumbFilename = baseFilename + ".thumb.jpeg";
    request = new HttpEntity<>(outputStream.toByteArray(), headers);

    // Post thumb
    restTemplate.put(s3Bucket + thumbFilename, request);

    // Prepare letter
    String[] fileNameParts = filename.split("[_\\-\\.]");

    String name = "Nome";
    String ineClass = "Turma";
    List<String> images = new ArrayList<String>(Arrays.asList(
      s3Bucket + filename, s3Bucket + thumbFilename));

    // Iterates by name ignorando final part (file type)
    for (int i = 0; i < fileNameParts.length-1; i++) {
      String part = fileNameParts[i];
      if (part.toLowerCase().equals("carta")) {
        continue;
      }

      if (part.toLowerCase().startsWith("kids") || part.toLowerCase().startsWith("teens")) {
        ineClass = part.replaceAll("(\\p{Ll})(\\p{Lu})","$1 $2");
      } else if (name.equals("Nome")) {
        name = part.replaceAll("(\\p{Ll})(\\p{Lu})","$1 $2");
      }
    }
    Letter newLetter = new Letter(name, ineClass, images);
      
    repository.save(newLetter);
  }

  @Transactional
  public void createByFiles(MultipartFile[] files) throws Exception {
    for (MultipartFile file : files) {
      createByFile(file);
    }
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

  public boolean delete(Long id) throws Exception {
    // Check if letter is adopted
    Letter letter = repository.findById(id).orElseThrow();

    if (letter.getAdopter() != null) {
      throw new Exception("Carta já foi adotada");
    }

    // Check letter amount
    int initialAmount = repository.findAll().size();

    // Delete files related first
    for (String imagePath : letter.getImagePath()) {
      deleteLetterFile(imagePath);
    }

    repository.delete(letter);

    return repository.findAll().size() - initialAmount != 0;
  }

  private void deleteLetterFile(String fileName) {
    restTemplate.delete(fileName);
  }
}
