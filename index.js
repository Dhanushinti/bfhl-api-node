const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);

const buildConcatString = (data) => {
  const letters = [];
  for (const item of data || []) {
    const s = String(item);
    for (const ch of s) {
      if (/[A-Za-z]/.test(ch)) letters.push(ch);
    }
  }
  letters.reverse();
  return letters
    .map((ch, i) => (i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()))
    .join("");
};

const getUserDetails = () => {
  const fullName = (process.env.FULL_NAME || "inti_sai_dhanush").toLowerCase().replace(/\s+/g, "_");
  const dob = process.env.DOB_DDMMYYYY || "06022005";
  const email = process.env.EMAIL || "intisai.dhanush2022@vitstudent.ac.in";
  const roll = process.env.ROLL_NUMBER || "22BPS1143";
  
  return { fullName, dob, email, roll };
};

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

app.post("/bfhl", (req, res) => {
  try {
    const { fullName, dob, email, roll } = getUserDetails();
    
    const data = Array.isArray(req.body?.data) ? req.body.data.map(String) : null;
    
    if (!data) {
      return res.status(200).json({
        is_success: false,
        user_id: `${fullName}_${dob}`,
        email,
        roll_number: roll,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }
    
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    
    for (const s of data) {
      if (isIntegerString(s)) {
        const n = parseInt(s, 10);
        if (Math.abs(n) % 2 === 0) {
          even_numbers.push(s);
        } else {
          odd_numbers.push(s);
        }
        sum += n;
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }
    
    const concat_string = buildConcatString(data);
    
    return res.status(200).json({
      is_success: true,
      user_id: `${fullName}_${dob}`,
      email,
      roll_number: roll,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (e) {
    console.error("Error:", e);
    const { fullName, dob, email, roll } = getUserDetails();
    
    return res.status(500).json({
      is_success: false,
      user_id: `${fullName}_${dob}`,
      email,
      roll_number: roll,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Internal server error"
    });
  }
});


app.get("/", (req, res) => {
  res.status(200).json({
    message: "BFHL API is running!",
    endpoints: {
      "GET /bfhl": "Returns operation code",
      "POST /bfhl": "Main processing endpoint"
    },
    status: "active"
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: "Available endpoints: GET / , GET /bfhl , POST /bfhl"
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/`);
  console.log(`API endpoint: http://localhost:${port}/bfhl`);
});