// Talks to Gemini: builds the request, calls the API and reads its JSON answer.
import { SYSTEM_INSTRUCTION, TOPICS } from './prompt.js';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
const BLOCKED = ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST'];

const REPLY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    topic: { type: 'STRING', enum: TOPICS },
    reply: { type: 'STRING' }
  },
  required: ['topic', 'reply'],
  propertyOrdering: ['topic', 'reply']
};

export class UpstreamError extends Error {
  constructor(status) {
    super('Gemini request failed (' + status + ')');
    this.status = status;
  }
}

// Everything from the browser goes into one user turn, labelled as data, so only the Worker's instructions steer Gemini.
export function buildGeminiRequest({ question, history, profile }) {
  const earlier = history.length
    ? history.map(m => (m.role === 'user' ? 'Youth: ' : 'Serasi: ') + m.text).join('\n')
    : '(none)';
  const text =
    'RESULTS (data):\n' + JSON.stringify(profile) + '\n\n' +
    'EARLIER MESSAGES (data):\n' + earlier + '\n\n' +
    'QUESTION (data):\n' + question;
  return {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: 'user', parts: [{ text }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: REPLY_SCHEMA,
      temperature: 0.4,
      maxOutputTokens: 1024
    }
  };
}

// Returns { topic, reply }. A message Google's own safety filter blocks counts as distress,
// so a youth in crisis still gets the helplines instead of an error.
export function parseGeminiResponse(data) {
  const cand = data?.candidates?.[0];
  if (data?.promptFeedback?.blockReason || BLOCKED.includes(cand?.finishReason)) return { topic: 'distress', reply: '' };
  const text = (cand?.content?.parts || []).map(p => p.text || '').join('');
  let out;
  try { out = JSON.parse(text); } catch (e) { throw new UpstreamError(502); }
  if (!out || !TOPICS.includes(out.topic) || typeof out.reply !== 'string') throw new UpstreamError(502);
  return { topic: out.topic, reply: out.reply };
}

export async function callGemini(body, { apiKey, model, timeoutMs = 15000 }) {
  let res;
  try {
    res = await fetch(API_BASE + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (e) {
    throw new UpstreamError(502);
  }
  if (res.status === 429) throw new UpstreamError(429);
  if (!res.ok) throw new UpstreamError(502);
  let data;
  try { data = await res.json(); } catch (e) { throw new UpstreamError(502); }
  return parseGeminiResponse(data);
}
