const mongoose = require("mongoose");

const SalaryTemplateSchema = new mongoose.Schema(
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
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryTemplate", SalaryTemplateSchema);
