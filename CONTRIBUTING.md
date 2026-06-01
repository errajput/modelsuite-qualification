# Contribution and Qualification

Welcome! If you are participating in a qualification assessment or contributing to this repository, please follow the strict process outlined below to ensure a smooth evaluation.

## 1. Branch Naming & Assignment
Every candidate is assigned a unique branch name via email (in the format: `27-26-22-7-5-pranav-test`). 
**You must use this exact branch name** for your local work and remote pushing. Your Pull Request title must also be exactly this branch name.

## 2. Cloning the Repository
Start by cloning the repository to your local machine and checking out your assigned branch:
```bash
git clone https://github.com/modelsuite-ai/modelsuite-qualification.git
cd modelsuite-qualification
git checkout -b <your-assigned-branch-name>
```

## 3. Making Changes & Local Checks
Before committing your code, please ensure it meets the project standards. Run the following checks locally:
- **Client**: `cd client && npm run lint && npm run build`
- **Server**: `cd server && npm run lint && npm run build`

## 4. Raising a Pull Request (PR)
When you are ready to submit your work:
1. Push your branch to the repository.
2. Open a Pull Request against the `master` branch.
3. **PR Title**: Ensure the title exactly matches your assigned branch name.
4. **PR Template**: Fill out the provided PR template thoroughly. This includes:
   - A brief summary of your changes.
   - Checking off the pre-flight checklists (local linting, builds, etc.).
   - Noting files touched and any relevant testing instructions.
   *Incomplete templates may result in your PR being closed.*

## 5. CI/CD Pipeline & Checks
We have an automated CI/CD pipeline that runs on every PR against `master`. It performs:
- **Danger Checks**: Automated PR review tasks.
- **Client & Server Checks**: Linting and building for both frontend and backend.

**⚠️ Important:** If your PR fails any of these checks (e.g., due to lint errors, build failures, or Danger failures), **the pipeline will automatically close your PR** and leave a comment with the failure logs. Please fix the issues locally before submitting.
