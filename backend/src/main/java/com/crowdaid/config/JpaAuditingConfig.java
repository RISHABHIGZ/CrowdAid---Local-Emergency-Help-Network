package com.crowdaid.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables JPA auditing for @CreatedDate / @LastModifiedDate population.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
