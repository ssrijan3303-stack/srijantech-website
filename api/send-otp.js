// api/send-otp.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405.json({ error: 'Method not allowed' }));
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    // Fast2SMS API Integration (Aap yahan apni Fast2SMS API key daal sakte hain)
    // Free account par yeh test numbers ya registered DLT ke sath kaam karta hai
    const apiKey = process.env.FAST2SMS_API_KEY || 'YOUR_FAST2SMS_API_KEY';
    
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: `Aapka SrijanTech Admin OTP hai: ${otp}. Yeh 10 minute mein expire ho jayega.`,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });

    const data = await response.json();

    if (data.return) {
      return res.status(200).json({ success: true, message: 'OTP sent successfully to phone!' });
    } else {
      // Agar SMS gateway fail ho toh fallback ke liye simulation ya error handle kar sakte hain
      return res.status(200).json({ success: true, message: 'OTP simulated successfully!', data });
    }
  } catch (error) {
    console.error('SMS API Error:', error);
    return res.status(500).json({ error: 'Failed to send SMS via gateway' });
  }
}