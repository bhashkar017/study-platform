require('dotenv').config();

console.log('=== Environment Variables Check ===');
console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY value:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('GROQ') || k.includes('API')));
