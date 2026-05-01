/**
 * 2FA helper script
 *
 * Usage:
 *   node scripts/twofa-test.js generate --label "email@example.com" --issuer "LeetCode Extension" --show-qr
 *   node scripts/twofa-test.js verify --secret BASE32SECRET --token 123456 --window 1
 */

import speakeasy from "speakeasy";
import qrcode from "qrcode";

const args = process.argv.slice(2);
const command = args[0];

const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = args[index + 1];
  return value !== undefined && !value.startsWith("--") ? value : fallback;
};

const hasFlag = (name) => args.includes(`--${name}`);

const printHelp = () => {
  console.log("2FA helper script\n");
  console.log("Commands:");
  console.log("  generate --label <label> --issuer <issuer> [--show-qr]");
  console.log("  verify --secret <base32> --token <otp> [--window <n>]");
  console.log("\nExamples:");
  console.log("  node scripts/twofa-test.js generate --label \"user@example.com\" --issuer \"LeetCode Extension\" --show-qr");
  console.log("  node scripts/twofa-test.js verify --secret JBSWY3DPEHPK3PXP --token 123456 --window 1");
};

const runGenerate = async () => {
  const label = getArg("label", "LeetCode Extension");
  const issuer = getArg("issuer", "LeetCode Extension");
  const showQr = hasFlag("show-qr");

  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label,
    issuer,
  });

  console.log("Generated 2FA secret:");
  console.log(`  base32: ${secret.base32}`);
  console.log(`  otpauth URL: ${otpauthUrl}`);

  if (showQr) {
    const dataUrl = await qrcode.toDataURL(otpauthUrl);
    console.log("\nQR Code Data URL:");
    console.log(dataUrl);
  }
};

const runVerify = () => {
  const secret = getArg("secret");
  const token = getArg("token");
  const window = Number(getArg("window", "1"));

  if (!secret || !token) {
    console.error("Missing required arguments: --secret and --token");
    printHelp();
    process.exit(1);
  }

  const normalizedToken = String(token).trim();
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: normalizedToken,
    window: Number.isNaN(window) ? 1 : window,
  });

  console.log(`Now: ${new Date().toISOString()}`);
  console.log(`Token verified: ${verified}`);
};

const main = async () => {
  if (!command || command === "-h" || command === "--help") {
    printHelp();
    return;
  }

  if (command === "generate") {
    await runGenerate();
    return;
  }

  if (command === "verify") {
    runVerify();
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
};

main();
