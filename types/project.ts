import projectsData from "@/data/projects.json";

export interface Project {
    id: string;
    title: string;
    title_tr?: string; // Turkish title
    category: "Mobile App" | "Web Development" | "Tools" | "All";
    image: string;
    gallery?: string[];
    description: string;
    description_tr?: string; // Turkish description
    githubUrl?: string;
    demoUrl?: string;
    technologies: string[];
    featured?: boolean;
    order?: number;
}

export const initialProjects: Project[] = projectsData as Project[];
