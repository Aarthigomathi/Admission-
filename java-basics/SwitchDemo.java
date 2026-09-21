/*
 * Java switch - full demo  (Java 17+)
 *
 * Run:
 *   javac SwitchDemo.java
 *   java SwitchDemo
 *
 * Expected output:
 *   Wednesday
 *   Two
 *   Three
 *   Wednesday
 *   Days = 30
 *   Full access
 *   Working day (WED)
 */
public class SwitchDemo {

    // enum - switch-oda best friend
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    public static void main(String[] args) {

        // ---------- 1) Old style (traditional) switch ----------
        int day = 3;
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:                       // ethuvum match aagala-na ithu run aagum
                System.out.println("Other day");
        }

        // ---------- 2) break illaama = fall-through ----------
        int mark = 2;
        switch (mark) {
            case 1:
                System.out.println("One");
            case 2:
                System.out.println("Two");     // match aanathu ithu
            case 3:
                System.out.println("Three");   // break illa -> ithuvum run aagum!
        }

        // ---------- 3) Arrow style (Java 14+) - break thevai illa ----------
        String dayName = switch (day) {        // switch EXPRESSION -> value return pannuthu
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            default -> "Other day";
        };
        System.out.println(dayName);

        // ---------- 4) Ore case-lla pala value ----------
        int month = 4;
        int days = switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> 31;
            case 4, 6, 9, 11 -> 30;
            case 2 -> 28;
            default -> 0;
        };
        System.out.println("Days = " + days);

        // ---------- 5) String-ah switch panna mudiyum ----------
        String role = "admin";
        switch (role) {
            case "admin"   -> System.out.println("Full access");
            case "student" -> System.out.println("Apply only");
            default        -> System.out.println("Guest");
        }

        // ---------- 6) enum + yield (block-lla value return) ----------
        Day d = Day.WED;
        String type = switch (d) {
            case SAT, SUN -> "Weekend";
            case MON, TUE, WED, THU, FRI -> {
                String s = "Working day";       // block-lla extra code ok
                yield s + " (" + d + ")";       // "yield" = value-ah veliya anuppu
            }
            // enum-la ella constant-um cover aagiduchu -> default thevai illa
        };
        System.out.println(type);

        // ---------- 7) Ithu compile aagaathu (error) ----------
        // case 1 -> "a";
        // case 1 -> "b";   // duplicate label -> "duplicate case label" error
        //
        // long x = 5;
        // switch (x) { }   // long / float / double / boolean -> switch-ku allow illa
    }
}
