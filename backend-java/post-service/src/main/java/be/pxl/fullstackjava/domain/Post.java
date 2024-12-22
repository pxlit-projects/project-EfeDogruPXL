package be.pxl.fullstackjava.domain;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Dictionary;
import java.util.List;

@Entity
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdAt;
    private boolean isDraft;

    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

}
