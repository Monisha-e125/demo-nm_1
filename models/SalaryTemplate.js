const mongoose = require("mongoose");

const salaryTemplateSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      required: true,
    },

    components: [
      {
        componentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SalaryComponent",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryTemplate", salaryTemplateSchema);