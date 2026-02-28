package com.example.ai_recruiter.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;


import java.time.Instant;

@Entity
@Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User candidate;

    private String fileName;



    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String parsedJson; // JSON string

    @Column(name = "uploaded_at")
    private Instant uploadedAt;


    @Column(name = "encrypted_file", columnDefinition = "BYTEA")
    private byte[] encryptedFile;

    @Column(name = "encrypted_aes_key", columnDefinition = "BYTEA")
    private byte[] encryptedAesKey;

    @Column(name = "iv", nullable = false)
    private byte[] iv;

}

