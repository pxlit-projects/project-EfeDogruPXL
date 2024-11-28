package be.pxl.fullstackjava.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class CreatePostRequest {
    private String title;
    private String content;
    private String auteur;
}
