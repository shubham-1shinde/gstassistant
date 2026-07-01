import { Invoice } from "../models/invoice.model.js";
import { Purchase } from "../models/purchase.model.js";
import mongoose from "mongoose";


class GSTService {

    async getSummary(businessId, month, financialYear) {

        return await Invoice.aggregate([
            {
                $match: {
                    businessId: new mongoose.Types.ObjectId(businessId),
                    month,
                    financialYear,
                    paymentStatus: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: null,

                    taxableValue: {
                        $sum: "$taxableAmount"
                    },

                    cgst: {
                        $sum: "$cgst"
                    },

                    sgst: {
                        $sum: "$sgst"
                    },

                    igst: {
                        $sum: "$igst"
                    },

                    totalGST: {
                        $sum: "$totalGST"
                    },

                    totalInvoiceValue: {
                        $sum: "$totalAmount"
                    },

                    invoiceCount: {
                        $sum: 1
                    }
                }
            }
        ]);

    }

    async getB2BInvoices(businessId, month, financialYear) {

        return await Invoice.find({

            businessId,

            month,

            financialYear,

            paymentStatus: { $ne: "cancelled" },

            customerGstin: { $exists: true, $ne: null }

        })
        .select(
            "invoiceNumber invoiceDate customerName customerGstin placeOfSupply taxableAmount cgst sgst igst totalGST totalAmount gstRate"
        )
        .sort({ invoiceDate: 1 });

    }

    async getB2CInvoices(businessId, month, financialYear) {

        return await Invoice.find({

            businessId,

            month,

            financialYear,

            paymentStatus: { $ne: "cancelled" },

            $or: [
                { customerGstin: null },
                { customerGstin: "" }
            ]

        })
        .select(
            "invoiceNumber invoiceDate customerName placeOfSupply taxableAmount cgst sgst igst totalGST totalAmount gstRate"
        )
        .sort({ invoiceDate: 1 });

    }

    async getHSNSummary(businessId, month, financialYear) {

        return await Invoice.aggregate([

            {
                $match: {

                    businessId: new mongoose.Types.ObjectId(businessId),

                    month,

                    financialYear,

                    paymentStatus: { $ne: "cancelled" }

                }
            },

            {
                $group: {

                    _id: "$hsnCode",

                    description: {
                        $first: "$itemDescription"
                    },

                    quantity: {
                        $sum: "$quantity"
                    },

                    taxableValue: {
                        $sum: "$taxableAmount"
                    },

                    cgst: {
                        $sum: "$cgst"
                    },

                    sgst: {
                        $sum: "$sgst"
                    },

                    igst: {
                        $sum: "$igst"
                    },

                    totalGST: {
                        $sum: "$totalGST"
                    },

                    totalInvoiceValue: {
                        $sum: "$totalAmount"
                    }

                }
            },

            {
                $project: {

                    _id: 0,

                    hsnCode: "$_id",

                    description: 1,

                    quantity: 1,

                    taxableValue: 1,

                    cgst: 1,

                    sgst: 1,

                    igst: 1,

                    totalGST: 1,

                    totalInvoiceValue: 1

                }
            },

            {
                $sort: {
                    hsnCode: 1
                }
            }

        ]);

    }

    async generateGSTR1(businessId, month, financialYear) {


        const invoices = await Invoice.find({
            businessId,
            month,
            financialYear,
            paymentStatus: { $ne: "cancelled" }
        });

        const summary = await this.getSummary(
            businessId,
            month,
            financialYear
        );

        const b2b = await this.getB2BInvoices(
            businessId,
            month,
            financialYear
        );

        const b2c = await this.getB2CInvoices(
            businessId,
            month,
            financialYear
        );

        const hsn = await this.getHSNSummary(
            businessId,
            month,
            financialYear
        );


        return {
            invoices,
            summary, 
            b2b,
            b2c,
            hsn
        };

    }

    async getPurchaseSummary(businessId, month, financialYear) {

        const purchases = await Purchase.find({
            businessId,
            month,
            financialYear,
            paymentStatus: { $ne: "cancelled" }
        });

        const summary = await Purchase.aggregate([
            {
                $match: {
                    businessId: new mongoose.Types.ObjectId(businessId),
                    month,
                    financialYear,
                    paymentStatus: { $ne: "cancelled" },
                    itcEligible: true
                }
            },
            {
                $group: {

                    _id: null,

                    taxablePurchase: {
                        $sum: "$taxableAmount"
                    },

                    inputCGST: {
                        $sum: "$cgst"
                    },

                    inputSGST: {
                        $sum: "$sgst"
                    },

                    inputIGST: {
                        $sum: "$igst"
                    },

                    inputGST: {
                        $sum: "$itcClaimed"
                    }

                }
            }
        ]);

        return {
            purchases,
            summary: summary[0]
        };

    }

    async generateGSTR3B(businessId, month, financialYear){

        const sales = await this.generateGSTR1(
            businessId,
            month,
            financialYear
        );

        const purchase = await this.getPurchaseSummary(
            businessId,
            month,
            financialYear
        );

        // console.log("Sales Summary:", sales.summary);
        // console.log("Purchase Summary:", purchase.summary);

        const output = sales.summary?.[0] || {
            cgst: 0,
            sgst: 0,
            igst: 0,
            taxableValue: 0
        };

        const input = purchase.summary || {
            inputCGST: 0,
            inputSGST: 0,
            inputIGST: 0,
            inputGST: 0
        };
        const cgst = Math.max(0, output.cgst - input.inputCGST);
        const sgst = Math.max(0, output.sgst - input.inputSGST);
        const igst = Math.max(0, output.igst - input.inputIGST);
        const totalPayable = cgst + sgst + igst;
        // console.log("CGST Payable:", cgst);
        // console.log("SGST Payable:", sgst);
        // console.log("IGST Payable:", igst);
        // console.log("Total Payable:", totalPayable);

        return {
            outwardSupplies: output,
            inwardSupplies: input,
            taxPayable:{
                cgst,
                sgst,
                igst
            },
            totalPayable

        };

    }

}

export default new GSTService();