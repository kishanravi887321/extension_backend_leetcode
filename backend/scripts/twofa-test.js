import speakeasy from "speakeasy";
import qrcode from "qrcode";

const usage = () => {
  console.log("\nTwo-factor utility\n");
  console.log("Generate a secret and QR:");
  console.log("  node scripts/twofa-test.js generate --label \"user@example.com\" --issuer \"CPCodes\" --show-qr");
  console.log("\nVerify a token:");
  console.log("  node scripts/twofa-test.js verify --secret BASE32SECRET --token 123456 --window 1");
  console.log("\nOptions:");
  console.log("  --label       Label in authenticator app");
  console.log("  --issuer      Issuer name in authenticator app");
  console.log("  --length      Secret length (default: 20)");
  console.log("  --show-qr     Print QR in terminal output");
  console.log("  --secret      Base32 secret for verification");
  console.log("  --token       One-time password from authenticator");
  console.log("  --window      Allowed time window steps (default: 1)");
  console.log("  --encoding    Token encoding (default: base32)\n");
};

const parseArgs = (argv) => {
  const parsed = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (key === "show-qr" || key === "help") {
        parsed[key] = true;
      } else {
        const next = argv[i + 1];
        if (!next || next.startsWith("--")) {
          parsed[key] = true;
        } else {
          parsed[key] = next;
          i += 1;
        }
      }
    } else {
      parsed._.push(arg);
    }
  }
  return parsed;
};

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const generateSecret = async (options) => {
  const label = options.label || "CPCodes";
  const issuer = options.issuer || "CPCodes";
  const length = toInt(options.length, 20);

  const secret = speakeasy.generateSecret({ length });
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label,
    issuer,
  });

  console.log("Secret (base32):", secret.base32);
  console.log("otpauth URL:", otpauthUrl);

  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
  console.log("Current token:", token);

  if (options["show-qr"]) {
    const qr = await qrcode.toString(otpauthUrl, { type: "terminal" });
    console.log("\nQR code:");
    console.log(qr);
  }
};

const verifyToken = (options) => {
  const secret = options.secret;
  const token = (options.token || "").replace(/\D/g, "");
  const window = toInt(options.window, 1);
  const encoding = options.encoding || "base32";

  if (!secret || !token) {
    console.error("Error: --secret and --token are required for verify.");
    return;
  }

  const delta = speakeasy.totp.verifyDelta({
    secret,
    encoding,
    token,
    window,
  });

  if (delta === null) {
    console.log("Invalid token");
  } else {
    console.log("Valid token. Delta steps:", delta);
  }
};

const argv = process.argv.slice(2);
const command = argv[0];
const options = parseArgs(argv.slice(1));

if (!command || options.help) {
  usage();
  process.exit(command ? 0 : 1);
}

if (command === "generate") {
  await generateSecret(options);
  process.exit(0);
}

if (command === "verify") {
  verifyToken(options);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
usage();
process.exit(1);
