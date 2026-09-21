package in.kalvi.controller;

import in.kalvi.model.College;
import in.kalvi.model.Favorite;
import in.kalvi.model.Review;
import in.kalvi.repo.CollegeRepo;
import in.kalvi.repo.FavRepo;
import in.kalvi.repo.ReviewRepo;
import in.kalvi.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CollegeController {

    private final CollegeRepo colleges;
    private final ReviewRepo reviews;
    private final FavRepo favs;
    private final JwtUtil jwt;

    public CollegeController(CollegeRepo colleges, ReviewRepo reviews, FavRepo favs, JwtUtil jwt) {
        this.colleges = colleges; this.reviews = reviews; this.favs = favs; this.jwt = jwt;
    }

    @GetMapping("/colleges")
    public List<College> list(@RequestParam(required = false) String city,
                              @RequestParam(required = false) String category,
                              @RequestParam(required = false) String q) {
        List<College> list;
        if (city != null && category != null) list = colleges.findByCityAndCategory(city, category);
        else if (city != null) list = colleges.findByCity(city);
        else if (category != null) list = colleges.findByCategory(category);
        else list = colleges.findAll();

        if (q != null && !q.isBlank()) {
            String s = q.toLowerCase();
            list = list.stream().filter(c ->
                    (c.name + " " + c.city + " " + c.category + " " + c.tags + " " + c.oneLiner + " " + c.oneLinerTa)
                            .toLowerCase().contains(s)).toList();
        }
        return list.stream().sorted((a, b) -> Double.compare(b.rating, a.rating)).toList();
    }

    @GetMapping("/colleges/{slug}")
    public ResponseEntity<?> get(@PathVariable String slug) {
        return colleges.findBySlug(slug)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/colleges/{slug}/reviews")
    public List<Review> getReviews(@PathVariable String slug) {
        return reviews.findByCollegeSlugOrderByCreatedAtDesc(slug);
    }

    @PostMapping("/colleges/{slug}/reviews")
    public ResponseEntity<?> addReview(@PathVariable String slug, @RequestBody Map<String, Object> body,
                                       Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "login required"));
        Review r = new Review();
        r.collegeSlug = slug;
        r.name = String.valueOf(body.getOrDefault("name", "Student"));
        r.stars = body.get("stars") instanceof Number n ? n.intValue() : 5;
        r.text = String.valueOf(body.getOrDefault("text", ""));
        reviews.save(r);
        return ResponseEntity.ok(r);
    }

    @GetMapping("/favs")
    public List<Favorite> favs(Authentication auth) {
        Long uid = (Long) auth.getDetails();
        return favs.findByUserId(uid);
    }

    @PostMapping("/favs/{slug}")
    public ResponseEntity<?> toggleFav(@PathVariable String slug, Authentication auth) {
        Long uid = (Long) auth.getDetails();
        return favs.findByUserIdAndCollegeSlug(uid, slug).map(f -> {
            favs.delete(f);
            return ResponseEntity.ok(Map.of("fav", false));
        }).orElseGet(() -> {
            Favorite f = new Favorite();
            f.userId = uid; f.collegeSlug = slug;
            favs.save(f);
            return ResponseEntity.ok(Map.of("fav", true));
        });
    }
}
