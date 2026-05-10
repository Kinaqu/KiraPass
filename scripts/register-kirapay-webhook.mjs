#!/usr/bin/env node

const baseUrl = trimSlash(process.env.KIRAPAY_BASE_URL ?? "https://api.kira-pay.com/api");
const apiKey = process.env.KIRAPAY_API_KEY;
const webhookSecret = process.env.KIRAPAY_WEBHOOK_SECRET;
const webhookUrl = process.env.KIRAPAY_WEBHOOK_URL;

if (!apiKey) fail("KIRAPAY_API_KEY is required.");
if (!webhookSecret) fail("KIRAPAY_WEBHOOK_SECRET is required.");
if (!webhookUrl) fail("KIRAPAY_WEBHOOK_URL is required, for example https://kirapass-api.example.workers.dev/api/webhooks/kirapay.");

const response = await fetch(`${baseUrl}/webhooks`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey
  },
  body: JSON.stringify({
    url: webhookUrl,
    secret: webhookSecret
  })
});

const payload = await response.json().catch(() => null);
if (!response.ok) {
  console.error(JSON.stringify(payload, null, 2));
  fail(`KIRAPAY webhook registration failed with HTTP ${response.status}.`);
}

console.log(JSON.stringify(payload, null, 2));

function trimSlash(value) {
  return value.replace(/\/$/, "");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
