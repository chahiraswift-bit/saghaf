/**
 * SHAGAF demo seed script.
 *
 * Creates real Supabase Auth users (so you can actually log in and click
 * through every role) plus realistic demo content: schools, teachers,
 * courses, lessons, learners, enrollments, reviews and ads.
 *
 * Requires the SERVICE ROLE key (bypasses RLS) — never expose this key to
 * the browser. Run locally only:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SEED_DEMO_PASSWORD=... npm run seed
 *
 * Or put those three values in .env.local and just run `npm run seed`.
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !DEMO_PASSWORD) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SEED_DEMO_PASSWORD (in .env.local) before running `npm run seed`."
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoSignIn: false } as any,
});

const CATEGORIES = [
  "Programming",
  "Languages",
  "Business",
  "Design",
  "Marketing",
  "Communication",
  "Technology",
  "Personal Development",
  "Other",
];

const SCHOOL_NAMES = [
  "Atlas Coding Academy",
  "Meridian Language Institute",
  "Novara Business School",
  "Pixel & Ink Design Studio",
  "Horizon Tech Center",
];

const COURSE_TITLES = [
  "Modern JavaScript from Scratch",
  "React & Next.js in Practice",
  "Python for Data Analysis",
  "UI/UX Design Foundations",
  "Business English for Professionals",
  "French Conversation Mastery",
  "Digital Marketing Essentials",
  "Public Speaking & Communication",
  "Graphic Design with Figma",
  "Introduction to Cloud Computing",
  "Project Management Fundamentals",
  "Personal Branding & Career Growth",
  "SQL & Database Design",
  "Mobile App Design Principles",
  "Copywriting that Converts",
  "Excel for Business Analysts",
  "Freelancing 101",
  "Intro to Cybersecurity",
  "Video Editing for Creators",
  "Time Management & Productivity",
];

const FIRST_NAMES = [
  "Amina", "Yacine", "Lina", "Karim", "Nour", "Sofiane", "Meriem", "Riad",
  "Sara", "Bilal", "Imane", "Walid", "Dounia", "Amine", "Rania", "Hicham",
  "Yasmine", "Nabil", "Chaima", "Farid", "Ines", "Aymen", "Nesrine", "Omar",
  "Salima", "Tarek", "Zineb", "Adel", "Manel", "Reda",
];
const LAST_NAMES = [
  "Benali", "Cherif", "Haddad", "Khaldi", "Meziane", "Saidi", "Tahar",
  "Aissani", "Bouzid", "Ferhat", "Guerroudj", "Larbi",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 7);
}

async function createUser(email: string, fullName: string, role: string) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
  if (error) {
    if (error.message.includes("already been registered")) {
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list.users.find((u) => u.email === email);
      return existing!.id;
    }
    throw error;
  }
  return data.user!.id;
}

async function main() {
  console.log("Seeding SHAGAF demo data...");

  // 1. Categories -------------------------------------------------------
  for (const name of CATEGORIES) {
    await admin.from("categories").upsert(
      { name, slug: slugify(name) },
      { onConflict: "slug", ignoreDuplicates: true }
    );
  }
  const { data: categories } = await admin.from("categories").select("id, name");

  // 2. Fixed demo accounts (one per role, easy to remember) -------------
  const demoLearnerId = await createUser("learner@shagaf.demo", "Demo Learner", "learner");
  const demoTeacherId = await createUser("teacher@shagaf.demo", "Demo Teacher", "teacher");
  const demoSchoolId = await createUser("school@shagaf.demo", "Demo School Admin", "school_admin");
  const demoAdminId = await createUser("admin@shagaf.demo", "Demo Super Admin", "super_admin");
  console.log("Created 4 fixed demo accounts (see README for credentials).");

  // 3. Bulk teachers (10) -------------------------------------------------
  const teacherIds: string[] = [demoTeacherId];
  for (let i = 0; i < 9; i++) {
    const name = `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
    const id = await createUser(`teacher${i}@shagaf.demo`, name, "teacher");
    teacherIds.push(id);
  }
  await admin
    .from("profiles")
    .update({ headline: "Educator & industry practitioner", bio: "Passionate about helping learners build real skills." })
    .in("id", teacherIds);

  // 4. Bulk learners (30, including the fixed demo learner) --------------
  const learnerIds: string[] = [demoLearnerId];
  for (let i = 0; i < 29; i++) {
    const name = `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
    const id = await createUser(`learner${i}@shagaf.demo`, name, "learner");
    learnerIds.push(id);
  }

  // 5. Schools (5), owned by school_admin accounts -----------------------
  const schoolOwnerIds: string[] = [demoSchoolId];
  for (let i = 0; i < 4; i++) {
    const name = `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
    const id = await createUser(`school${i}@shagaf.demo`, name, "school_admin");
    schoolOwnerIds.push(id);
  }

  const schoolIds: string[] = [];
  for (let i = 0; i < SCHOOL_NAMES.length; i++) {
    const name = SCHOOL_NAMES[i];
    const { data, error } = await admin
      .from("schools")
      .insert({
        owner_id: schoolOwnerIds[i],
        name,
        slug: slugify(name),
        description: `${name} is a private training center offering practical, career-focused courses to learners across Algeria.`,
        location: rand(["Algiers, Algeria", "Oran, Algeria", "Constantine, Algeria", "Annaba, Algeria"]),
        status: "approved",
        verified: true,
      })
      .select("id")
      .single();
    if (error) throw error;
    schoolIds.push(data.id);

    // attach 2 teachers per school
    const shuffled = [...teacherIds].sort(() => Math.random() - 0.5);
    await admin.from("school_teachers").insert([
      { school_id: data.id, teacher_id: shuffled[0] },
      { school_id: data.id, teacher_id: shuffled[1] },
    ]);
  }

  // 6. Courses (20) --------------------------------------------------------
  const courseIds: string[] = [];
  for (let i = 0; i < COURSE_TITLES.length; i++) {
    const title = COURSE_TITLES[i];
    const teacher = rand(teacherIds);
    const school = Math.random() > 0.2 ? rand(schoolIds) : null; // some independent teachers
    const category = rand(categories ?? []);
    const { data, error } = await admin
      .from("courses")
      .insert({
        title,
        slug: slugify(title),
        teacher_id: teacher,
        school_id: school,
        category_id: category?.id ?? null,
        description:
          `A hands-on, practical course covering everything you need to go from fundamentals to real-world application in ${title.toLowerCase()}. Built for learners who want skills they can use immediately.`,
        level: rand(["beginner", "intermediate", "advanced"]),
        mode: rand(["online", "offline", "hybrid"]),
        language: rand(["en", "fr"]),
        price_dzd: rand([0, 2500, 4000, 6000, 8500, 12000]),
        status: "published",
        duration_hours: rand([6, 10, 15, 20, 30]),
      })
      .select("id")
      .single();
    if (error) throw error;
    courseIds.push(data.id);

    // 4-6 lessons per course
    const lessonCount = 4 + Math.floor(Math.random() * 3);
    const lessons = Array.from({ length: lessonCount }).map((_, idx) => ({
      course_id: data.id,
      title: `Lesson ${idx + 1}: ${["Getting Started", "Core Concepts", "Hands-on Practice", "Case Study", "Putting it Together", "Final Project"][idx] ?? "Advanced Topics"}`,
      content: "Lesson content and instructions go here.",
      order_index: idx + 1,
      duration_minutes: rand([15, 20, 30, 45]),
    }));
    await admin.from("course_lessons").insert(lessons);
  }

  // 7. Enrollments + progress + reviews -------------------------------------
  for (const learnerId of learnerIds) {
    const enrollCount = 1 + Math.floor(Math.random() * 4);
    const chosenCourses = [...courseIds].sort(() => Math.random() - 0.5).slice(0, enrollCount);
    for (const courseId of chosenCourses) {
      await admin.from("enrollments").insert({ learner_id: learnerId, course_id: courseId });

      const { data: lessons } = await admin
        .from("course_lessons")
        .select("id")
        .eq("course_id", courseId);
      if (lessons) {
        const completedCount = Math.floor(Math.random() * lessons.length);
        for (let i = 0; i < completedCount; i++) {
          await admin.from("lesson_progress").insert({
            learner_id: learnerId,
            lesson_id: lessons[i].id,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString(),
          });
        }
      }

      if (Math.random() > 0.5) {
        await admin.from("reviews").insert({
          learner_id: learnerId,
          course_id: courseId,
          rating: rand([3, 4, 4, 5, 5]),
          comment: rand([
            "Really practical and easy to follow.",
            "Great instructor, learned a lot in a short time.",
            "Solid course, would recommend to a friend.",
            "Clear explanations and useful exercises.",
            "Exactly what I needed to get started.",
          ]),
        });
      }
    }
  }

  // 8. Advertisements -------------------------------------------------------
  for (const schoolId of schoolIds) {
    await admin.from("advertisements").insert({
      school_id: schoolId,
      target_type: "school",
      title: "Featured this month",
      status: rand(["approved", "pending"]),
    });
  }

  console.log("Seed complete.");
  console.log("Demo accounts (password = SEED_DEMO_PASSWORD you set):");
  console.log("  learner@shagaf.demo  (learner)");
  console.log("  teacher@shagaf.demo  (teacher)");
  console.log("  school@shagaf.demo   (school_admin)");
  console.log("  admin@shagaf.demo    (super_admin)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
