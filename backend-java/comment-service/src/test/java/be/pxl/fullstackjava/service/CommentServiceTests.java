package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.Comment;
import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.domain.dto.response.CommentResponse;
import be.pxl.fullstackjava.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTests {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCommentByPostId_Success() {
        Long postId = 1L;
        List<Comment> mockComments = List.of(
                new Comment(1L, "Comment 1", "Author 1", postId, LocalDateTime.now()),
                new Comment(2L, "Comment 2", "Author 2", postId, LocalDateTime.now())
        );
        when(commentRepository.findByPostId(postId)).thenReturn(mockComments);

        List<CommentResponse> responses = commentService.getCommentByPostId(postId);

        assertEquals(2, responses.size());
        assertEquals("Comment 1", responses.get(0).getComment());
        verify(commentRepository, times(1)).findByPostId(postId);
    }

    @Test
    void testGetCommentByPostId_NotFound() {
        Long postId = 1L;
        when(commentRepository.findByPostId(postId)).thenReturn(List.of());

        List<CommentResponse> responses = commentService.getCommentByPostId(postId);

        assertTrue(responses.isEmpty());
        verify(commentRepository, times(1)).findByPostId(postId);
    }

    @Test
    void testGetCommentById_Success() {
        Long commentId = 1L;
        Comment mockComment = new Comment(commentId, "Comment", "Author", 1L, LocalDateTime.now());
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(mockComment));

        CommentResponse response = commentService.getCommentById(commentId);

        assertEquals("Comment", response.getComment());
        verify(commentRepository, times(1)).findById(commentId);
    }

    @Test
    void testGetCommentById_NotFound() {
        Long commentId = 1L;
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.getCommentById(commentId));

        assertEquals("Comment not found", exception.getMessage());
        verify(commentRepository, times(1)).findById(commentId);
    }

    @Test
    void testCreateComment() {
        Long postId = 1L;
        CommentRequest request = new CommentRequest("New Comment", "Author");
        Comment savedComment = new Comment(1L, "New Comment", "Author", postId, LocalDateTime.now());

        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        commentService.createComment(postId, request);

        verify(commentRepository, times(1)).save(any(Comment.class));
        verify(rabbitTemplate, times(1)).convertAndSend("comment-queue", postId);
    }

    @Test
    void testUpdateComment_Success() {
        Long commentId = 1L;
        Comment existingComment = new Comment(commentId, "Old Comment", "Author", 1L, LocalDateTime.now());
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        commentService.updateComment(commentId, "Updated Comment");

        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, times(1)).save(existingComment);
        assertEquals("Updated Comment", existingComment.getComment());
    }

    @Test
    void testUpdateComment_NotFound() {
        Long commentId = 1L;
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.updateComment(commentId, "Updated Comment"));

        assertEquals("Comment not found", exception.getMessage());
    }

    @Test
    void testDeleteComment_Success() {
        Long commentId = 1L;
        Comment existingComment = new Comment(commentId, "Comment", "Author", 1L, LocalDateTime.now());
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));

        commentService.deleteComment(commentId);

        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, times(1)).delete(existingComment);
    }

    @Test
    void testDeleteComment_NotFound() {
        Long commentId = 1L;
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.deleteComment(commentId));

        assertEquals("Comment not found", exception.getMessage());
    }
}
