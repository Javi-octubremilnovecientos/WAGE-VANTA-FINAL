# Vercel Deploy Master for React + Vite Projects

Welcome! This skill is a friendly, step-by-step guide for junior developers who want to deploy a React + Vite project to Vercel using GitHub. It covers everything from preparing your project, connecting it to Vercel through the dashboard, managing environment variables, sharing preview URLs for pull requests, adding a custom domain, and solving the most common problems that show up the first time you deploy.

You will not need to use any command line tool beyond what you already use for development. Everything related to Vercel happens inside the Vercel website (the dashboard). The goal is to give you the confidence to ship your project to the world without surprises.

---

## 1. Initial Project Setup

Before thinking about Vercel, your project needs to be in good shape locally. Vercel will essentially run the same build process you run on your computer, so if it works locally with the right configuration, it will almost always work on Vercel.

### 1.1 Make sure your project structure is standard

A typical React + Vite project has a few files at the root that Vercel looks for:

1. A package.json file. This is the manifest of your project. It lists your dependencies and the scripts that build and run the app.
2. A vite.config.js or vite.config.ts file. This configures how Vite builds the project.
3. A src folder containing your application code, and a public folder for static assets.
4. An index.html file at the root. In Vite projects this file lives at the root, not inside public, and it is the entry point of the application.

If any of these are missing or in the wrong place, Vercel will not know how to build the project. Keep the structure that Vite generated when you created the app and you will be fine.

### 1.2 Confirm the build works on your computer

Before doing anything on Vercel, run the production build locally. In your project, run the build script defined in package.json (commonly named build). This produces a folder called dist that contains the final static files Vercel will serve.

If the build finishes without errors and the dist folder is created, your project is ready for deployment. If the build fails locally, it will also fail on Vercel, so fix all errors first.

> **Important note:** Do not skip this step. Many junior developers go straight to Vercel and then spend hours debugging build logs. A successful local build is the single best predictor of a successful deployment.

### 1.3 Configure vite.config correctly

There are three settings inside vite.config that matter for deployment:

1. **The base path.** This tells Vite where the app will be served from. For most Vercel deployments the app is served from the root of the domain, so the base should be a single forward slash. If you set the base to a subfolder name when your app actually runs at the root, all your asset links will break and the page will appear blank in production. Leave it as the default unless you genuinely need a subpath.

2. **Environment variables exposed to the client.** Vite has a strict rule: only variables whose name starts with VITE_ are exposed to your frontend code. Any other variable will be ignored. This is a security feature, not a bug, so respect the convention. You read these variables in your code through the import meta env object that Vite provides.

3. **The output directory.** By default Vite writes the production build to a folder named dist. Vercel expects exactly this folder for Vite projects, so do not change it unless you have a strong reason. If you do change it, you will also have to update the Vercel project settings to match.

---

## 2. Connecting GitHub to Vercel

Vercel works beautifully with GitHub. Once the two are connected, every push to your repository can trigger an automatic deployment, and every pull request gets its own preview URL.

### 2.1 Create a Vercel account

1. Go to the Vercel website and click the sign up button.
2. Choose the option to sign up with GitHub. This is the recommended path because it links both accounts in a single step.
3. Authorize Vercel to access your GitHub account. You can choose to grant access to all repositories or to a selected list. If you are unsure, start with a selected list and only grant access to the repository you want to deploy. You can always add more later.

### 2.2 Import your GitHub repository

1. From the Vercel dashboard, click the button labeled Add New, then choose Project.
2. You will see a list of your GitHub repositories. Find the one containing your React + Vite project and click Import.
3. If the repository you want is not visible, it usually means Vercel does not have permission to see it. Click the link that lets you adjust GitHub App permissions and grant access to that specific repository.

### 2.3 Configure the project during import

After clicking Import, Vercel shows a configuration screen. This is where you tell Vercel how to build your project. The good news is that Vite is detected automatically, so most settings come pre-filled. Review them carefully:

1. **Framework Preset.** This should already say Vite. If it does not, open the dropdown and select Vite manually. This preset configures the correct build command and output directory in one click.
2. **Root Directory.** Leave this as the default if your package.json sits at the top of the repository. If your project lives inside a subfolder of a monorepo, click Edit and select the right folder.
3. **Build Command.** With the Vite preset this is filled in automatically. It typically runs the build script defined in your package.json. You should not need to change it.
4. **Output Directory.** Again, the Vite preset sets this for you, usually to dist. Only change it if your vite.config produces output somewhere else.
5. **Install Command.** This is filled in based on your package manager. Leave it as is.

When you are happy with the settings, click Deploy. Vercel will pull your code, install dependencies, run the build, and publish the result. Within a couple of minutes your project will be live on a vercel.app URL.

---

## 3. Environment Variables

Most real projects need secrets or configuration values that should not be hard coded into the source. Vercel has a clean way to manage this from the dashboard.

### 3.1 Adding variables in the Vercel dashboard

