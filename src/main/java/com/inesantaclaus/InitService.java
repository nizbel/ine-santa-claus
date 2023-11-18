package com.inesantaclaus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.inesantaclaus.letter.Letter;
import com.inesantaclaus.letter.LetterRepository;
import com.inesantaclaus.role.ERole;
import com.inesantaclaus.role.Role;
import com.inesantaclaus.role.RoleRepository;
import com.inesantaclaus.user.EUserType;
import com.inesantaclaus.user.User;
import com.inesantaclaus.user.UserRepository;

@Service
public class InitService {
  @Autowired
  private Environment env;

	@Autowired
	PasswordEncoder encoder;
  
  @Autowired
  RoleRepository roleRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  LetterRepository letterRepository;

  private final RestTemplate restTemplate;

  public InitService(RestTemplateBuilder restTemplateBuilder) {
      this.restTemplate = restTemplateBuilder.build();
  }

  public boolean init() {
    // Check if basic roles exist, if not, start creating everything
    if (roleRepository.findAll().size() == 0) {
      // Create roles
      Role userRole = new Role(ERole.ROLE_USER);
      roleRepository.save(userRole);
      Role adminRole = new Role(ERole.ROLE_ADMIN);
      roleRepository.save(adminRole);

      // Create base admin user
      User baseAdmin = new User(env.getProperty("inesantaclaus.app.baseuser.username"),
        encoder.encode(env.getProperty("inesantaclaus.app.baseuser.password")),
        env.getProperty("inesantaclaus.app.baseuser.name"),
        env.getProperty("inesantaclaus.app.baseuser.phone"),
        EUserType.USER_INE,
        ""
      );

      baseAdmin.setRoles(new HashSet<Role>(Arrays.asList(userRole, adminRole)));
      userRepository.save(baseAdmin);

      // Load letters with the files from S3
      LoadLetters();
      return true;
    } else {
      // Get all letters
      List<Letter> letters = letterRepository.findAll();

      // Get names
      String s3Bucket = env.getProperty("inesantaclaus.app.s3_bucket");

      // Get list of images
      String response = restTemplate.getForObject(s3Bucket, 
      String.class);

      // Prepare regex search
      Pattern imagePattern = Pattern.compile("<Key>([^\\/]+?)\\/Carta_(\\w+?)_[\\w\\d]+?\\.\\w+?<\\/Key>", Pattern.DOTALL | Pattern.UNICODE_CHARACTER_CLASS);

      Matcher matcher = imagePattern.matcher(response);

      while (matcher.find())  {
        String imagePath = s3Bucket + matcher.group(0).replaceAll("<.+?>", "");

        // Compare if already exists
        if (letters.stream().anyMatch(letter -> letter.getImagePath().get(0).equals(imagePath))) {
          continue;
        }

        String name = matcher.group(2);
        String ineClass = matcher.group(1);
        List<String> images = new ArrayList<String>(Arrays.asList(imagePath));
        Letter newLetter = new Letter(name, ineClass, images);
        
        letterRepository.save(newLetter);
      }

    }
      
    return false;
  }

  void LoadLetters() {
    String s3Bucket = env.getProperty("inesantaclaus.app.s3_bucket");

    // Get list of images
    String response = restTemplate.getForObject(s3Bucket, 
    String.class);

    // Prepare regex search
    Pattern imagePattern = Pattern.compile("<Key>([^\\/]+?)\\/Carta_(\\w+?)_[\\w\\d]+?\\.\\w+?<\\/Key>", Pattern.DOTALL | Pattern.UNICODE_CHARACTER_CLASS);

    Matcher matcher = imagePattern.matcher(response);

    while (matcher.find()) {
      String name = matcher.group(2);
      String ineClass = matcher.group(1);
      List<String> imagePath = new ArrayList<String>(Arrays.asList(s3Bucket + matcher.group(0).replaceAll("<.+?>", "")));
      Letter newLetter = new Letter(name, ineClass, imagePath);
      
      letterRepository.save(newLetter);
    }
  }
}
