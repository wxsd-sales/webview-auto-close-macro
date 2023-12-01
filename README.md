# WebView Autoclose Macro

This is an example macro which closes any open Web App or WebView on a Webex Device if it hasn't detected someone for a period of time



## Overview

This macro monitors people count and close proximity detection available on Board and Desk Webex Devices to close any open Web Apps or WebViews so that the device can enter Halfwake or Standby.



## Setup

### Prerequisites & Dependencies: 

- RoomOS/CE 11.0 or above Webex Board or Desk
- Web admin access to the device to upload the macro.


### Installation Steps:

1. Download the ``webview-autoclose.js`` file and upload it to your Webex Room devices Macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
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
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=RepoName) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team.
