package be.pxl.fullstackjava.domain.dto.response;

import be.pxl.fullstackjava.domain.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String author;
    private boolean isDraft;
    private String createdAt;
    private ReviewStatus status;
}
