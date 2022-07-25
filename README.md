# Partio-ohjelmasovellus frontend

# 1. Project purpose

TODO

# 2. Architecture

This frontend application is deployed to an Azure App Service.

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

TODO

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

- TODO

### 5.3.1. Automated test cases

Tests are automatically run in the Github action flow.

### 5.3.2. Manual test cases

TODO

## 5.4. Rollback

Fix the release

## 5.5. Logs

TODO

## 5.6. Monitoring

TODO

## 6. Continuous integration

Github Actions is used for CI.

# 7. More useful information

Useful links and information: https://partio-ohjelma.fi/partio-ohjelma-sovellus/
