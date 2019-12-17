# Partio-ohjelmasovellus frontend

You need to have yarn installed to run the app (https://yarnpkg.com/lang/en/docs/install).
After installing yarn, clone the git repo and run `yarn` in the root folder, then
run `yarn start`. The app should be running at http://localhost:3000.

## PWA capabilities

You can test the service worker only in production mode. In order to test it, run `yarn build`,
followed by e.g. `yarn global add serve` and `serve -s build`.
