// src/lib/n8nService.ts
/**
 * Service for communicating with n8n workflows
 */

// Base URL for n8n webhook
const N8N_WEBHOOK_BASE = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

/**
 * Send message to Seth agent specifically
 * @param userId - The user ID
 * @param userMessage - The user message
 * @param sessionId - Optional session ID
 */
export const sendToSethAgent = async (
  userId: string,
  userMessage: string,
  sessionId?: string
) => {
  return sendToN8nWorkflow(userId, userMessage, 'PersonalAssistant', sessionId);
};

/**
 * Legacy function for backward compatibility
 * @param response - The response message
 * @param agentType - The type of agent (e.g., 'Seth')
 * @param sessionId - The current session/conversation ID
 */
export const processAgentResponse = async (
  response: string,
  agentType: string, 
  sessionId: string
) => {
  // This function is kept for backward compatibility
  // In the new format, we don't need to process agent responses separately
  console.log('processAgentResponse called (legacy):', { response, agentType, sessionId });
  return null;
};

/**
 * Generate a unique request ID
 */
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Generate a session ID in the format: userId_agentName_timestamp
 */
const generateSessionId = (userId: string, agentName: string): string => {
  return `${userId}_${agentName}_${Date.now()}`;
};

/**
 * Send a message to n8n workflow using the exact format from BoilerplateV1
 * @param userId - The user ID
 * @param userMessage - The user message content
 * @param agentName - The agent name (e.g., 'PersonalAssistant', 'Seth')
 * @param sessionId - Optional session ID, will be generated if not provided
 * @param requestId - Optional request ID, will be generated if not provided
 */
export const sendToN8nWorkflow = async (
  userId: string,
  userMessage: string,
  agentName: string,
  sessionId?: string,
  requestId?: string
) => {
  if (!N8N_WEBHOOK_BASE || N8N_WEBHOOK_BASE === 'https://your-n8n-webhook-url') {
    console.warn('N8N webhook URL not configured, using development simulation');
    
    // Development mode simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "Hello! I'm Seth, your AI assistant. How can I help you today?",
          "I understand you're looking for assistance. What specific area would you like help with?",
          "That's a great question! Let me help you with that.",
          "I'm here to assist you with your business setup. What would you like to know?",
          "Thanks for reaching out! I can help you with various aspects of your business."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        resolve({
          response: randomResponse,
          status: 'success',
          agent: agentName,
          user_id: userId,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        });
      }, 1000 + Math.random() * 2000); // 1-3 second delay to simulate real response
    });
  }
  
  // Generate IDs if not provided
  const finalSessionId = sessionId || generateSessionId(userId, agentName);
  const finalRequestId = requestId || generateRequestId();
  
  // Create the exact payload structure from BoilerplateV1
  const payload = {
    user_id: userId,
    user_mssg: userMessage,
    session_id: finalSessionId,
    agent_name: agentName,
    timestamp_of_call_made: new Date().toISOString(),
    request_id: finalRequestId
  };
  
  try {
    const result = await fetch(N8N_WEBHOOK_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    
    const responseText = await result.text();
    
    if (!responseText || !responseText.trim()) {
      return null;
    }
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      // Return plain text response if not JSON
      return { response: responseText };
    }
  } catch (error) {
    console.error('Error sending to n8n workflow:', error);
    return null;
  }
};

const n8nService = {
  sendToN8nWorkflow,
  sendToSethAgent,
  processAgentResponse,
  generateRequestId,
  generateSessionId
};

export default n8nService;
