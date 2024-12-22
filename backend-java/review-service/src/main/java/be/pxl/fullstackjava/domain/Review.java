package be.pxl.fullstackjava.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue
    private Long id;
    private String content;
    private String author;
    private Long postId;
    private LocalDateTime createdAt;
    private boolean isApproved;
}
