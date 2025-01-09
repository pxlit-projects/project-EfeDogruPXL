package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.client.PostServiceClient;
import be.pxl.fullstackjava.domain.Review;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.ReviewRequest;
import be.pxl.fullstackjava.domain.dto.response.ReviewEvent;
import be.pxl.fullstackjava.domain.dto.response.ReviewResponse;
import be.pxl.fullstackjava.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@Service
@Builder
@AllArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;
    private PostServiceClient postServiceClient;
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);


    public ReviewResponse getReviewByPostId(Long postId) {
        log.info("Fetching review for postId={}", postId);

        Review review = reviewRepository.findByPostId(postId);
        if (review == null) {
            log.warn("No review found for postId={}", postId);
            return null;
        }

        log.debug("Review found for postId={}: {}", postId, review);
        return ReviewResponse.builder()
                .content(review.getContent())
                .author(review.getAuthor())
                .postId(review.getPostId())
                .isApproved(review.isApproved())
                .build();
    }

    public void sendNotification(Long postId, boolean isApproved) {
        log.info("Sending notification for postId={}", postId);

        String postAuthor = postServiceClient.getAuthor(postId);
        String message;
        if (isApproved) {
             message = "Your post with ID " + postId + " has been approved.";
        }else {
             message = "Your post with ID " + postId + " has been rejected.";
        }


        NotificationRequest notificationRequest = NotificationRequest.builder()
                .author(postAuthor)
                .message(message)
                .build();

        postServiceClient.sendNotification(notificationRequest);
        log.info("Notification sent to author '{}' for postId={}", postAuthor, postId);

    }

    public void makeReview(Long postId, ReviewRequest reviewRequest) {
        log.info("Creating review for postId={} by author={}", postId, reviewRequest.getAuthor());

        String postStatus = postServiceClient.getPostStatus(postId);
        if (!"PENDING".equalsIgnoreCase(postStatus)) {
            throw new IllegalStateException("Post must be in PENDING status to be reviewed");
        }

        if (reviewRepository.findByPostId(postId) != null) {
            log.warn("Review already exists for postId={}", postId);
            deleteReview(postId);
        }


        Review review = Review.builder()
                .content(reviewRequest.getContent())
                .author(reviewRequest.getAuthor())
                .postId(postId)
                .createdAt(LocalDateTime.now())
                .isApproved(reviewRequest.isApproved())
                .build();

        reviewRepository.save(review);
        log.info("Review saved successfully for postId={}", postId);

        ReviewEvent event = ReviewEvent.builder()
                .postId(review.getPostId())
                .isApproved(review.isApproved())
                .build();

        rabbitTemplate.convertAndSend("review-queue", event);
        log.info("Review event sent to queue: {}", event);

        sendNotification(postId, review.isApproved());

    }

    public void deleteReview(Long postId) {
        log.info("Deleting review for postId={}", postId);
        Review review = reviewRepository.findByPostId(postId);
        if (review == null) {
            log.warn("No review found for postId={}", postId);
            return;
        }

        reviewRepository.delete(review);
        log.info("Review deleted successfully for postId={}", postId);
    }

}
