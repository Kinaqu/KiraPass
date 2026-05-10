#!/usr/bin/env node

const baseUrl = trimSlash(process.env.KIRAPAY_BASE_URL ?? "https://api.kira-pay.com/api");
const apiKey = process.env.KIRAPAY_API_KEY;

if (!apiKey) fail("KIRAPAY_API_KEY is required.");

const response = await fetch(`${baseUrl}/webhooks`, {
  headers: {
    "x-api-key": apiKey
  }
});

const payload = await response.json().catch(() => null);
if (!response.ok) {
  console.error(JSON.stringify(payload, null, 2));
  fail(`KIRAPAY webhook lookup failed with HTTP ${response.status}.`);
}

console.log(JSON.stringify(payload, null, 2));

function trimSlash(value) {
  return value.replace(/\/$/, "");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