1. Open your project on the Vercel dashboard.
2. Click the Settings tab at the top.
3. In the left sidebar, click Environment Variables.
4. For each variable, type its name in the Key field and its value in the Value field. The name must match exactly what your code expects.
5. Choose the environments where the variable should apply. Vercel offers three: Production, Preview, and Development. You can select one, two, or all three for the same variable.
6. Click Save. The variable is stored encrypted and will be injected into the build for the selected environments.

### 3.2 Build-time versus runtime in a Vite project

This distinction confuses many junior developers, so let us be clear. A Vite app is a static site once it is built. There is no Node.js server running your React code in production. Therefore:

1. Environment variables are read at **build time**, when Vercel runs the build command. Their values are baked into the JavaScript bundle that ships to the browser.
2. There is no runtime environment for your client code on Vercel for a static Vite app. If you change a variable, you must trigger a new deployment for the change to take effect.

This means any variable you expose to the frontend will be visible in the browser to anyone who inspects the page. Treat them as public configuration, not as secrets.

### 3.3 Why client variables must start with VITE_

Vite intentionally hides every environment variable from the client unless its name starts with VITE_. This protects you from accidentally leaking sensitive variables, like database passwords or private API keys, into the browser bundle.

When Vercel runs the build, Vite reads the variables, filters out any that do not start with VITE_, and injects only the safe ones into your code through the import meta env object. If your app reads a variable that lacks the VITE_ prefix, you will get an undefined value in production, even if the variable is configured correctly in Vercel.

> **Common mistake warning:** A junior developer adds a variable called API_URL in Vercel, references it in the React code, and is surprised when it is undefined in the deployed app. The fix is to rename the variable to VITE_API_URL both in Vercel and in the code.

### 3.4 Different values for preview and production

A useful pattern is to point preview deployments to a staging backend and production deployments to your real backend. To do this:

1. Add the same variable name twice in the Environment Variables panel.
2. The first time, set it to the staging value and check only the Preview environment.
3. The second time, set it to the production value and check only the Production environment.

When Vercel builds a preview, it uses the staging value. When it builds production, it uses the production value. Your code does not need to know which is which, it just reads the variable.

---

## 4. Automatic Deploy Previews for Pull Requests

This is one of the best features Vercel offers and it is enabled by default once GitHub is connected.

### 4.1 How preview URLs work

1. Every time you open a pull request on GitHub against any branch of your repository, Vercel detects the new commits and starts a build.
2. When the build finishes, Vercel publishes the result on a unique URL. This URL is different from your production URL and is meant to be shared for review.
3. Each new commit you push to that pull request triggers a fresh build, and the preview URL updates with the latest version.
4. When the pull request is merged or closed, the preview URL still works for a while but is no longer updated.

### 4.2 Finding and sharing the preview URL

1. Open the pull request on GitHub. The Vercel bot leaves a comment with the preview link as soon as the deployment is ready. Click it to open the preview.
2. Alternatively, open your project in the Vercel dashboard, go to the Deployments tab, and look for the deployment associated with the pull request branch. The URL is listed next to it and you can copy it directly.
3. Share that URL with teammates, designers, or clients so they can review the change without cloning the repo or running anything locally.

### 4.3 How previews differ from production

1. Previews use the Preview environment variables, not the Production ones. This is intentional and lets you test against a safe backend.
2. Previews are not indexed by search engines and have a randomly generated URL, so they are reasonably private but not secret. Do not rely on them to hide truly sensitive information.
3. The production URL only updates when commits land on your production branch, which is the main branch by default. A pull request never affects production until it is merged.

---

## 5. Custom Domains

Once your project is stable, you will probably want a real domain instead of the vercel.app URL.

### 5.1 Adding a domain in the Vercel dashboard

1. Open your project in Vercel and click the Settings tab.
2. In the left sidebar, click Domains.
3. Type the domain you want to use and click Add. You can add a root domain like example.com, a subdomain like www.example.com, or both.
4. Vercel shows the DNS records you need to configure with your domain registrar. Keep this screen open, you will need the values in the next step.

### 5.2 Configuring DNS records at your registrar

1. Log in to the dashboard of the company where you bought the domain.
2. Find the DNS settings for your domain. Different registrars name this section differently, but it is usually called DNS, DNS Records, or Name Servers.
3. Add the records exactly as shown by Vercel. There are two common approaches:
   - The simple approach is to add an A record for the root domain pointing to the IP address Vercel gives you, and a CNAME record for the www subdomain pointing to a Vercel hostname.
   - The advanced approach is to change the name servers of your domain to Vercel name servers, which gives Vercel full control over DNS for that domain.
4. Save the changes at your registrar. DNS changes can take from a few minutes to several hours to propagate across the internet, so be patient.

### 5.3 Handling www and the root domain

A common requirement is that both example.com and www.example.com lead to the same site. Vercel makes this easy:

