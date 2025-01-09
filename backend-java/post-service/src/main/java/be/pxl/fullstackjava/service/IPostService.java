package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.Notification;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.domain.dto.response.ReviewEvent;

import java.util.List;

public interface IPostService {
    void createPost(PostRequest createPostRequest);

    void updatePost(Long id, PostRequest updatePostRequest);

    List<PostResponse> getApprovedAndPendingPosts();

    List<PostResponse> getRejectedPosts();

    List<PostResponse> getApprovedPosts();

    PostResponse getPostById(Long id);

    List<PostResponse> getAllDraftedPosts();

    String getPostStatus(Long postId);

    String getPostAuthor(Long postId);

    void saveNotification(NotificationRequest notificationRequest);

    List<Notification> getNotificationsByAuthor(String author);



    void receiveReview(ReviewEvent reviewEvent);
}
