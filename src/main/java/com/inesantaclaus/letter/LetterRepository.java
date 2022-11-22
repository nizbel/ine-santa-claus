package com.inesantaclaus.letter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.inesantaclaus.user.User;

public interface LetterRepository extends JpaRepository<Letter, Long> {
  @Modifying
  @Transactional
  @Query("UPDATE Letter l SET l.adopter = :user WHERE l.id = :id")
  void adoptLetterById(@Param("id") Long id, @Param("user")User user);

  @Modifying
  @Transactional
  @Query("UPDATE Letter l SET l.adopter = NULL WHERE l.id = :id AND l.adopter = :user")
  void abandonLetterById(@Param("id") Long id, @Param("user")User user);
}
