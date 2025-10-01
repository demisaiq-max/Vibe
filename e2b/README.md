# E2B Sandbox Template Setup

## Prerequisites

Before building the E2B template, you **MUST** have Docker Desktop installed and running on your machine.

### Install Docker Desktop

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Ensure Docker is running (you should see the Docker icon in your system tray)

## Building the Template

Once Docker Desktop is running, follow these steps:

1. Navigate to the e2b directory:
   ```bash
   cd e2b
   ```

2. Build and publish the template:
   ```bash
   e2b template build
   ```

3. **IMPORTANT**: Copy the Template ID from the output. It will look something like:
   ```
   Template ID: abt5vfj6rombuxv4pjst
   ```

4. Update the `E2B_TEMPLATE_ID` in `src/injest/functions.ts` with your Template ID.

## What the Dockerfile Does

Our custom Dockerfile creates a pre-configured Next.js development environment with:

- Node.js 18
- Next.js 15.3.4 with TypeScript, Tailwind CSS, and ESLint
- Shadcn/UI with all components
- App Router and src/ directory structure

This ensures every sandbox starts with a complete Next.js setup, ready for the AI agent to modify.

## Troubleshooting

**Error: "Cannot find the file specified" or "Docker daemon not running"**
- Solution: Start Docker Desktop and wait for it to fully initialize

**Error: "Build failed" or timeout errors**
- Solution: The initial build can take 10-15 minutes as it installs all dependencies. Be patient!

**Error: "Invalid team ID"**
- Solution: Don't use a custom tag with `-t`. Just run `e2b template build`

