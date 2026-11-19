import "dotenv/config";
import { createInterface, emitKeypressEvents } from "node:readline";
import type { Interface as ReadlineInterface, Key } from "node:readline";
import { prisma } from "../prisma.js";
import { hashPassword } from "../utils/password.js";

const MIN_PASSWORD_LENGTH = 12;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENV_KEYS = ["ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"] as const;

interface AdminInput {
  name: string;
  email: string;
  password: string;
}

function validateName(name: string): string | null {
  if (!name) {
    return "Name is required.";
  }
  if (name.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }
  return null;
}

function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required.";
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }
  return null;
}

function validateInput(input: AdminInput): string | null {
  return (
    validateName(input.name) ??
    validateEmail(input.email) ??
    validatePassword(input.password)
  );
}

function readEnvInput(): AdminInput | null {
  const values = ENV_KEYS.map((key) => process.env[key] ?? "");
  const provided = values.filter((value) => value !== "").length;

  if (provided === 0) {
    return null;
  }

  const missing = ENV_KEYS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing ${missing.join(", ")}. Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD together, or run without them to use prompts.`
    );
  }

  return {
    name: (process.env.ADMIN_NAME ?? "").trim(),
    email: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? ""
  };
}

function ask(rl: ReadlineInterface, query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, (answer) => resolve(answer)));
}

function readHidden(promptText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error("A terminal is required to enter the password securely."));
      return;
    }

    const stdin = process.stdin;
    const stdout = process.stdout;
    stdout.write(promptText);

    emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.resume();

    let value = "";

    const cleanup = () => {
      stdin.removeListener("keypress", onKeypress);
      stdin.setRawMode(false);
      stdin.pause();
    };

    const onKeypress = (str: string, key: Key) => {
      if (key?.ctrl && key.name === "c") {
        cleanup();
        stdout.write("\n");
        reject(new Error("Cancelled."));
        return;
      }

      if (key?.name === "return" || key?.name === "enter") {
        cleanup();
        stdout.write("\n");
        resolve(value);
        return;
      }

      if (key?.name === "backspace") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          stdout.write("\b \b");
        }
        return;
      }

      if (key?.name === "escape") {
        return;
      }

      if (str && !str.startsWith("\x1b") && !key?.ctrl && !key?.meta) {
        value += str;
        stdout.write("*");
      }
    };

    stdin.on("keypress", onKeypress);
  });
}

async function promptForInput(): Promise<AdminInput> {
  if (!process.stdin.isTTY) {
    throw new Error(
      "No interactive terminal detected. Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to run non-interactively."
    );
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let name = "";
  let email = "";

  try {
    let nameError = "";
    do {
      if (nameError) {
        console.error(nameError);
      }
      name = (await ask(rl, "Admin name: ")).trim();
      nameError = validateName(name) ?? "";
    } while (nameError);

    let emailError = "";
    do {
      if (emailError) {
        console.error(emailError);
      }
      email = (await ask(rl, "Admin email: ")).trim().toLowerCase();
      emailError = validateEmail(email) ?? "";
    } while (emailError);
  } finally {
    rl.close();
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const password = await readHidden(
      `Password (min ${MIN_PASSWORD_LENGTH} characters): `
    );
    const passwordError = validatePassword(password);
    if (passwordError) {
      console.error(passwordError);
      continue;
    }

    const confirmation = await readHidden("Confirm password: ");
    if (password !== confirmation) {
      console.error("Passwords do not match. Try again.");
      continue;
    }

    return { name, email, password };
  }

  throw new Error("Too many invalid password attempts.");
}

async function createAdmin(input: AdminInput) {
  const existing = await prisma.adminUser.findFirst({
    where: { email: { equals: input.email, mode: "insensitive" } }
  });

  if (existing) {
    throw new Error(
      `An admin with email ${input.email} already exists (id ${existing.id}). Run the command with a different email.`
    );
  }

  const passwordHash = await hashPassword(input.password);
  const admin = await prisma.adminUser.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: "ADMIN"
    }
  });

  console.log(`\nCreated admin #${admin.id}: ${admin.name} <${admin.email}> (role: ${admin.role}).`);
  console.log("Sign in with this email and the password you just entered.");
}

async function main() {
  const envInput = readEnvInput();
  const input = envInput ?? (await promptForInput());

  const validationError = validateInput(input);
  if (validationError) {
    throw new Error(validationError);
  }

  await createAdmin(input);
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nError: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
