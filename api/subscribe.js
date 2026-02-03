export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  try {
    // Send request to Plunk API
    const plunkRes = await fetch("https://api.useplunk.com/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Secret key from Vercel environment variable
        Authorization: `Bearer ${process.env.PLUNK_SECRET_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await plunkRes.json();

    if (!plunkRes.ok) {
      console.error("Plunk API error:", data);
      return res.status(plunkRes.status).json({
        error: data?.message || "Plunk rejected the request",
      });
    }

    // Success response
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
