
# Stages

## Stage 0 - A basic working version

Website has a hard coded date and shows a countdown to that date in days, hours, minutes or seconds.

## Stage 1 - Add to home page
Website can be made installable on destop usinga custom name and icon with the addition of a `manifest.json` file.  We can also remove all the browser UI elements.

## Stage 2 - Add a service worker
The worker dosn't do anything yet, bt we can see that it's been installed.

## Stage 3 - Add a service worker
We intercept calls to fetch, and cache all responses, so that future loads of the same files can
be achived without needing to be online.  This approach requires the page to be reloaded before content is in the cache.

## Stage 4 - Pre-cache
When the SW is installed, we use the cache API to fetch all the files into the cache immediately.  The app is theefore available offline with no additional work.

## Stage 5 - Multiple Deadlines
Rework the idea a bit to handle multiple deadlines.

## Stage 5 - Multiple Deadlines

Enable: chrome://flags/#enable-experimental-web-platform-features
