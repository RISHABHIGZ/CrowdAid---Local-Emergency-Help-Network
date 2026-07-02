package com.crowdaid.repository;

import com.crowdaid.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Page<User> findByIsActiveTrue(Pageable pageable);

    /**
     * Find available helpers within a given radius using the Haversine formula.
     *
     * @param lat        center latitude
     * @param lng        center longitude
     * @param radiusKm   search radius in kilometres
     */
    @Query(value = """
        SELECT u.* FROM users u
        INNER JOIN user_roles ur ON ur.user_id = u.id
        INNER JOIN roles r       ON r.id = ur.role_id
        WHERE r.name = 'ROLE_HELPER'
          AND u.is_available = TRUE
          AND u.is_active    = TRUE
          AND u.latitude     IS NOT NULL
          AND u.longitude    IS NOT NULL
          AND (
            6371 * ACOS(
              COS(RADIANS(:lat)) * COS(RADIANS(u.latitude))
              * COS(RADIANS(u.longitude) - RADIANS(:lng))
              + SIN(RADIANS(:lat)) * SIN(RADIANS(u.latitude))
            )
          ) <= :radiusKm
        """, nativeQuery = true)
    List<User> findAvailableHelpersWithinRadius(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    @Query("SELECT u FROM User u ORDER BY u.trustScore DESC")
    List<User> findTopHelpersByTrustScore(Pageable pageable);
}