1. Add both versions in the Domains panel of your project.
2. Vercel will mark one of them as the primary domain. Visitors who hit the other version are automatically redirected to the primary one. You can pick whichever you prefer as primary.
3. Once both records are verified, Vercel automatically issues a free SSL certificate for each so your site is served over secure HTTPS without any extra steps.

---

## 6. Troubleshooting: Build Errors Caused by Dependencies

The single most common deployment failure is a project that builds locally but fails on Vercel because of a dependency problem. Here is how to think about it and solve it.

### 6.1 Why a project builds locally but fails on Vercel

The reason is almost always one of these:

1. A package is installed locally but not listed in package.json. It works on your computer because it is on disk, but Vercel installs only what package.json declares, so it fails.
2. A package is listed under devDependencies but is actually needed at build time. On a fresh install in production mode, devDependencies might be skipped, breaking the build.
3. The package.json and the lock file are out of sync, so Vercel installs a different set of versions than you have locally.
4. A package depends on a feature of a Node.js version that does not match the version Vercel uses to build.

### 6.2 Reading the build log on Vercel

1. Open your project in the Vercel dashboard and click the failed deployment in the Deployments tab.
2. Click the Build Logs section. Vercel shows the full output of the build, exactly as if you had run it on your computer.
3. Scroll to the first red error message. The first error is the real cause. Errors that appear later are usually consequences of the first one.
4. If the error mentions a module that cannot be found, it is a dependency problem. The module name is the clue you need.

### 6.3 Fixing dependency issues

1. On your local machine, install the missing module so it gets added to package.json. Make sure to install it as a regular dependency unless you are absolutely sure it is only used during development.
2. Understand the difference clearly: dependencies are packages your application needs to run or to be built for production. devDependencies are packages used only while developing, like linters and test runners. If a package is needed during the production build, it must be a regular dependency, not a dev one.
3. Make sure the package-lock.json or equivalent lock file is updated and committed alongside the package.json change.
4. Push the commit to GitHub. Vercel automatically triggers a new deployment. Watch the build logs until you see a successful build.

> **Common mistake warning:** Deleting node_modules and the lock file to fix a problem can cause more problems. Only do this as a last resort, and always commit the regenerated lock file afterward.

---

## 7. Troubleshooting: Routing Problems in Production

If you use React Router or any other client-side router, you will likely run into a confusing problem on your first deployment.

### 7.1 Why routes return 404 in production

In development, the Vite dev server intercepts every URL and always serves your React app, so client-side routing just works. In production on Vercel, the server treats your app as a collection of static files. When a visitor goes to a deep route like example.com/dashboard, Vercel tries to find a file called dashboard at that path. There is no such file, so it returns a 404 error.

This is not a bug, it is the default behavior of any static host. Your React app does exist, it is at index.html, and it is the one that knows how to render the dashboard route. The fix is to tell Vercel to serve index.html for every URL and let your React app handle the routing on the client.

### 7.2 Fixing single-page app routing with rewrites

The fix lives in a configuration file at the root of your project. The file is called vercel.json. Inside it you declare a rewrites rule that says: for every incoming path, serve the index.html file. The rewrite rule has two parts, a source pattern that matches every URL and a destination that points to index.html.

After adding this file:

1. Commit it to your repository.
2. Push the commit to GitHub.
3. Vercel automatically picks up the new configuration in the next deployment.
4. Now any URL the visitor types or any link they share lands on index.html, your React app boots up, the router reads the URL, and the right page renders.

### 7.3 Verifying that routing works

1. Open the deployed site and navigate around using internal links. This should work either way and is not a real test.
2. Now manually type a deep URL into the browser address bar and press Enter. If the right page appears, your rewrites are working.
3. Refresh the page on a deep route. If the page reloads correctly without a 404, the fix is in place.
4. Open the page in a new tab by right-clicking an internal link. Same expected result.

### 7.4 Mistakes with the base path

A very common cause of broken routing has nothing to do with vercel.json and everything to do with the base setting in vite.config:

1. If you set the base to a subfolder name like /myapp, Vite generates HTML and asset references that include that prefix. When deployed at the root of a domain, those references are wrong and the app fails to load. The page often appears blank with errors in the developer console.
2. If you change the base in vite.config without a real reason, the React Router routes also need to be aware of that prefix, which adds complexity and is easy to get wrong.
3. The simplest rule is to leave base as the default forward slash for any project deployed at the root of a Vercel domain. Only change it if you intentionally serve the app from a subpath, and even then test thoroughly in a preview deployment first.

---

## Final Encouragement

Deploying a project for the first time can feel intimidating, but Vercel is designed to make it as smooth as possible for React and Vite developers. If a deployment fails, do not panic. Open the build log, find the first error, and address that one issue. Most problems fall into the patterns described above and are perfectly solvable.

Take your time, deploy small changes often, share preview URLs early, and treat the Vercel dashboard as your friend. With a little practice you will be shipping confidently in no time.
