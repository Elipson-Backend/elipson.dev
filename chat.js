async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    const chatContent = document.getElementById('chat-content');
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = userInput + ' <i class="fas fa-user" style="margin: 10px;"></i>';
    chatContent.appendChild(userMessage);

    document.getElementById('user-input').value = '';

    try {
        // First, get the API key dynamically via POST
        const apiKeyResponse = await fetch('https://server.elipson.dev/api/openAiBearer', {
            method: 'POST',  // Use POST method as per your route
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const apiKeyData = await apiKeyResponse.json();
        const apiKey = apiKeyData.api_key;  // Store the API key dynamically

        // Now use that API key in the OpenAI API request
        const openAiResponse = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`  // Use the dynamically fetched API key
            },
            body: JSON.stringify({
                model: 'text-davinci-003',  // Use the correct model name
                prompt: userInput,
                max_tokens: 150,   // Adjust max_tokens or other parameters
                temperature: 0.7,   // Set temperature
                top_p: 1.0,         // Set top_p
                n: 1,               // Number of responses
                stop: null          // Optional stop sequences
            })
        });

        const data = await openAiResponse.json();

        // Handle the response and display it
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = '<i class="fas fa-project-diagram" style="margin: 10px;"></i> ' + (data.choices[0].text.trim() || "Sorry, I can't seem to remember anything right now...");
        chatContent.appendChild(aiMessage);
    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'ai-message';
        errorMessage.innerHTML = '<i class="fas fa-project-diagram" style="margin: 10px;"></i>' + "Sorry, I can't seem to remember anything right now...";
        chatContent.appendChild(errorMessage);
    }

    chatContent.scrollTop = chatContent.scrollHeight;
}