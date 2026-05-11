#!/usr/bin/env node

const apiUrl = trimSlash(process.env.KIRAPASS_API_URL ?? process.env.NEXT_PUBLIC_KIRAPASS_API_URL ?? "");
const organizerPasscode = process.env.ORGANIZER_PASSCODE;

if (!apiUrl) fail("KIRAPASS_API_URL or NEXT_PUBLIC_KIRAPASS_API_URL is required.");

const headers = { "Content-Type": "application/json" };
if (organizerPasscode) headers["x-organizer-passcode"] = organizerPasscode;

const response = await fetch(`${apiUrl}/api/reconcile/kirapay`, {
  method: "POST",
  headers
});
const payload = await response.json().catch(() => null);

if (!response.ok) {
  console.error(JSON.stringify(payload, null, 2));
  fail(`KIRAPAY reconciliation failed with HTTP ${response.status}.`);
}

console.log(JSON.stringify(payload, null, 2));

function trimSlash(value) {
  return value.replace(/\/$/, "");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
