import sandboxModel from "../models/sandbox.model.js";
import { deletePod, createPod } from "../kubernetes/pod.js";
import { deleteService, createService } from "../kubernetes/service.js";
import { v7 as uuid } from "uuid";
import { redis } from "../config/redis.js";



export const startSandbox = async (req, res) => {
    const { projectId } = req.body;
    const sandboxId = uuid();
    const userId = req.user.id;

    const isSandboxExists = await sandboxModel.findOne({
        user: userId,
    })

    if (isSandboxExists) {

        const sandboxId = isSandboxExists.sandbox;
        await deletePod(sandboxId);
        await deleteService(sandboxId);
        await redis.del(`sandbox:${sandboxId}`);
        await sandboxModel.findByIdAndDelete(isSandboxExists._id);

    }

    await createPod(sandboxId, projectId);
    await createService(sandboxId);
    await redis.set(`sandbox:${sandboxId}`, "active", "EX", 60 * 20)

    await sandboxModel.create({
        user: userId,
        sandbox: sandboxId
    })

    res.status(201).json({
        message: "Sandbox environment created successfully",
        sandboxId,
        preview: `${sandboxId}.preview.cryboy.in`,
    });
};
