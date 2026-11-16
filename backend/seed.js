
// seedProjects.js

import "dotenv/config";
import mongoose from "mongoose";
import Project from "./models/Project.Model.js";
import dns from "dns";

const OWNER_ID = "6afb45caab3c8c60c6182e24";

const projects = [
  {
    title: "[TEST] Campus Connect",
    description: "A platform for students to connect and discover campus activities.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    rolesNeeded: ["Frontend Developer", "Backend Developer"],
    teamSize: "4",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#047857] to-[#A7F3D0]",
  },
  {
    title: "[TEST] AI Resume Reviewer",
    description: "An AI tool that reviews resumes and suggests improvements.",
    techStack: ["React", "Python", "FastAPI", "OpenAI"],
    rolesNeeded: ["AI/ML Developer", "Frontend Developer"],
    teamSize: "3",
    category: "AI/ML",
    coverImage: "bg-linear-[135deg] from-[#1E40AF] to-[#67E8F9]",
  },
  {
    title: "[TEST] Smart Attendance",
    description: "A QR-based attendance system for classrooms.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    rolesNeeded: ["Full Stack Developer", "UI Designer"],
    teamSize: "4",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#7C2D12] to-[#FDBA74]",
  },
  {
    title: "[TEST] CodeBuddy",
    description: "A peer-learning platform where students solve coding problems together.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    rolesNeeded: ["Frontend Developer", "Backend Developer"],
    teamSize: "5",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#6D28D9] to-[#C4B5FD]",
  },
  {
    title: "[TEST] Expense Splitter",
    description: "An app for roommates and friends to track shared expenses.",
    techStack: ["React Native", "Node.js", "MongoDB"],
    rolesNeeded: ["Mobile Developer", "Backend Developer"],
    teamSize: "3",
    category: "Mobile",
    coverImage: "bg-linear-[135deg] from-[#BE123C] to-[#FDA4AF]",
  },
  {
    title: "[TEST] Medivault",
    description: "A secure healthcare platform for organizing patient documents and medical information.",
    techStack: ["React", "Node.js", "MongoDB", "RAG"],
    rolesNeeded: ["Full Stack Developer", "AI/ML Developer"],
    teamSize: "5",
    category: "Healthcare",
    coverImage: "bg-linear-[135deg] from-[#065F46] to-[#6EE7B7]",
  },
  {
    title: "[TEST] Local Event Finder",
    description: "Discover college events, workshops, and meetups based on interests.",
    techStack: ["React", "Express", "MongoDB", "Mapbox"],
    rolesNeeded: ["Frontend Developer", "Backend Developer"],
    teamSize: "4",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#0F766E] to-[#99F6E4]",
  },
  {
    title: "[TEST] Smart Notes",
    description: "A note-taking app that summarizes lecture notes into revision cards.",
    techStack: ["Vue", "Python", "FastAPI", "PostgreSQL"],
    rolesNeeded: ["Frontend Developer", "AI/ML Developer"],
    teamSize: "3",
    category: "AI/ML",
    coverImage: "bg-linear-[135deg] from-[#334155] to-[#CBD5E1]",
  },
  {
    title: "[TEST] Food Waste Tracker",
    description: "Connect campus cafeterias with organizations to reduce food waste.",
    techStack: ["React", "Node.js", "MongoDB"],
    rolesNeeded: ["Full Stack Developer", "UI Designer"],
    teamSize: "4",
    category: "Social Impact",
    coverImage: "bg-linear-[135deg] from-[#365314] to-[#BEF264]",
  },
  {
    title: "[TEST] Placement Prep Hub",
    description: "Track placement preparation, mock interviews, and learning goals.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL"],
    rolesNeeded: ["Frontend Developer", "Backend Developer", "UI Designer"],
    teamSize: "5",
    category: "Education",
    coverImage: "bg-linear-[135deg] from-[#1E3A8A] to-[#93C5FD]",
  },
  {
    title: "[TEST] EcoTrack",
    description: "Track personal habits and estimate environmental impact.",
    techStack: ["Flutter", "Firebase", "Dart"],
    rolesNeeded: ["Flutter Developer", "UI Designer"],
    teamSize: "3",
    category: "Mobile",
    coverImage: "bg-linear-[135deg] from-[#166534] to-[#86EFAC]",
  },
  {
    title: "[TEST] Lost and Found",
    description: "A campus portal to report, search, and claim lost belongings.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    rolesNeeded: ["Frontend Developer", "Backend Developer"],
    teamSize: "4",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#9D174D] to-[#F9A8D4]",
  },
  {
    title: "[TEST] Study Group Matcher",
    description: "Find classmates with similar subjects, schedules, and learning goals.",
    techStack: ["React", "Python", "Django", "PostgreSQL"],
    rolesNeeded: ["Backend Developer", "Frontend Developer"],
    teamSize: "4",
    category: "Education",
    coverImage: "bg-linear-[135deg] from-[#4C1D95] to-[#DDD6FE]",
  },
  {
    title: "[TEST] SafeRoute",
    description: "Help students plan safer journeys around campus.",
    techStack: ["React Native", "Node.js", "PostgreSQL", "Maps API"],
    rolesNeeded: ["Mobile Developer", "Backend Developer"],
    teamSize: "5",
    category: "Safety",
    coverImage: "bg-linear-[135deg] from-[#9A3412] to-[#FED7AA]",
  },
  {
    title: "[TEST] Club Management Portal",
    description: "Manage college clubs, memberships, announcements, and events.",
    techStack: ["React", "Express", "MongoDB", "Tailwind CSS"],
    rolesNeeded: ["Full Stack Developer", "UI Designer"],
    teamSize: "4",
    category: "Web",
    coverImage: "bg-linear-[135deg] from-[#115E59] to-[#99F6E4]",
  },
];
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function seedProjects() {
  try {
    const mongoUri =
      process.env.MONGODB_URL || process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error("MongoDB URI missing in .env");
    }

    await mongoose.connect(mongoUri);

    const owner = new mongoose.Types.ObjectId(OWNER_ID);

    const operations = projects.map((project) => ({
      updateOne: {
        filter: {
          owner,
          title: project.title,
        },
        update: {
          $set: {
            ...project,
            owner,
            team: [owner],
          },
        },
        upsert: true,
      },
    }));

    const result = await Project.bulkWrite(operations);

    console.log("Projects seeded successfully!");
    console.log("Total projects:", projects.length);
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedProjects();