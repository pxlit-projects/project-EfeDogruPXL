package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.domain.dto.response.CommentResponse;

import java.util.List;

public interface ICommentService {

    List<CommentResponse> getCommentByPostId(Long postId);

    CommentResponse getCommentById(Long id);

    void createComment(Long postId, CommentRequest request);

    void updateComment(Long id, String commentText);

    void deleteComment(Long id);
}
