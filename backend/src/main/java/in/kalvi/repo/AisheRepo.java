package in.kalvi.repo;

import in.kalvi.model.AisheStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AisheRepo extends JpaRepository<AisheStat, Long> {
    List<AisheStat> findAllByOrderByCollegeCountDesc();
}
