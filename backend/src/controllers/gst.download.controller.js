import path from "path";
import fs from "fs";

export const downloadGSTFile = async (req, res) => {

    const { filename } = req.params;

    const filePath = path.join(process.cwd(), "tmp", "gst", filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.setHeader(
        "Content-Type",
        "application/json"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
    );

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
};