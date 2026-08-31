// ===== AI Assistant (Navi) - powered by Google Gemini free tier =====

const GEMINI_API_KEY = "AQ.Ab8RN6LkrJuaI-mFlFiWvR534DfOsFSQxE7VpreYYoc9Zu9gxA";
const GEMINI_MODEL = "gemini-3.1-flash-lite";

let naviConversationHistory = [];

const naviSystemPrompt = `You are Navi, the friendly AI assistant inside the NaviGuide app for
Berowra Waters Boat Hire. You help customers with three things:
1. Concierge questions about today's conditions or which boat suits their trip.
2. Questions about the NSW Boating Handbook (safety, rules, procedures).
3. Questions about how to use this app and its features.

Keep answers short, warm, and plain-English - most customers are novice boaters.
If you don't know something or it's outside these three topics, say so honestly
and suggest they ask marina staff. Never guess at navigation or safety advice
you're not confident about.`;

function openNaviChat() {
  document.getElementById("navi-chat-viewer").classList.add("open");
  toggleMenu();
  if (naviConversationHistory.length === 0) {
    renderNaviWelcome();
  }
}

function closeNaviChat() {
  document.getElementById("navi-chat-viewer").classList.remove("open");
}

function renderNaviWelcome() {
  const messagesEl = document.getElementById("navi-chat-messages");
  messagesEl.innerHTML = `
    <div class="navi-msg-bot">Hi! I can tell you about today's conditions, help pick a boat, or answer questions about boating rules and this app. What would you like to know?</div>

    <p class="navi-suggestion-heading">Concierge</p>
    <div class="navi-suggestion-row">
      <div class="navi-suggestion-chip" onclick="sendNaviSuggestion('Is today good for boating?')">Is today good for boating?</div>
      <div class="navi-suggestion-chip" onclick="sendNaviSuggestion('Recommend a boat for 8 people')">Recommend a boat for 8 people</div>
    </div>
  `;
}

function sendNaviSuggestion(text) {
  document.getElementById("navi-chat-input").value = text;
  sendNaviMessage();
}

async function sendNaviMessage() {
  const inputEl = document.getElementById("navi-chat-input");
  const text = inputEl.value.trim();
  if (!text) return;

  const messagesEl = document.getElementById("navi-chat-messages");

  const userBubble = document.createElement("div");
  userBubble.className = "navi-msg-user";
  userBubble.textContent = text;
  messagesEl.appendChild(userBubble);

  inputEl.value = "";

  const typingEl = document.createElement("div");
  typingEl.className = "navi-typing";
  typingEl.textContent = "Navi is thinking...";
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  naviConversationHistory.push({ role: "user", parts: [{ text: text }] });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: naviConversationHistory,
        systemInstruction: { parts: [{ text: naviSystemPrompt }] },
        generationConfig: {
          thinkingConfig: { thinkingLevel: "MINIMAL" }
        }
      })
    });
    const data = await response.json();

    typingEl.remove();

    if (data.candidates && data.candidates[0]) {
      const replyText = data.candidates[0].content.parts[0].text;
      naviConversationHistory.push({ role: "model", parts: [{ text: replyText }] });

      const botBubble = document.createElement("div");
      botBubble.className = "navi-msg-bot";
      botBubble.textContent = replyText;
      messagesEl.appendChild(botBubble);
    } else {
      const errBubble = document.createElement("div");
      errBubble.className = "navi-msg-bot";
      errBubble.textContent = "Sorry, I couldn't get an answer just then. Please try again, or ask marina staff.";
      messagesEl.appendChild(errBubble);
    }
  } catch (err) {
    typingEl.remove();
    const errBubble = document.createElement("div");
    errBubble.className = "navi-msg-bot";
    errBubble.textContent = "I'm having trouble connecting right now. Please check your internet connection and try again.";
    messagesEl.appendChild(errBubble);
  }

  messagesEl.scrollTop = messagesEl.scrollHeight;
}
