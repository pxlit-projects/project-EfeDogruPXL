package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.Comment;
import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.domain.dto.response.CommentResponse;
import be.pxl.fullstackjava.repository.CommentRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Builder
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);

    public List<CommentResponse> getCommentByPostId(Long postId){
        log.info("Fetching comments for postId={}", postId);
        List<Comment> comments = commentRepository.findByPostId(postId);
        if (comments == null || comments.isEmpty()){
            log.warn("No comments found for postId={}", postId);
            return new ArrayList<>();
        }

        return comments.stream()
                .map(comment -> CommentResponse.builder()
                        .id(comment.getId())
                        .comment(comment.getComment())
                        .author(comment.getAuthor())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public CommentResponse getCommentById(Long id){
        log.info("Fetching comment by id={}", id);
        Comment comment = commentRepository.findById(id).orElseThrow(() -> {
            log.error("Comment not found for id={}", id);
            return new RuntimeException("Comment not found");
        });

        log.debug("Comment found: {}", comment);
        return CommentResponse.builder()
                .id(comment.getId())
                .comment(comment.getComment())
                .author(comment.getAuthor())
                .createdAt(comment.getCreatedAt())
                .build();
    }


    public void createComment(Long postId, CommentRequest request){
        log.info("Creating comment for postId={} by author={}", postId, request.getAuthor());
        Comment comment = Comment.builder()
                .comment(request.getComment())
                .author(request.getAuthor())
                .createdAt(LocalDateTime.now())
                .postId(postId)
                .build();

        commentRepository.save(comment);

        rabbitTemplate.convertAndSend("comment-queue", comment.getPostId());
        log.info("Sent comment event to queue for postId={}", comment.getPostId());
    }

    public void updateComment(Long id, String commentText){
        log.info("Updating comment with id={}", id);
        Comment comment = commentRepository.findById(id).orElseThrow(() -> {
            log.error("Comment not found for id={}", id);
            return new RuntimeException("Comment not found");
        });
        comment.setComment(commentText);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);
        log.info("Comment with id={} updated successfully", id);
    }

    public void deleteComment(Long id){
        Comment comment = commentRepository.findById(id).orElseThrow(() -> {
            log.error("Comment not found for id={}", id);
            return new RuntimeException("Comment not found");
        });
        commentRepository.delete(comment);
        log.info("Comment with id={} deleted successfully", id);
    }
}
