package com.crowdaid.repository;

import com.crowdaid.entity.EmergencyRequest;
import com.crowdaid.enums.EmergencyCategory;
import com.crowdaid.enums.EmergencyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {

    Page<EmergencyRequest> findByRequesterId(Long requesterId, Pageable pageable);

    Page<EmergencyRequest> findByStatus(EmergencyStatus status, Pageable pageable);

    Page<EmergencyRequest> findByCategory(EmergencyCategory category, Pageable pageable);

    List<EmergencyRequest> findByStatusIn(List<EmergencyStatus> statuses);

    long countByStatus(EmergencyStatus status);

    long countByCategory(EmergencyCategory category);

    @Query("SELECT COUNT(e) FROM EmergencyRequest e WHERE e.createdAt >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);

    @Query("""
        SELECT e FROM EmergencyRequest e
        WHERE e.status = 'PENDING'
        ORDER BY e.urgencyLevel DESC, e.createdAt ASC
        """)
    List<EmergencyRequest> findPendingOrderedByUrgency();

    @Query("""
        SELECT e.category, COUNT(e) as cnt
        FROM EmergencyRequest e
        GROUP BY e.category
        ORDER BY cnt DESC
        """)
    List<Object[]> countGroupedByCategory();

    @Query("""
        SELECT CAST(e.createdAt AS date) as day, COUNT(e) as cnt
        FROM EmergencyRequest e
        WHERE e.createdAt >= :since
        GROUP BY CAST(e.createdAt AS date)
        ORDER BY CAST(e.createdAt AS date)
        """)
    List<Object[]> countDailyActivity(@Param("since") LocalDateTime since);

    @Query(value = """
        SELECT AVG(TIMESTAMPDIFF(SECOND, e.created_at, hr.created_at))
        FROM emergency_requests e
        INNER JOIN helper_responses hr ON hr.emergency_id = e.id
        WHERE hr.status = 'ACCEPTED'
        """, nativeQuery = true)
    Double averageResponseTimeSeconds();
}
