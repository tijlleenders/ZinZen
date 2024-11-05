# Setting Up Your Repository

To contribute to open-source projects, you typically need to follow a workflow involving git Pull Requests (PRs) for peer review. You cannot create PRs directly from a repository cloned from the original project. Instead, you must fork the project and then clone your forked repository. You'll need to restart the process if you initially cloned the project without forking.

## Initial Project Setup

The steps outlined in this section are a one-time process necessary for contributing to ZinZen. If you wish to contribute to a different project, you will need to repeat these steps.

Here's how to establish and maintain a fork of ZinZen and make periodic contributions:

1. **Fork ZinZen:**

   - To begin, create a fork of the [ZinZen repository](https://github.com/tijlleenders/ZinZen) on GitHub.
   - Click the "Fork" button and choose a suitable GitHub account, such as your personal GitHub account, for the fork.

2. **Clone Your Fork:**

   - Access your GitHub account and go to your Fork of ZinZen.
   - Click on the "<> Code" tab located in the upper left corner.
   - Within the dropdown menu that appears, select "HTTPS" (you can choose SSH if preferred, but this tutorial uses HTTPS for simplicity).
   - Copy the URL of your Fork by clicking on the icon with two boxes.
   - In your terminal, navigate to your desired code directory.
   - Clone your Fork to your local machine using the following command:
     ```
     git clone [URL TO YOUR FORK]
     ```
   - Change your working directory to the newly cloned repository:
     ```
     cd ZinZen
     ```

3. **Add the Original Project as Upstream:**
   - Incorporate the original project repository as an upstream source in your forked project by running this command:
     ```
     git remote add upstream https://github.com/tijlleenders/ZinZen.git
     ```

From now on, the ZinZen project repository will be called "upstream," and your GitHub project will be known as "origin."

You're now fully set up to contribute!
