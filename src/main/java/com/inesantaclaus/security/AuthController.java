package com.inesantaclaus.security;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inesantaclaus.role.RoleRepository;
import com.inesantaclaus.security.jwt.JwtUtils;
import com.inesantaclaus.security.payload.JwtResponse;
import com.inesantaclaus.security.payload.LoginRequest;
import com.inesantaclaus.security.payload.MessageResponse;
import com.inesantaclaus.security.payload.SignupRequest;
import com.inesantaclaus.security.services.UserDetailsImpl;
import com.inesantaclaus.user.User;
import com.inesantaclaus.user.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody @Valid LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
				userDetails.getId(), 
				userDetails.getUsername(), 
				userDetails.getName(), 
				userDetails.getPhone(),
				roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Usuário indisponível!"));
		}

		if (userRepository.existsByPhone(signUpRequest.getPhone())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Telefone indisponível!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), 
							 encoder.encode(signUpRequest.getPassword()),
               signUpRequest.getName(),
               signUpRequest.getPhone(),
							 signUpRequest.getUserType());

		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("Usuário cadastrado com sucesso!"));
	}
}