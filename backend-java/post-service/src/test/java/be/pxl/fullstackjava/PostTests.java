package be.pxl.fullstackjava;

import be.pxl.fullstackjava.domain.Notification;
import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.ReviewStatus;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.repository.NotificationRepository;
import be.pxl.fullstackjava.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;



@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationRepository notificationRepository;

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
        postRepository.deleteAll();
    }

    private static final String TEST_ROLE = "editor";
    private static final String TEST_NAME = "TestUser";

    @Test
    public void testGetApprovedAndPendingPosts() throws Exception {
        Post approvedPost = Post.builder()
                .title("Approved Post")
                .content("Content for approved post")
                .status(ReviewStatus.APPROVED)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        Post pendingPost = Post.builder()
                .title("Pending Post")
                .content("Content for pending post")
                .status(ReviewStatus.PENDING)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        Post draftPost = Post.builder()
                .title("Draft Post")
                .content("Content for draft post")
                .status(ReviewStatus.APPROVED)
                .isDraft(true)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(approvedPost);
        postRepository.save(pendingPost);
        postRepository.save(draftPost);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/all/approved-pending")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", TEST_NAME)
                        .header("role", TEST_ROLE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Approved Post"))
                .andExpect(jsonPath("$[1].title").value("Pending Post"));

        assertEquals(3, postRepository.findAll().size());
    }

    @Test
    public void testGetRejectedPosts() throws Exception {
        Post rejectedPost1 = Post.builder()
                .title("Rejected Post 1")
                .content("Content for rejected post 1")
                .status(ReviewStatus.REJECTED)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        Post rejectedPost2 = Post.builder()
                .title("Rejected Post 2")
                .content("Content for rejected post 2")
                .status(ReviewStatus.REJECTED)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        Post approvedPost = Post.builder()
                .title("Approved Post")
                .content("Content for approved post")
                .status(ReviewStatus.APPROVED)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(rejectedPost1);
        postRepository.save(rejectedPost2);
        postRepository.save(approvedPost);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/all/rejected")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", TEST_NAME)
                        .header("role", TEST_ROLE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Rejected Post 1"))
                .andExpect(jsonPath("$[1].title").value("Rejected Post 2"));

        assertEquals(3, postRepository.findAll().size());
    }

    @Test
    public void testGetPostById() throws Exception {
        Post post = Post.builder()
                .title("Test Post")
                .content("Content for test post")
                .status(ReviewStatus.APPROVED)
                .isDraft(false)
                .createdAt(LocalDateTime.now())
                .build();

        Post savedPost = postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/{id}", savedPost.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", TEST_NAME)
                        .header("role", TEST_ROLE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedPost.getId()))
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("Content for test post"))
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.draft").value(false));

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testReceiveNotification() throws Exception {
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .author("Jane Doe")
                .message("This is a notification message.")
                .build();

        String notificationRequestJson = objectMapper.writeValueAsString(notificationRequest);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post/notification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", TEST_NAME)
                        .header("role", TEST_ROLE)
                        .content(notificationRequestJson))
                .andExpect(status().isOk());

        long notificationCount = notificationRepository.count();
        assertEquals(1, notificationCount);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals("Jane Doe", savedNotification.getAuthor());
        assertEquals("This is a notification message.", savedNotification.getMessage());
    }


    @Test
    public void testUpdatePostWithInvalidRole() throws Exception {
        PostRequest postRequest = PostRequest.builder()
                .title("Updated Post")
                .content("Updated content")
                .build();

        String postRequestJson = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(put("/api/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user")
                        .content(postRequestJson))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: user for user: TestUser"));
    }

    @Test
    public void testGetApprovedAndPendingPostsWithValidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/approved-pending")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestEditor")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetApprovedAndPendingPostsWithInvalidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/approved-pending")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").isEmpty());
    }


    @Test
    public void testGetPostByIdWithInvalidRole() throws Exception {
        mockMvc.perform(get("/api/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "admin"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testGetRejectedPostsWithValidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/rejected")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestEditor")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetRejectedPostsWithInvalidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/rejected")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    public void testGetAllDraftedPostsWithValidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/drafted")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestEditor")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testGetAllDraftedPostsWithInvalidRole() throws Exception {
        mockMvc.perform(get("/api/post/all/drafted")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").isEmpty());
    }



}
