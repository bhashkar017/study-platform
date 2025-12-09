require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('Testing Gemini API Key...');
console.log('Key present:', !!process.env.GEMINI_API_KEY);
console.log('Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log('\nSending test prompt...');
        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Response:', text);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        console.error('Full error:', err);
    }
}

test();
