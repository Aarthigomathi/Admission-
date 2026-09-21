package in.kalvi.repo;
import in.kalvi.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface CollegeRepo extends JpaRepository<College, Long> {
    Optional<College> findBySlug(String slug);
    List<College> findByCity(String city);
    List<College> findByCategory(String category);
    List<College> findByCityAndCategory(String city, String category);
}
