const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const centres = [
  { id:"karimnagar-ppc", name:"Karimnagar PPC", crop:"Paddy · Grade A", load:52, queue:11, wait:"35 min" },
  { id:"huzurabad-pacs", name:"Huzurabad PACS", crop:"Paddy · Common", load:94, queue:34, wait:"2 hr 10 min" },
  { id:"jammikunta-ikp", name:"Jammikunta IKP", crop:"Opens 14 Nov", load:0, queue:0, wait:"—" },
  { id:"choppadandi-ppc", name:"Choppadandi PPC", crop:"Paddy · Common", load:71, queue:19, wait:"1 hr" },
  { id:"manakondur-pacs", name:"Manakondur PACS", crop:"Paddy · Grade A", load:38, queue:6, wait:"20 min" }
];

const bookings = [];
const otps = new Map();

app.get("/api/health", (req, res) => {
  res.json({ ok:true, service:"AgriQueue API", time:new Date().toISOString() });
});

app.get("/api/centres", (req, res) => {
  res.json({ centres });
});

app.get("/api/token/:token", (req, res) => {
  const token = req.params.token.toUpperCase();
  const booking = bookings.find(b => b.token === token);

  if (!booking && token !== "KRM-0342") {
    return res.status(404).json({ error:"Token not found" });
  }

  res.json({
    token,
    centre: booking?.centre || "Karimnagar PPC",
    position: booking?.position || 4,
    eta: booking?.eta || "11:20 am",
    status: booking?.status || "In queue",
    quantityQuintals: booking?.quantityQuintals || 42.5,
    slot: booking?.slot || "10:30–11:30"
  });
});

app.post("/api/auth/send-otp", (req, res) => {
  const mobile = String(req.body?.mobile || "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error:"Enter a valid 10-digit mobile number" });
  }

  // Demo only. Never log/store real OTPs in a production application.
  const otp = "4271";
  otps.set(mobile, { otp, expiresAt:Date.now() + 5 * 60 * 1000 });

  res.json({ ok:true, message:"Demo OTP generated", demoOtp:otp });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const mobile = String(req.body?.mobile || "").replace(/\D/g, "");
  const otp = String(req.body?.otp || "");
  const record = otps.get(mobile);

  if (!record || record.expiresAt < Date.now() || record.otp !== otp) {
    return res.status(401).json({ error:"Invalid or expired OTP" });
  }

  res.json({
    ok:true,
    user:{ name:"Ravi", mobile:"******" + mobile.slice(-4) },
    token:crypto.randomUUID()
  });
});

app.post("/api/bookings", (req, res) => {
  const { mobile, centre, crop, quantityQuintals, slot } = req.body || {};
  const qty = Number(quantityQuintals);

  if (!mobile || !centre || !crop || !Number.isFinite(qty) || qty <= 0 || !slot) {
    return res.status(400).json({ error:"mobile, centre, crop, quantityQuintals and slot are required" });
  }

  const token = "KRM-" + String(342 + bookings.length + 1).padStart(4, "0");
  const booking = {
    token,
    mobile:String(mobile),
    centre:String(centre),
    crop:String(crop),
    quantityQuintals:qty,
    slot:String(slot),
    position:4,
    eta:"11:20 am",
    status:"In queue",
    createdAt:new Date().toISOString()
  };

  bookings.push(booking);
  res.status(201).json({ ok:true, booking });
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AgriQueue running on http://localhost:${PORT}`);
});
