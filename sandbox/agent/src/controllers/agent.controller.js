import fs from "fs/promises";
import path from "path";

const WORKDIR = '/workspace';

export const listFiles = async function (req, res) {
    async function listFilesRecursive(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
        if (file.isDirectory()) {
            if ([ 'node_modules', '.git', 'dist', 'build' ].includes(file.name)) {
                continue; // skip these directories
            }
            const subDirFiles = await listFilesRecursive(path.join(dir, file.name));
            results = results.concat(subDirFiles);
        } else {
            results.push(path.relative(WORKDIR, path.join(dir, file.name)));
        }
    }
    return results;
}
    try {
        const files = await listFilesRecursive(WORKDIR);
        res.json({
            message: 'Files listed successfully',
            files: files
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
}

export const readFiles = async function (req, res) {
    const files = req.query.files;
    if (!files) {
        return res.status(400).json({ error: 'No files provided' });
    }

    const fileList = files.split(',').map(file => file.trim());

    const result = {};

    for (const file of fileList) {
        try {
            const content = await fs.readFile(path.join(WORKDIR, file), 'utf-8');
            result[ file ] = content;
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            result[ file ] = `Error reading file: ${error.message}`;
        }
    }

    res.json({
        message: 'Files read successfully',
        files: result
    });
}

export const updateFiles = async function (req, res) {
    const files = req.body.files;
    if (!files || typeof files !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    const result = {};

    for (const [ file, content ] of Object.entries(files)) {
        try {
            try {
                await fs.access(path.dirname(path.join(WORKDIR, file)))
            }
            catch {
                await fs.mkdir(path.dirname(path.join(WORKDIR, file)), { recursive: true });
            }

            await fs.writeFile(path.join(WORKDIR, file), content, 'utf-8');
            result[ file ] = 'File updated successfully';
        } catch (error) {
            console.error(`Error updating file ${file}:`, error);
            result[ file ] = `Error updating file: ${error.message}`;
        }
    }

    res.json({
        message: 'Files updated successfully',
        files: result
    });
}