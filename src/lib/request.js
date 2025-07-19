async function getAICommands(uuid, question) {
  // Generate a unique ID for the conversation
  const requestBody = {
    input: `The Question is ${question}` || '',
    uuid: uuid
  };
  const response = await fetchUrl(requestBody);
  return response.response;
}

async function initializeConversationId(language) {
  const requestBody = {
    input: `There are only two formats for your answer. 
     First is the command (The head of your answer must be "#command", and the content is the single or multiple commands),
     second is the advice (The head of your answer must be "@advice", and the content is your advice or question to get clear demand).
     You must reasonably choose one of formats to answer me .
     You must answer me in ${language}.` || '',
  };

  const response = await fetchUrl(requestBody);
  return response.uuid;

}

async function fetchUrl(requestBody) {

  const apiUrl = 'http://2025hackathon-steel.vercel.app/api/ask';

  try {
    const fetch = global.fetch || (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const res = await response.text();
    const jsonResponse = JSON.parse(res);
    return jsonResponse
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

/**
 * Check and fix command
 * @param {string[]} cmd - Command argument array
 * @returns {Promise<true|string>} - Return true if valid, otherwise return the corrected command string
 */
async function checkValidCmd(cmd) {
  const question = `
Please determine whether the following is a valid command line instruction: \"${cmd.join(' ')}\".
If it is, just return true or false.`;
  // Assume uuid is available (e.g. use initializeConversationId('en-US'))
  const aiResponse = await getAICommands(null, question);
  return aiResponse;
}

module.exports = {
  fetchUrl,
  getAICommands,
  initializeConversationId,
  checkValidCmd
};
