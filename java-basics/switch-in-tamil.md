# Java-ல `switch`-னா என்ன? (தமிழ்)

**ஒரு வரி answer:** ஒரே ஒரு value-ஐ பல `case`-களோட ஒப்பிட்டு (compare பண்ணி), **match ஆன block-ஐ மட்டும்** run பண்ற ஒரு control statement. `if / else if / else` ladder-க்கு ஒரு சுத்தமான alternative.

> நிஜ வாழ்க்கை உதாரணம்: ATM-ல "1 = Balance, 2 = Withdraw, 3 = Mini statement" னு போடுவாங்க. நீங்க 2 அழுத்தினா — அந்த ஒரு option மட்டும் வேலை செய்யும். அதே தான் `switch`.

---

## 1) Basic structure

```java
switch (expression) {      // ithu 1 value mattum than tharum
    case value1:
        // code
        break;             // ithu illa-na kaila viluvom (fall-through)
    case value2:
        // code
        break;
    default:
        // ethuvum match aagala-na ithu
}
```

Flow:
1. `switch`-ல இருக்கற expression-ஐ evaluate பண்ணும் (ஒரு தடவை மட்டும்).
2. ஒவ்வொரு `case`-ஓட-ம் `==` மாதிரி compare பண்ணும்.
3. Match ஆன இடத்திலிருந்து கீழ நோக்கி run ஆகும்.
4. `break` பார்த்தா அந்த switch-ஐ விட்டு வெளியேறும்.

---

## 2) எந்த data type-களை switch-ல use பண்ணலாம்

| ✅ அனுமதி | ❌ அனுமதி இல்லை |
|---|---|
| `byte`, `short`, `char`, `int` | `long` |
| `String` (Java 7 முதல்) | `float`, `double` |
| `enum` | `boolean` |
| Wrapper: `Byte`, `Short`, `Character`, `Integer` | |
| Java 21 முதல் — pattern / `null` case | |

---

## 3) `break` மறந்தா என்ன ஆகும்? → Fall-through

`break` இல்லைனா, match ஆன case-லிருந்து **கீழே இருக்கற எல்லா case-ம்** run ஆகும். இது bug-ஆ இருக்கலாம், சில சமயம் feature-ஆ-வும் use பண்ணலாம் (உ.ம்: "case 1, 2" இரண்டுக்கும் ஒரே logic).

```java
int mark = 2;
switch (mark) {
    case 1: System.out.println("One");
    case 2: System.out.println("Two");
    case 3: System.out.println("Three");
}
// Output: Two
//         Three   <- break illa, so ithu-um print aachu
```

---

## 4) Arrow style (`->`) — இது தான் இப்போ recommended (Java 14+)

* `break` தேவையே இல்லை (fall-through கிடையாது).
* ஒரு case-ல ஒரே line, ஆனா block `{ }`-ம் போடலாம்.
* **Switch expression**-ஆ-வும் use பண்ணி value-ஐ நேரடியா ஒரு variable-க்கு கொடுக்கலாம்:

```java
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    default -> "Other day";
};
```

Block-ல நிறைய code இருந்து, கடைசியா value return பண்ணணும்னா → `yield`:

```java
String type = switch (d) {
    case SAT, SUN -> "Weekend";
    case MON, TUE, WED, THU, FRI -> {
        String s = "Working day";
        yield s + " (" + d + ")";   // return madhiri, aana switch-ku
    }
};
```

> ⚠️ switch **expression**-ஆ use பண்ணும்போது `default` (அல்லது எல்லா enum value-யும்) இல்லைனா → "not exhaustive" compile error.

---

## 5) `if-else` vs `switch` — எப்போ எதை?

| Situation | எது best |
|---|---|
| ஒரே value, `==` compare, 3+ options | `switch` ✅ |
| Range (`marks > 60 && marks < 80`) | `if-else if` ✅ |
| `&&`, `||`, `!` mixed condition | `if-else if` ✅ |
| enum / மாதம் / day / menu option | `switch` ✅ |
| Value-ஐ நேரடியா return பண்ணணும் | `switch` expression ✅ |

`switch` readability-க்கு மட்டும் இல்ல — compiler இதை `tableswitch` / `lookupswitch` bytecode-ஆ மாத்துவதால, நிறைய case இருந்தா `if-else` chain-ஐ விட வேகமா-வும் இருக்கும்.

---

## 6) Common mistakes (இதெல்லாம் தப்பு)

1. `break` மறக்கிறது → தேவையில்லாத case-ம் run ஆகும்.
2. Duplicate case → `duplicate case label` compile error.
3. `case` label-ல variable போடுவது (traditional switch-ல constant தான் வேண்டும்; `final` ஆ இருந்தா OK).
4. `long`, `float`, `double`, `boolean`-ஐ switch பண்ண try பண்றது → compile error.
5. Arrow switch-ல `yield`-க்கு பதிலா `return` எழுதுவது (அது method-ஐ விட்டு வெளியேறிடும்).
6. `default` எழுதாம விடுவது → logic-ஐ புரிஞ்சிக்க முடியாத bug ஆகும் (expression-ஆ இருந்தா compile error-um ஆகும்).

---

## 7) இந்த Admission project-ல எங்க use பண்ணலாம்?

```java
// Console menu-driven app
System.out.println("1. Apply   2. View Status   3. Exit");
int choice = sc.nextInt();

switch (choice) {
    case 1 -> applyForAdmission(sc);
    case 2 -> showStatus(sc);
    case 3 -> System.out.println("Bye!");
    default -> System.out.println("1, 2, 3 mattum than allow!");
}
```

Vera use cases:
* **Grade calculation** — marks range-ஆ இருந்தா `if-else`, mark-ஐ 1-10 step-ஆ பாத்தா `switch`.
* **Application status** — `enum Status { PENDING, APPROVED, REJECTED }` → `switch` தான் perfect.
* **Cutoff / quota category** — `case OC, BC, MBC, SC, ST` → ஒவ்வொரு category-க்கும் தனி rule.

---

## 8) Run பண்ணி பாக்க

```bash
cd java-basics
javac SwitchDemo.java
java SwitchDemo
```

Full example: [`SwitchDemo.java`](SwitchDemo.java)

---

### சுருக்கம் (இதை மட்டும் ஞாபகம் வச்சுக்கோ)

* `switch` = **ஒரே value, பல case** — equality check மட்டும்.
* `break` (traditional) / `->` (modern) = fall-through-ஐ தடுக்கிறது.
* Java 14+ இருந்து **`case X -> value`** style தான் clean.
* Range, compound condition → `if-else`; enum / option / menu → `switch`.
* `default` எழுதுவது நல்ல practice.
