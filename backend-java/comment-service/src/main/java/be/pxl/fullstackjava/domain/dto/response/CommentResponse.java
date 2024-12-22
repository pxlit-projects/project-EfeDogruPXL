package be.pxl.fullstackjava.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
public class CommentResponse {
    private Long id;
    private String comment;
    private String author;
    private LocalDateTime createdAt;
}
