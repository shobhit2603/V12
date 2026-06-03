import projectModel from "../models/project.model.js";



export const createProject = async (req, res) => {

    const userId = req.user.id;


    const { title } = req.body;

    const project = await projectModel.create({
        user: userId,
        title
    })

    res.status(201).json({
        message: "Project created successfully",
        project
    });
}

export const getUserProjects = async (req, res) => {
    const userId = req.user.id;

    const projects = await projectModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Projects fetched successfully",
        projects
    });
}