package be.pxl.fullstackjava.repository;

import be.pxl.fullstackjava.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Review findByPostId(Long postId);
}
