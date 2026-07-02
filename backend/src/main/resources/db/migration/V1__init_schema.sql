-- ============================================================
-- CrowdAid Database Schema - V1 Initial Migration
-- ============================================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(100)        NOT NULL,
    email               VARCHAR(150)        NOT NULL UNIQUE,
    password            VARCHAR(255)        NOT NULL,
    phone               VARCHAR(20),
    profile_image_url   VARCHAR(500),
    address             VARCHAR(300),
    emergency_contact   VARCHAR(20),
    latitude            DECIMAL(10, 8),
    longitude           DECIMAL(11, 8),
    trust_score         DOUBLE              NOT NULL DEFAULT 50.0,
    is_verified         BOOLEAN             NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN             NOT NULL DEFAULT TRUE,
    is_available        BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User-Roles join table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Emergency Requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(200)    NOT NULL,
    description      TEXT            NOT NULL,
    category         VARCHAR(50)     NOT NULL,
    urgency_level    VARCHAR(20)     NOT NULL,
    status           VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    latitude         DECIMAL(10, 8)  NOT NULL,
    longitude        DECIMAL(11, 8)  NOT NULL,
    address          VARCHAR(300),
    contact_number   VARCHAR(20),
    required_helpers INT             NOT NULL DEFAULT 1,
    ai_severity_score DOUBLE,
    requester_id     BIGINT          NOT NULL,
    resolved_at      TIMESTAMP,
    created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_er_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Helper Responses table
CREATE TABLE IF NOT EXISTS helper_responses (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    emergency_id        BIGINT      NOT NULL,
    helper_id           BIGINT      NOT NULL,
    status              VARCHAR(30) NOT NULL DEFAULT 'ACCEPTED',
    response_time_secs  INT,
    arrived_at          TIMESTAMP,
    notes               VARCHAR(500),
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hr_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_hr_helper    FOREIGN KEY (helper_id)    REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_helper_emergency (helper_id, emergency_id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    emergency_id BIGINT  NOT NULL,
    rater_id     BIGINT  NOT NULL,
    ratee_id     BIGINT  NOT NULL,
    score        INT     NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rat_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_rat_rater     FOREIGN KEY (rater_id)     REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rat_ratee     FOREIGN KEY (ratee_id)     REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_rating (emergency_id, rater_id, ratee_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    title        VARCHAR(200) NOT NULL,
    message      TEXT         NOT NULL,
    type         VARCHAR(50)  NOT NULL,
    is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
    emergency_id BIGINT,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user      FOREIGN KEY (user_id)      REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_emergency FOREIGN KEY (emergency_id) REFERENCES emergency_requests(id) ON DELETE SET NULL
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id   BIGINT,
    performed_by BIGINT,
    details     TEXT,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_er_status       ON emergency_requests(status);
CREATE INDEX idx_er_category     ON emergency_requests(category);
CREATE INDEX idx_er_requester    ON emergency_requests(requester_id);
CREATE INDEX idx_er_created_at   ON emergency_requests(created_at);
CREATE INDEX idx_er_location     ON emergency_requests(latitude, longitude);
CREATE INDEX idx_hr_emergency    ON helper_responses(emergency_id);
CREATE INDEX idx_hr_helper       ON helper_responses(helper_id);
CREATE INDEX idx_notif_user      ON notifications(user_id, is_read);
CREATE INDEX idx_audit_created   ON audit_logs(created_at);
