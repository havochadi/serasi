import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGeminiRequest, parseGeminiResponse, callGemini, UpstreamError } from '../src/gemini.js';
import { SYSTEM_INSTRUCTION, TOPICS } from '../src/prompt.js';

const ASK = {
  question: 'What does a nurse do?',
  history: [{ role: 'user', text: 'Hi' }, { role: 'bot', text: 'Hello! Ask me about careers.' }],
  profile: { interest_code: 'SIA' }
};
const reply = obj => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] }, finishReason: 'STOP' }] });
const isUpstream = status => e => e instanceof UpstreamError && e.status === status;

test('the request carries the Worker’s instructions and asks for JSON with a topic', () => {
  const body = buildGeminiRequest(ASK);
  assert.equal(body.systemInstruction.parts[0].text, SYSTEM_INSTRUCTION);
  const cfg = body.generationConfig;
  assert.equal(cfg.responseMimeType, 'application/json');
  assert.deepEqual(cfg.responseSchema.properties.topic.enum, TOPICS);
  assert.deepEqual(cfg.responseSchema.required, ['topic', 'reply']);
  assert.equal(cfg.temperature, 0.4);
  assert.equal(cfg.maxOutputTokens, 1024);
});

test('results, earlier messages and the question go in one user turn, labelled as data', () => {
  const { contents } = buildGeminiRequest(ASK);
  assert.equal(contents.length, 1);
  assert.equal(contents[0].role, 'user');
  assert.equal(contents[0].parts[0].text,
    'RESULTS (data):\n{"interest_code":"SIA"}\n\n' +
    'EARLIER MESSAGES (data):\nYouth: Hi\nSerasi: Hello! Ask me about careers.\n\n' +
    'QUESTION (data):\nWhat does a nurse do?');
});

test('no earlier messages are written as (none)', () => {
  const text = buildGeminiRequest(Object.assign({}, ASK, { history: [] })).contents[0].parts[0].text;
  assert.match(text, /EARLIER MESSAGES \(data\):\n\(none\)\n/);
});

test('a reply is read from the JSON text, even when split across parts', () => {
  assert.deepEqual(parseGeminiResponse(reply({ topic: 'career', reply: 'Nurses care for patients.' })), { topic: 'career', reply: 'Nurses care for patients.' });
  const split = { candidates: [{ content: { parts: [{ text: '{"topic":"off_topic",' }, { text: '"reply":""}' }] }, finishReason: 'STOP' }] };
  assert.deepEqual(parseGeminiResponse(split), { topic: 'off_topic', reply: '' });
});

test('a message Google’s safety filter blocks is treated as distress', () => {
  assert.deepEqual(parseGeminiResponse({ promptFeedback: { blockReason: 'SAFETY' } }), { topic: 'distress', reply: '' });
  assert.deepEqual(parseGeminiResponse({ candidates: [{ finishReason: 'SAFETY' }] }), { topic: 'distress', reply: '' });
  assert.deepEqual(parseGeminiResponse({ candidates: [{ finishReason: 'PROHIBITED_CONTENT' }] }), { topic: 'distress', reply: '' });
});

test('cut-off, unknown or malformed replies are upstream errors', () => {
  const bad = [
    { candidates: [{ content: { parts: [{ text: '{"topic":"career","reply":"Nurses ca' }] }, finishReason: 'MAX_TOKENS' }] },
    reply({ topic: 'weather', reply: 'Sunny' }),
    reply({ reply: 'No topic' }),
    reply({ topic: 'career', reply: 42 }),
    { candidates: [] },
    {},
    null
  ];
  for (const data of bad) assert.throws(() => parseGeminiResponse(data), isUpstream(502));
});

test('callGemini sends the key in a header, not the URL, with a timeout', async t => {
  let seen;
  t.mock.method(globalThis, 'fetch', async (url, init) => { seen = { url, init }; return Response.json(reply({ topic: 'career', reply: 'Hi' })); });
  const out = await callGemini(buildGeminiRequest(ASK), { apiKey: 'SECRET', model: 'gemini-test' });
  assert.deepEqual(out, { topic: 'career', reply: 'Hi' });
  assert.equal(seen.url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent');
  assert.equal(seen.init.method, 'POST');
  assert.equal(seen.init.headers['x-goog-api-key'], 'SECRET');
  assert.ok(seen.init.signal instanceof AbortSignal);
});

test('callGemini maps Gemini 429 to 429, and other failures to 502', async t => {
  const cases = [
    [() => new Response('{}', { status: 429 }), 429],
    [() => new Response('{}', { status: 500 }), 502],
    [() => { throw new TypeError('network down'); }, 502],
    [() => new Response('not json', { status: 200 }), 502]
  ];
  for (const [respond, status] of cases) {
    t.mock.restoreAll();
    t.mock.method(globalThis, 'fetch', async () => respond());
    await assert.rejects(callGemini({}, { apiKey: 'k', model: 'm' }), isUpstream(status));
  }
});
