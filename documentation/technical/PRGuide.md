# Submitting your first Pull Request

Assuming you've already set up your ZinZen project as explained in the "Setting Up Your Repositories" section, here's how to contribute effectively.

## A Step-by-Step Guide to Making Contributions

Follow these simple steps to propose changes or fixes to ZinZen:

### Keep Your Repositories in Sync

1. Before starting any work, make sure your local project matches ZinZen's latest version:
   - Switch to your local project's main branch:
     `git checkout main`
   - Get the latest changes from ZinZen's repository (without merging them into your main branch):
     `git fetch upstream`
   - Merge these changes into your main branch:
     `git merge upstream/main`
   - Update your GitHub repository (origin) with these changes:
     `git push origin main`

### Setup a feature branch

1. Make a new branch in your local project for your fixes or features (called a "feature branch").
2. Follow [branch naming conventions](./conventions/git.md):

   `[developer shortcut]/[issue number]/[meaningful name]`

   - To create and switch to a new branch locally:
     `git checkout -b vin/01/my-fix-branch`
   - Push this branch to your GitHub repository:
     `git push origin vin/01/my-fix-branch`

### Work on Your Changes

While working on your changes, follow these steps:

1. Work on your code.
2. Commit your changes regularly.
3. Keep your local repository up to date.
4. Keep your GitHub repository up to date.

### Commit Regularly

Remember to commit your changes often.

### Keep Your Local and GitHub Repositories Updated

Once you've added your fixes on top of the latest ZinZen version, update your GitHub repository to keep it in sync:

`git push origin vin/01/my-fix-branch`

Return to working on your code.

### Share Your Code

After you've finished making changes, push your code to your GitHub repository:

`git push origin vin/01/my-fix-branch`

Your code is now in your GitHub repository and ready to submit to ZinZen.

### Submit Your Contribution

Finally, go to the ZinZen repository on GitHub and click "Pull Request." You'll see a page showing your changes. Check them and make sure you're creating the right pull request.

For the title, provide a clear summary that describes your changes. If your pull request addresses an issue, mention the issue number in the pull request description, not the title. If it fixes an issue, add "resolves #100" (replace 100 with the actual issue number) in the description. This format automatically closes the issue when the pull request is merged.

Your pull request will be reviewed, and feedback will be provided.

## Maintaining the Main Branch

ZinZen's main branch must always be error-free. Pull requests that fail tests or review won't merge into the main branch.

## Responding to Feedback

If your pull request receives feedback, make more commits to your branch and push them to your GitHub repository. They'll be added to the pull request automatically. Follow these steps:

1. Update your local repository:
   - Switch to the correct branch:
     `git checkout vin/01/my-fix-branch`
   - Get changes from ZinZen:
     `git pull --rebase upstream main`
   - Make the required changes in your branch.
   - Once satisfied, push them to your GitHub repository to update your pull request:
     `git push origin vin/01/my-fix-branch`

Repeat this process until your changes are accepted and merged.

## After Your Pull Request Is Merged

Congratulations on your contribution to ZinZen! To clean up, remove old branches that have already been merged into the codebase. You can see your local branches with:

`git branch`

If you find a branch that has been merged upstream, delete it locally:

`git branch -D vin/01/my-fix-branch`

And remove it from your GitHub repository:

`git push origin --delete vin/01/my-fix-branch`

That's it! You've learned how to contribute to ZinZen in a few simple steps. We hope you enjoy contributing and look forward to collaborating with you.
