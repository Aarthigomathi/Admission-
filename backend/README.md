# Backend (Spring Boot)

## Requirements

- JDK 17 (install a full JDK, not only a JRE)
- Internet access the first time you run the Maven Wrapper so it can download Maven and project dependencies

You do **not** need to install Maven globally; use the checked-in wrapper.

## Start locally

Linux/macOS/Git Bash:

```bash
cd backend
java -version
./mvnw clean test
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
java -version
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8080`. The development profile uses an in-memory H2 database, so the seed records are recreated at startup and changes are lost when the process stops. H2 console: `http://localhost:8080/h2-console`, JDBC URL `jdbc:h2:mem:tn_colleges`, username `sa`, blank password.

## Current implementation status

The application-context test verifies Spring, repositories, security configuration, and H2 start together. Unit tests cover public-registration role assignment and college ownership checks. Public registration is restricted to student accounts, and CMS/college analytics access is resolved against the authenticated database account rather than client headers. Several controller endpoints are still demo/mock implementations and must not be treated as production-ready. Before deployment, persist student/activity/enquiry/analytics data, complete ownership checks for every PII endpoint, configure a real database and environment-managed secrets, and add API integration tests.
