
---
description: Deploy the application to production
---

# Deployment Workflow

This workflow builds the application and verifies it's ready for deployment.

1. **Verify Build**: Run the production build command to check for errors.
   - The build process handles Prisma generation and database push.
   - It also compiles the Next.js application.

```bash
// turbo
npm run build
```

2. **Commit and Push**: If the build succeeds, commit the changes and push to the remote repository.
   - This usually triggers a deployment on platforms like Vercel.

```bash
git add .
git commit -m "Prepare for deployment: Fix dynamic route generation and build errors"
git push
```

3. **Verify Deployment**: check your Vercel dashboard or deployment URL.
