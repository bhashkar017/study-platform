require('dotenv').config();
const axios = require('axios');

console.log('Testing Gemini REST API...');
console.log('Key present:', !!process.env.GEMINI_API_KEY);
console.log('Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

async function test() {
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

        console.log('\nSending test prompt...');
        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: "Say hello in one word"
                }]
            }]
        });

        const text = response.data.candidates[0].content.parts[0].text;
        console.log('✅ SUCCESS! Response:', text);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        console.error('Status:', err.response?.status);
        console.error('Data:', err.response?.data);
    }
}

test();
