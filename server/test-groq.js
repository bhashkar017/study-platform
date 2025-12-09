require('dotenv').config();
const Groq = require('groq-sdk');

console.log('Testing Groq API Key...');
console.log('Key present:', !!process.env.GROQ_API_KEY);
console.log('Key starts with:', process.env.GROQ_API_KEY?.substring(0, 7));

async function test() {
    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        console.log('\nSending test prompt...');
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Say hello in one word" }
            ],
            max_tokens: 10
        });

        const text = completion.choices[0].message.content;
        console.log('✅ SUCCESS! Response:', text);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        console.error('Error details:', err.error || err);
    }
}

test();
