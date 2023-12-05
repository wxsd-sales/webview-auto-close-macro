# WebView Auto Close Macro

This is an example macro which closes any open Web App or WebView on a Webex Device if it hasn't detected a user infront of the device for a period of time.

![WebView-Auto-Close](https://github.com/wxsd-sales/webview-autoclose-macro/assets/21026209/3d6fc046-6565-4c1a-b79e-c85f9a6c1f46)


## Overview

This macro monitors people count and close proximity detection available on natively on Webex Board and Desk Devices whenever a user opens Web Content on the device. If a the user walks away from the device, the macro will automatically close the Web Content if it hasn't detected a person close to the device after a configurable amount of time.

The macro also displays an alert just before it is about to close the content in the event it happened not to detect the user giving them an opportunity to supress the macros auto close functionality for a period of time.

The macro easily lets you configure how long it should wait before displaying the alert or takes action and close the content along with how long it should suspend.



## Setup

### Prerequisites & Dependencies: 

- RoomOS/CE 11.0 or above Webex Board or Desk
- Web admin access to the device to upload the macro.


### Installation Steps:

1. Download the ``webview-auto-close.js`` file and upload it to your Webex Room devices Macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
```javascript
const config = {
  autoCloseTimeout: 60, // Number of seconds before the WebView is close if no one has been detected.
  alertTimeout: 30, // Number of seconds before auto close alert is shown if no one has been detected, should be less than the autoCloseTimeout
  alertPrompt: {
    Duration: 20,
    Title: `Web Content Auto Close`,
    Text: 'No one has been detected<br>Web content will soon auto close',
    "Option.1": 'Suspend Auto Close',
    FeedbackId: 'webviewAutoclose'
  },
  detectionSuspendPeriod: 120, // Number of seconds to stop monitoring if the user taps suspend auto close option
  autoStandby: true // Automatically enter standby after closing WebView
}
```
3. Save the macro changes and enable it using the toggle in the Macro on the editor.
    
## Validation

Validated Hardware:

* Board 70
* Desk Pro

This macro should work on other Webex Board and Desk series devices but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).


## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=webview-auto-close-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team.
