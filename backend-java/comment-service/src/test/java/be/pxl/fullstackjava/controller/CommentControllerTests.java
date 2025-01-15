package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.Comment;
import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.repository.CommentRepository;
import be.pxl.fullstackjava.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentControllerTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentService commentService;

    @MockBean
    private RabbitTemplate rabbitTemplate;


    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");


    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void cleanDatabase() {
        commentRepository.deleteAll();
    }

    @Test
    public void testCreateComment() throws Exception {
        CommentRequest request = CommentRequest.builder()
                .author("Jane Doe")
                .comment("This is a test comment")
                .build();

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/comment/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user")
                        .content(requestJson))
                .andExpect(status().isOk());

        assertEquals(1, commentRepository.findAll().size());
        verify(rabbitTemplate, times(1)).convertAndSend(Mockito.eq("comment-queue"), Mockito.eq(1L));
    }



    @Test
    public void testGetCommentByPostId_NoCommentsFound() throws Exception {
        mockMvc.perform(get("/api/comment/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testGetCommentByPostId_CommentsFound() throws Exception {
        Comment comment1 = Comment.builder()
                .postId(1L)
                .comment("Comment 1")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment comment2 = Comment.builder()
                .postId(1L)
                .comment("Comment 2")
                .author("John Smith")
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.saveAll(List.of(comment1, comment2));

        mockMvc.perform(get("/api/comment/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].comment").value("Comment 1"))
                .andExpect(jsonPath("$[1].comment").value("Comment 2"));
    }

    @Test
    public void testGetCommentById_Found() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Comment 1")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        mockMvc.perform(get("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comment").value("Comment 1"))
                .andExpect(jsonPath("$.author").value("Jane Doe"));
    }

    @Test
    public void testUpdateComment_Success() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Old Comment")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        String updatedText = "Updated Comment";

        mockMvc.perform(put("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user")
                        .content(updatedText))
                .andExpect(status().isOk());

        Comment updatedComment = commentRepository.findById(savedComment.getId()).orElseThrow();
        assertEquals(updatedText, updatedComment.getComment());
    }

    @Test
    public void testDeleteComment_Success() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Comment to delete")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        mockMvc.perform(delete("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isOk());

        assertEquals(0, commentRepository.count());
    }

    @Test
    public void testCreateComment_AccessDeniedForInvalidRole() throws Exception {
        CommentRequest request = CommentRequest.builder()
                .author("Jane Doe")
                .comment("This is a test comment")
                .build();

        String requestJson = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/comment/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "admin") // Invalid role
                        .content(requestJson))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: admin for user: TestUser"));
    }

    @Test
    public void testGetCommentByPostId_AccessDeniedForInvalidRole() throws Exception {
        mockMvc.perform(get("/api/comment/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "admin")) // Invalid role
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: admin for user: TestUser"));
    }

    @Test
    public void testGetCommentById_AccessDeniedForInvalidRole() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Comment 1")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        mockMvc.perform(get("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "moderator")) // Invalid role
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: moderator for user: TestUser"));
    }

    @Test
    public void testUpdateComment_AccessDeniedForInvalidRole() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Old Comment")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        String updatedText = "Updated Comment";

        mockMvc.perform(put("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "guest") // Invalid role
                        .content(updatedText))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: guest for user: TestUser"));
    }

    @Test
    public void testDeleteComment_AccessDeniedForInvalidRole() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .comment("Comment to delete")
                .author("Jane Doe")
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        mockMvc.perform(delete("/api/comment/" + savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "admin")) // Invalid role
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: admin for user: TestUser"));
    }


}
