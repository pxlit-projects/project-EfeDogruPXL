package be.pxl.fullstackjava;

import be.pxl.fullstackjava.client.PostServiceClient;
import be.pxl.fullstackjava.domain.Review;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.ReviewRequest;
import be.pxl.fullstackjava.domain.dto.response.ReviewResponse;
import be.pxl.fullstackjava.repository.ReviewRepository;
import be.pxl.fullstackjava.service.ReviewService;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Unit test for Review Service.
 */
@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class ReviewTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewService reviewService;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @MockBean
    private PostServiceClient postServiceClient;

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
        reviewRepository.deleteAll();
    }

    @Test
    public void testMakeReview() {
        // Prepare test data
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Great post!")
                .author("Jane Doe")
                .isApproved(true)
                .build();

        // Mock the PostServiceClient to return a "PENDING" status
        Mockito.when(postServiceClient.getPostStatus(1L)).thenReturn("PENDING");

        // Call the method
        reviewService.makeReview(1L, reviewRequest);

        // Assert the review was saved
        List<Review> reviews = reviewRepository.findAll();
        assertEquals(1, reviews.size());
        assertEquals("Great post!", reviews.get(0).getContent());
        assertEquals("Jane Doe", reviews.get(0).getAuthor());
        assertTrue(reviews.get(0).isApproved());

        // Verify RabbitTemplate was called
        Mockito.verify(rabbitTemplate, Mockito.times(1)).convertAndSend(Mockito.anyString(), Optional.ofNullable(Mockito.any()));
    }

    @Test
    public void testMakeReviewEndpoint() throws Exception {
        // Prepare test data
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Great post!")
                .author("Jane Doe")
                .isApproved(true)
                .build();

        // Convert ReviewRequest to JSON
        String reviewRequestJson = objectMapper.writeValueAsString(reviewRequest);

        // Mock PostServiceClient response
        Mockito.when(postServiceClient.getPostStatus(1L)).thenReturn("PENDING");

        // Perform MockMvc request with headers
        mockMvc.perform(post("/api/review/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "editor")
                        .content(reviewRequestJson))
                .andExpect(status().isOk());

        // Verify review was saved
        assertEquals(1, reviewRepository.count());
    }


    @Test
    public void testGetReviewByPostId() throws Exception {
        // Save a review
        Review review = Review.builder()
                .content("Great post!")
                .author("Jane Doe")
                .postId(1L)
                .createdAt(LocalDateTime.now())
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        // Perform the MockMvc request with headers
        mockMvc.perform(get("/api/review/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postId").value(1L))
                .andExpect(jsonPath("$.content").value("Great post!"))
                .andExpect(jsonPath("$.author").value("Jane Doe"))
                .andExpect(jsonPath("$.approved").value(true));
    }

    @Test
    public void testMakeReviewAccessDenied() throws Exception {
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Great post!")
                .author("Jane Doe")
                .isApproved(true)
                .build();

        String reviewRequestJson = objectMapper.writeValueAsString(reviewRequest);

        // Perform MockMvc request with unauthorized role
        mockMvc.perform(post("/api/review/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestUser")
                        .header("role", "user")
                        .content(reviewRequestJson))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").value("Access denied for role: user"));
    }

    @Test
    public void testMakeReviewWithValidRole() throws Exception {
        // Prepare test data
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Great post!")
                .author("Jane Doe")
                .isApproved(true)
                .build();

        String reviewRequestJson = objectMapper.writeValueAsString(reviewRequest);

        // Mock PostServiceClient response for post status
        Mockito.when(postServiceClient.getPostStatus(Mockito.eq(1L))).thenReturn("PENDING");

        // Perform MockMvc request with valid role
        mockMvc.perform(post("/api/review/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("name", "TestEditor")
                        .header("role", "editor")
                        .content(reviewRequestJson))
                .andExpect(status().isOk());

        // Verify the review was saved
        assertEquals(1, reviewRepository.count());
    }




    @Test
    public void testSendNotification() {
        // Mock the PostServiceClient response
        Mockito.when(postServiceClient.getAuthor(1L)).thenReturn("John Doe");

        // Call the sendNotification method
        reviewService.sendNotification(1L, true);

        // Verify PostServiceClient was called
        Mockito.verify(postServiceClient).getAuthor(1L);

        // Verify NotificationRequest was sent
        NotificationRequest expectedRequest = NotificationRequest.builder()
                .author("John Doe")
                .message("Your post with ID 1 has been approved.")
                .build();
        Mockito.verify(postServiceClient).sendNotification(expectedRequest);
    }

    @Test
    public void testDeleteReview() {
        // Save a review
        Review review = Review.builder()
                .content("Great post!")
                .author("Jane Doe")
                .postId(1L)
                .createdAt(LocalDateTime.now())
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        // Call deleteReview
        reviewService.deleteReview(1L);

        // Verify the review was deleted
        assertEquals(0, reviewRepository.count());
    }

    @Test
    public void testGetReviewByPostId_NoReviewFound() {
        // Test when no review exists for the post ID
        ReviewResponse response = reviewService.getReviewByPostId(1L);
        assertNull(response);
    }

    @Test
    public void testGetReviewByPostId_ReviewFound() {
        // Save a review
        Review review = Review.builder()
                .content("Great post!")
                .author("Jane Doe")
                .postId(1L)
                .createdAt(LocalDateTime.now())
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        // Call the service
        ReviewResponse response = reviewService.getReviewByPostId(1L);
        assertNotNull(response);
        assertEquals("Great post!", response.getContent());
        assertEquals("Jane Doe", response.getAuthor());
        assertTrue(response.isApproved());
    }

    @Test
    public void testSendNotification_Approved() {
        // Mock the PostServiceClient response
        Mockito.when(postServiceClient.getAuthor(1L)).thenReturn("John Doe");

        // Call the sendNotification method for an approved post
        reviewService.sendNotification(1L, true);

        // Verify notification content
        Mockito.verify(postServiceClient).getAuthor(1L);
        Mockito.verify(postServiceClient).sendNotification(
                NotificationRequest.builder()
                        .author("John Doe")
                        .message("Your post with ID 1 has been approved.")
                        .build()
        );
    }

    @Test
    public void testSendNotification_Rejected() {
        // Mock the PostServiceClient response
        Mockito.when(postServiceClient.getAuthor(1L)).thenReturn("John Doe");

        // Call the sendNotification method for a rejected post
        reviewService.sendNotification(1L, false);

        // Verify notification content
        Mockito.verify(postServiceClient).getAuthor(1L);
        Mockito.verify(postServiceClient).sendNotification(
                NotificationRequest.builder()
                        .author("John Doe")
                        .message("Your post with ID 1 has been rejected.")
                        .build()
        );
    }

    @Test
    public void testMakeReview_PostNotPending() {
        // Mock the PostServiceClient to return a non-pending status
        Mockito.when(postServiceClient.getPostStatus(1L)).thenReturn("APPROVED");

        // Attempt to create a review and expect an exception
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Great post!")
                .author("Jane Doe")
                .isApproved(true)
                .build();

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                reviewService.makeReview(1L, reviewRequest)
        );
        assertEquals("Post must be in PENDING status to be reviewed", exception.getMessage());
    }

    @Test
    public void testMakeReview_DeleteExistingReview() {
        // Mock the PostServiceClient to return "PENDING" status
        Mockito.when(postServiceClient.getPostStatus(1L)).thenReturn("PENDING");

        // Save an existing review
        Review existingReview = Review.builder()
                .content("Old review")
                .author("John Doe")
                .postId(1L)
                .createdAt(LocalDateTime.now())
                .isApproved(false)
                .build();
        reviewRepository.save(existingReview);

        // Create a new review
        ReviewRequest reviewRequest = ReviewRequest.builder()
                .content("Updated review")
                .author("Jane Doe")
                .isApproved(true)
                .build();
        reviewService.makeReview(1L, reviewRequest);

        // Assert the old review was deleted and the new review was saved
        List<Review> reviews = reviewRepository.findAll();
        assertEquals(1, reviews.size());
        assertEquals("Updated review", reviews.get(0).getContent());
        assertEquals("Jane Doe", reviews.get(0).getAuthor());
        assertTrue(reviews.get(0).isApproved());
    }

    @Test
    public void testDeleteReview_NoReviewFound() {
        // Attempt to delete a non-existent review
        reviewService.deleteReview(1L);

        // Ensure no reviews exist in the repository
        assertEquals(0, reviewRepository.count());
    }

    @Test
    public void testDeleteReview_ReviewExists() {
        // Save a review
        Review review = Review.builder()
                .content("Great post!")
                .author("Jane Doe")
                .postId(1L)
                .createdAt(LocalDateTime.now())
                .isApproved(true)
                .build();
        reviewRepository.save(review);

        // Call deleteReview
        reviewService.deleteReview(1L);

        // Verify the review was deleted
        assertEquals(0, reviewRepository.count());
    }
}
