require('dotenv').config();
const OpenAI = require('openai');

console.log('Testing OpenAI API Key...');
console.log('Key present:', !!process.env.OPENAI_API_KEY);
console.log('Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 7));

async function test() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        console.log('\nSending test prompt...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "Say hello in one word" }
            ],
            max_tokens: 10
        });

        const text = completion.choices[0].message.content;
        console.log('✅ SUCCESS! Response:', text);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        console.error('Error code:', err.code);
        console.error('Error type:', err.type);
    }
}

test();
