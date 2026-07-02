package com.crowdaid.repository;

import com.crowdaid.entity.HelperResponse;
import com.crowdaid.enums.ResponseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HelperResponseRepository extends JpaRepository<HelperResponse, Long> {

    List<HelperResponse> findByEmergencyId(Long emergencyId);

    Page<HelperResponse> findByHelperId(Long helperId, Pageable pageable);

    Optional<HelperResponse> findByEmergencyIdAndHelperId(Long emergencyId, Long helperId);

    boolean existsByEmergencyIdAndHelperId(Long emergencyId, Long helperId);

    long countByEmergencyIdAndStatus(Long emergencyId, ResponseStatus status);

    @Query("""
        SELECT hr FROM HelperResponse hr
        WHERE hr.helper.id = :helperId AND hr.status = :status
        """)
    List<HelperResponse> findByHelperIdAndStatus(@Param("helperId") Long helperId,
                                                  @Param("status") ResponseStatus status);

    @Query("""
        SELECT hr.helper.id, COUNT(hr), AVG(hr.responseTimeSecs)
        FROM HelperResponse hr
        WHERE hr.status = 'COMPLETED'
        GROUP BY hr.helper.id
        ORDER BY COUNT(hr) DESC
        """)
    List<Object[]> findTopHelperStats(Pageable pageable);
}
