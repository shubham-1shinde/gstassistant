import path from "path";
import  GSTService  from "../services/gst.service.js";
import { generateGSTFile } from "../services/gst.file.service.js";

export const generateGSTR1 = async(req,res)=>{

    const {businessId,month,financialYear}=req.query;

    const data = await GSTService.generateGSTR1(
        businessId,
        month,
        financialYear
    );

    res.json(data);

}

export const generateGSTR3B=async(req,res)=>{

    const {businessId,month,financialYear}=req.query;

    const data = await GSTService.generateGSTR3B(
        businessId,
        month,
        financialYear
    );

    res.json(data);

}

export const exportGST = async (req, res) => {

    const {businessId,month,financialYear}=req.body;

    try {

        const gstr1 = await GSTService.generateGSTR1(
            businessId,
            month,
            financialYear
        );

        const gstr3b = await GSTService.generateGSTR3B(
            businessId,
            month,
            financialYear
        );

        // 1. Build final GST object
        const result = {
            GSTR1: gstr1,
            GSTR3B: gstr3b
        };

        // 2. File name
        const getGSTFileName = () => {
        const date = new Date();

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `GST_${day}_${month}_${year}.json`;
        };

        const fileName = getGSTFileName();

        // 3. Save file
        const filePath = await generateGSTFile(result, fileName);
        console.log('GST file generated at:', filePath);

        // 4. Return download URL
        res.json({
            success: true,
            downloadUrl: `${process.env.BACKEND_URL}/v1/gst/download/${fileName}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};