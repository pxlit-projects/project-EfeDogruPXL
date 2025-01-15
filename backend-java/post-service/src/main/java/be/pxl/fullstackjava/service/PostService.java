package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.Notification;
import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.ReviewStatus;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.domain.dto.response.ReviewEvent;
import be.pxl.fullstackjava.repository.NotificationRepository;
import be.pxl.fullstackjava.repository.PostRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Builder
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);


    public void createPost(PostRequest createPostRequest) {

        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .author(createPostRequest.getAuthor())
                .createdAt(java.time.LocalDateTime.now())
                .status(ReviewStatus.PENDING)
                .isDraft(createPostRequest.isDraft())
                .build();
        postRepository.save(post);
        log.info("Post created successfully with ID={}", post.getId());
//        rabbitTemplate.convertAndSend("post-queue", post.getId());
    }

    public void updatePost(Long id, PostRequest updatePostRequest) {
        log.info("Updating post with ID={}", id);
        Post post = postRepository.findById(id).orElseThrow(() -> {
            log.error("Post not found for ID={}", id);
            return new RuntimeException("Post not found");
        });

        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());
        post.setAuthor(updatePostRequest.getAuthor());
        post.setDraft(updatePostRequest.isDraft());
        post.setStatus(ReviewStatus.PENDING);
        postRepository.save(post);
        log.info("Post with ID={} updated successfully", id);
    }

    public List<PostResponse> getApprovedAndPendingPosts() {
        log.info("Fetching all approved and pending posts");
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .filter(post ->
                        (post.getStatus() == ReviewStatus.PENDING || post.getStatus() == ReviewStatus.APPROVED)
                                && !post.isDraft()
                )
                .map(this::mapToResponse)
                .toList();
    }

    public List<PostResponse> getRejectedPosts() {
        log.info("Fetching all rejected posts");
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .filter(post -> post.getStatus() == ReviewStatus.REJECTED)
                .map(this::mapToResponse)
                .toList();
    }

    public List<PostResponse> getApprovedPosts() {
        log.info("Fetching all approved posts");
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .filter(post -> post.getStatus() == ReviewStatus.APPROVED)
                .map(this::mapToResponse)
                .toList();
    }

    public PostResponse getPostById(Long id) {
        log.info("Fetching post with ID={}", id);
        Post post = postRepository.findById(id).orElseThrow();
        return mapToResponse(post);
    }

    public List<PostResponse> getAllDraftedPosts(){
        log.info("Fetching all drafted posts");
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .filter(Post::isDraft)
                .map(this::mapToResponse)
                .toList();
    }

    public String getPostStatus(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found for ID: " +  postId));
        return post.getStatus().toString();
    }

    public String getPostAuthor(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found for ID: " +  postId));
        return post.getAuthor();
    }

    private PostResponse mapToResponse(Post post) {

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .isDraft(post.isDraft())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt().toString())
                .build();
    }

    public void saveNotification(NotificationRequest notificationRequest) {
        log.info("Saving notification for author '{}': {}", notificationRequest.getAuthor(), notificationRequest.getMessage());

        Notification notification = Notification.builder()
                .author(notificationRequest.getAuthor())
                .message(notificationRequest.getMessage())
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
        log.info("Notification saved successfully for author '{}'", notificationRequest.getAuthor());
    }

    public List<Notification> getNotificationsByAuthor(String author) {
        log.info("Fetching notifications for author '{}'", author);
        return notificationRepository.findByAuthor(author);
    }

    @RabbitListener(queues = "review-queue")
    public void receiveReview(ReviewEvent reviewEvent) {
        log.info("Received review event for postId={} with approval={}",
                reviewEvent.getPostId(), reviewEvent.isApproved());
        Post post = postRepository.findById(reviewEvent.getPostId())
                .orElseThrow(() -> {
                    log.error("Post not found for ID={} in review event", reviewEvent.getPostId());
                    return new RuntimeException("Post not found");
                });

        if (reviewEvent.isApproved()) {
            post.setStatus(ReviewStatus.APPROVED);
            log.info("Post with ID={} marked as APPROVED", post.getId());
        } else {
            post.setStatus(ReviewStatus.REJECTED);
            log.info("Post with ID={} marked as REJECTED", post.getId());
        }

        postRepository.save(post);
        log.info("Post with ID={} updated successfully after review event", post.getId());
    }

//    @RabbitListener(queues = "comment-queue")
//    public void receiveComment(Long postId) {
//        log.info("Received a comment for Post ID: {}", postId);
//
//        Post post = postRepository.findById(postId)
//                .orElseThrow(() -> new RuntimeException("Post not found for ID: " +  postId));
//
//    }

}
