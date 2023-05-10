# Partio-ohjelmasovellus frontend

# 1. Project purpose

Partiolaiset Kompassi is a progressive web app made mainly for mobile devices. This is the frontend repository of the application. Main purpose of the app is to store and show scout members's completed achievement badges. Groupleaders are also able to give new achievement badges to their groupmembers. Users that are not logged in can also view different tasks and their info.

# 2. Architecture

This frontend application is deployed to an Azure App Service.
Frontend fetches it's data from [pos-backend](https://github.com/partio-scout/pos-backend) which uses 2 different databases and API called Kuksa:
[Strapi](https://pof-backend-production.azurewebsites.net/admin/) (which stores the information of agegroups, taskgroups and tasks),
pos-db (Postresql database. It stores the user specific information of the achievements but not any user data except for user's id.)
and Kuksa (It stores the information of userprofile, groups and troops.)

Strapi is a content management system where Partiolaiset can create new content for websites. Kompassi uses only agegroups, taskgroups and tasks from Strapi, other content is used for different Partiolaiset projects.

## 2.1. Technologies

- create-react-app written with React
- [styled-componets](https://styled-components.com/)
- Redux state management
- Node 16.

# 3. Development environment

## 3.1. Prerequisites, and what to do first

### Environmental variables

You'll find the proper file for local development from LastPass.

## 3.2. Run tests

Make sure you have installed all dependencies with `yarn` and then run `yarn test`.

Press **a** in the **test** window.

## 3.3. Start the application locally

### 3.3.1 HTTP

Required commands:

- Install dependencies with `yarn` or `yarn install`
- To start the dev environment in http mode run `yarn start`.

NOTE: Login will not work on all modern browsers in http mode because authentication requires a secure 3rd party cookie to function.

### 3.3.2 HTTPS

NOTE: Https will only work if the backend is set up with https as well.<br>
NOTE: You will need to generate certificates for the localhost https environment. See the steps below.<br>
NOTE: It's recommended that you set up the backend first.<br>
NOTE: Make sure you have all the https related environment variables set (see .env.example).<br>
NOTE: If, after certificate creation, chrome complains about the certificate not being trusted you can go to the Keychain Access to mark it as always trusted.

To start the app in https mode

- run `yarn dev` (requires that you have the certificate in the `certs` folder)
- Go to https://partio.ngrok.io:3000
  - You need to have `127.0.0.1 partio.ngrok.io` in your `/etc/hosts` folder
    - NOTE: you should have this if you've already configured Ngrok for the backend application

To generate the required certificate follow these steps (Mac):<br>
NOTE 1: If you've already created and added the root key and root certificate during the backend https setup you can skip step 1.

1. First create a folder (e.g. `certificates`) somewhere on your Mac
   - for example to your Work/Projects folder if you have them or your Desktop/Downloads folder
   - If you created the folder in finder open a terminal and `cd` to the folder
   - Next run the following commands to create the required files for generating the certificates
     - Create a root key: `openssl genrsa -des3 -out rootCA.key 2048`
     - Create RootCA.key pass phrase when terminal asks for it and save it somewhere (You're going to need it later)
     - Create a root certificate: `openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem`
       - It's enough to only fill some fields here. E.g. Country as `fi` and location as `Helsinki`
   - Next you need to add the created root certificate as trusted in your Keychain Access application
     - Open Keychain Access
     - Select `File` -> `Import items...` from the app menu
     - Navigate to the folder where you created the root key and certificate and select the certificate (the `.pem` file)
     - Select System from the left side menu and then the Certificates tab
     - Double-click the certificate you added and change its Trust setting to Always Trust
2. Create a separate folder for frontend inside your certificates folder: `mkdir frontend`

   - Create a `server.csr.cnf` file inside the `frontend` folder with the following information

     - ```
       [req]
       default_bits = 2048
        prompt = no
       default_md = sha256
       distinguished_name = dn

       [dn]
       C=fi
       L=Helsinki
       CN = partio.ngrok.io
       ```

   - Create a `v3.ext` file inside the `frontend` folder with the following information

     - ```
       authorityKeyIdentifier=keyid,issuer
       basicConstraints=CA:FALSE
       keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
       subjectAltName = @alt_names

       [alt_names]
       DNS.1 = partio.ngrok.io
       ```

   - Run `openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat frontend/server.csr.cnf )`
   - Run `openssl x509 -req -in frontend/server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile frontend/v3.ext`
   - Now the certificates are ready so all you need to do is move the `server.crt` and `server.key` files inside the `frontend` folder to the frontend project
     - Create a `certs` folder inside the frontend project
     - Move the `server.crt` and `server.key` inside the `certs` folder

3. For using localhost https environment, you need to edit `~/.ngrok2/ngrok.yml`.

- `addr: 3001` should be changed to `addr: https://localhost:3001`
- Run `yarn dev` to start the app and navigate to https://partio.ngrok.io:3000

## Logging out as user with HTTPS

- https://partio.ngrok.io:3000 is not set to PartioId as allowed URL, so logging out as one user and signing in as another user doesn't always work and it just keeps logging in as the previous user. Workaround is to logout with curl.
- Open the network tab and click the logout button. Right click the failed logout url and copy as cURL. Paste the outcome to some editor and find all the partio.ngrok.io matches and change them as localhost:3000. Make sure to change the https to http as well
- Run the command and you should be logged out now.

### PWA capabilities

You can test the service worker only in production mode. In order to test it, run `yarn build`,
followed by e.g. `yarn global add serve` and `serve -s build`.

## 3.4. Version control

When working on a new feature or fixing a bug always create a new branch from the master branch. When the feature or fix is complete create a pull request (from now on PR) for the branch. There should always be at least one or two reviewers for the PR and once the PR has been approved it can be merged to master.

# 4. Test environment

## 4.1. Access

TODO
The test environment is running [here](https://pos-staging.azurewebsites.net/).

## 4.2. Deployment

Anything pushed to the master branch is automatically deployed to the test environment

## 4.3. Verifying that a deployment was successful

Make sure the GitHub action successfully completes and test environment is accessible and these things works:

- TODO

### 4.3.1. Automated test cases

Tests are automatically run during the GitHub workflow when things are pushed to the master branch.

### 4.3.2. Manual test cases

Check that signing in works. Get the test account from 1Password. Always test the new features/fixes with both groupleader account and groupmember account because the logic is different.

## 4.4. Rollback

As everything from the master branch is deployed to the test environment the only way to change what is deployed is to push new changes or reverting old commits.

## 4.5. Logs

TODO

## 4.6. Monitoring

TODO

## 5. Production environment

## 5.1. Access

The production app can be found [here](https://pos-production.azurewebsites.net/)
and here: https://kompassi.partio.fi/

## 5.2. Deployment

Create a release in GitHub. Fill out tag version and title and then publish the release.

## 5.3. Verifying that a deployment was successful

Make sure the GitHub action successfully completes and production environment is accessible and these things works:

- Logging in and logging out
- Creating completion badge for task, taskgroup or agegroup
- Signed in as groupleader you can also see the groupmembers in manage-screen

you can find the test account for production environment in 1Password.

### 5.3.1. Automated test cases

Tests are automatically run in the Github action flow. At the moment there is lack of test coverage.

### 5.3.2. Manual test cases

Same than in test environment. See above.

## 5.4. Rollback

Release the latest working version.

## 5.5. Logs

TODO

## 5.6. Monitoring

- [Sentry - pos-frontend](https://orangit.sentry.io/projects/pos-frontend/?project=6398088)

## 6. Continuous integration

Github Actions is used for CI.

# 7. More useful information

After Kompassi started using Strapi as CMS for information of items, the namings changed from activity -> task and activitygroup -> taskgroup. There are still places in frontend code where old names are used. These should be changed, but before that try not to get too confused.

Useful links and information: https://partio-ohjelma.fi/partio-ohjelma-sovellus/
