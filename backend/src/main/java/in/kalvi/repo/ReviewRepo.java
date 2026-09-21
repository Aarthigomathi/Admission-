package in.kalvi.repo;
import in.kalvi.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByCollegeSlugOrderByCreatedAtDesc(String slug);
}
