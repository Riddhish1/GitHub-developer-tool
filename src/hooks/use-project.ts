import { api } from "@/trpc/react";
import React from "react";

const useProject = () => {
    const {data: project} = api.project.getProjects.useQuery(); 
    return {
        project
    }
};

export default useProject;
