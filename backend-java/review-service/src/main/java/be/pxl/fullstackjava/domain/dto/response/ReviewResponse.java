package be.pxl.fullstackjava.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class ReviewResponse {
    private Long postId;
    private String content;
    private String author;
    private boolean isApproved;
}