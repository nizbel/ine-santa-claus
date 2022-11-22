package com.inesantaclaus.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByPhone(String phone);

  @Query("SELECT id FROM Letter l WHERE l.adopter = :user")
  List<Long> listAdoptedLettersById(@Param("user")User user);
}