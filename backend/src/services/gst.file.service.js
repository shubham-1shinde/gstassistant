import fs from "fs-extra";
import path from "path";

export const generateGSTFile = async (data, fileName) => {

    const dir = path.join(process.cwd(), "tmp", "gst");

    // create folder if not exists
    await fs.ensureDir(dir);

    const filePath = path.join(dir, fileName);

    const jsonData = JSON.stringify(data, null, 2);

    await fs.writeFile(filePath, jsonData, "utf8");

    return filePath;
};