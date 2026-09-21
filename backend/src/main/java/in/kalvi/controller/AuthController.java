package in.kalvi.controller;

import in.kalvi.model.User;
import in.kalvi.repo.UserRepo;
import in.kalvi.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepo users;
    private final PasswordEncoder enc;
    private final JwtUtil jwt;

    public AuthController(UserRepo users, PasswordEncoder enc, JwtUtil jwt) {
        this.users = users; this.enc = enc; this.jwt = jwt;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = (body.get("email") == null ? "" : body.get("email")).trim().toLowerCase();
        if (email.isBlank() || body.get("password") == null || body.get("password").isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "email & password required"));
        if (users.existsByEmail(email))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "email already registered"));

        User u = new User();
        u.name = body.getOrDefault("name", "Student");
        u.email = email;
        u.password = enc.encode(body.get("password"));
        u.city = body.getOrDefault("city", "Chennai");
        users.save(u);
        return ResponseEntity.ok(Map.of("token", jwt.token(u.id, u.email),
                "name", u.name, "city", u.city));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = (body.get("email") == null ? "" : body.get("email")).trim().toLowerCase();
        return users.findByEmail(email)
                .filter(u -> enc.matches(body.getOrDefault("password", ""), u.password))
                .map(u -> ResponseEntity.ok(Map.of("token", jwt.token(u.id, u.email),
                        "name", u.name, "city", u.city)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid email or password")));
    }
}
