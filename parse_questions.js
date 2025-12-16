import fs from 'fs';

const inputFile = 'test.txt';
const outputFile = 'src/data/questions.json';

try {
    const data = fs.readFileSync(inputFile, 'utf-8');

    // Split by <question> tag
    const rawQuestions = data.split('<question>').filter(Boolean);

    const questions = rawQuestions.map((block, index) => {
        // Split by <variant>
        const parts = block.split('<variant>');

        // First part is the question text
        const questionText = parts[0].trim();

        // Rest are variants: first is correct answer, others are distractors
        const variants = parts.slice(1)
            .map(v => v.trim())
            .filter(Boolean);

        if (variants.length === 0) return null;

        // Remove trailing periods from the correct answer
        let answer = variants[0];
        if (answer.endsWith('.')) {
            answer = answer.slice(0, -1);
        }

        const distractors = variants.slice(1);

        // Calculate ticket number (20 questions per ticket)
        const ticketNumber = Math.floor(index / 20) + 1;

        return {
            id: `q_${index + 1}`,
            ticketNumber,
            question: questionText,
            answer,
            distractors
        };
    }).filter(Boolean);

    console.log(`✅ Parsed ${questions.length} questions`);
    console.log(`📦 Organized into ${Math.ceil(questions.length / 20)} tickets`);

    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`💾 Saved to ${outputFile}`);

} catch (err) {
    console.error('❌ Error:', err.message);
}
