const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if (user.role === "ADMIN") {
      const token = jwt.sign(
        { userId: user.email, role: user.role },
        process.env.JWT_SECRET_ADMIN
      );

      // Send response with the token or user info
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          whatsappCompatible: user.whatsappCompatible,
          anonymous: user.anonymous,
        },
      });
    }
    console.log("User logged in");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAdminPanelData = async (req, res) => {
  const { type, sort } = req.query;
  let transactions;

  if (type === "general") {
    transactions = await prisma.transaction.findMany({
      where: { collegeType: "GENERAL" },
      orderBy:
        sort === "time" ? { transactionTime: "desc" } : { amount: "desc" },
    });
  } else if (type === "collegeSpecific") {
    transactions = await prisma.transaction.findMany({
      where: { collegeType: "SPECIFIC" },
      orderBy:
        sort === "time" ? { transactionTime: "desc" } : { amount: "desc" },
    });
  }

  //   res.send("<h1>Hii</h1>");
  console.log(transactions);
  res.json(transactions);
};

module.exports = { adminlogin, getAdminPanelData };
