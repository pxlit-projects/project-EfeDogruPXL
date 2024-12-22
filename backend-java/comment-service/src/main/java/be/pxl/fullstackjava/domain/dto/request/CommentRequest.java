package be.pxl.fullstackjava.domain.dto.request;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class CommentRequest {
    private String comment;
    private String author;
}
