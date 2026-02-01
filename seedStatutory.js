const mongoose = require("mongoose");
require("dotenv").config();

const PFConfig = require("./models/PFConfig"); // <-- path correct pannu

mongoose.connect(process.env.MONGO_URI);

(async () => {
  await PFConfig.deleteMany();

  await PFConfig.create({
    employeePercent: 12,
    employerPercent: 12,
    wageLimit: 15000,
    isActive: true
  });

  console.log("✅ PF Config Seeded Successfully");
  process.exit();
})();
