package be.pxl.fullstackjava.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class ReviewEvent {
    private Long postId;
    private boolean isApproved;
}
