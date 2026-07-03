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
    /**
     * Find available helpers — uses Java-side Haversine filtering
     * (DB-agnostic, works on both MySQL and PostgreSQL)
     */
    @Query("""
        SELECT u FROM User u
        JOIN u.roles r
        WHERE r.name = 'ROLE_HELPER'
          AND u.isAvailable = true
          AND u.isActive = true
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        """)
    List<User> findAvailableHelpers();
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    @Query("SELECT u FROM User u ORDER BY u.trustScore DESC")
    List<User> findTopHelpersByTrustScore(Pageable pageable);
}
