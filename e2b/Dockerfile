# e2b/Dockerfile

# Instruction 1: Base Image
# Start from an official E2B image that already has Node.js v18 installed.
# This saves us from having to install Node, npm, etc., from scratch.
FROM e2b/base-node:18

# Instruction 2: Build the Next.js Application Environment
# This is the most important step. We run a series of commands chained with '&&'.
# If any command fails, the entire build process stops.
RUN npx --yes create-next-app@15.3.4 nextjs-app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm && \
    cd nextjs-app && \
    npm install && \
    # Initialize Shadcn/UI, auto-confirming all prompts.
    npx --yes shadcn-ui@2.7.0 init --yes && \
    # Add all Shadcn/UI components to the project, auto-confirming.
    npx shadcn-ui@2.7.0 add --all --yes

# Instruction 3: Set the Default Command
# This command runs when a sandbox is started from this template.
# It moves the contents of our newly created `nextjs-app` into the root directory
# and then removes the now-empty `nextjs-app` folder.
# Why? This gives the AI a clean starting point at '/' instead of '/nextjs-app',
# simplifying the file paths it has to reason about.
CMD ["/bin/bash", "-c", "mv nextjs-app/* . && rm -rf nextjs-app"]

