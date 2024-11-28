package be.pxl.fullstackjava.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class PostResponse {
    private String title;
    private String content;
    private String auteur;
    private boolean isDraft;
    private String createdAt;
}
