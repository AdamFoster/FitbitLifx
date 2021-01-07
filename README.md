# FitbitLifx
A Fitbit app for controlling LIFX light bulbs

You will need a LIFX API key for your LIFX cloud account. 
- Go to https://cloud.lifx.com/settings and sign in. 
- Click "Generate New Token"
- Give it a name E.g. "My Fitbit"
- Copy the token and paste it into the Fitbit LIFX app settings page. If you can't paste it in immediately, make a note of the token so that you can use it later as it won't be displayed again, although you can always generate another one

Don't share this key with anyone else.

## Building
### Pre-requisites
 - node.js & npm
   - On Windows I had to run ```npm install --global --production windows-build-tools``` from an administrator powershell to get the Fitbit tools to work
 - Fitbit simulator or development device: https://dev.fitbit.com/getting-started/


```
$ git clone https://github.com/AdamFoster/FitbitLifx.git
$ cd FitbitLifx
$ npm install
$ npx fitbit
fitbit$ build       # make changes and re-run build
fitbit$ install     # and install to have them take effect
```
