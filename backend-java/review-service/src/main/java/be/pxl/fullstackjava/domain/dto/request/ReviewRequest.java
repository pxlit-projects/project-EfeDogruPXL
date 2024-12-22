package be.pxl.fullstackjava.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class ReviewRequest {
    private String content;
    private String author;
    private boolean isApproved;

}
