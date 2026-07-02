package com.crowdaid.repository;

import com.crowdaid.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Page<Rating> findByRateeId(Long rateeId, Pageable pageable);

    List<Rating> findByEmergencyId(Long emergencyId);

    Optional<Rating> findByEmergencyIdAndRaterIdAndRateeId(Long emergencyId, Long raterId, Long rateeId);

    boolean existsByEmergencyIdAndRaterIdAndRateeId(Long emergencyId, Long raterId, Long rateeId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.ratee.id = :userId")
    Optional<Double> findAverageScoreByRateeId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratee.id = :userId")
    long countByRateeId(@Param("userId") Long userId);
}
