package in.kalvi.repo;
import in.kalvi.model.DistrictStat;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StatRepo extends JpaRepository<DistrictStat, Long> {
}
