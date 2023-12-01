/********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 12/01/23
 * 
 * This is an example macro which closes any open Web App or 
 * WebView on a Webex Device if it hasn't detected someone 
 * for a period of time
 *
 * Full Readme, source code and license agreement available
 * on Github:
 * https://github.com/wxsd-sales/webview-autoclose-macro/
 * 
 ********************************************************/

import xapi from 'xapi';

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

/*********************************************************
 * Apply Config and subscribe to Event and Status changes
**********************************************************/

xapi.Config.RoomAnalytics.PeopleCountOutOfCall.set('On');
xapi.Config.RoomAnalytics.PeoplePresenceDetector.set('On');
xapi.Status.RoomAnalytics.Engagement.CloseProximity.on(processPresence)
xapi.Status.RoomAnalytics.PeopleCount.Current.on(processPresence);
xapi.Status.UserInterface.WebView.on(processWebViews);
xapi.Event.UserInterface.Message.Prompt.Response.on(processFeedback);

/*********************************************************
 * Macros Main functions and change processing
**********************************************************/


// Variables for tracking timers
let autoCloseTimer = null;
let alertTimer = null;
let suspend = false;

// Initially check current WebViews once macro has started
processWebViews();

// This function handles people detection and stops/starts timers
async function processPresence() {

  // Ignore Presence changes when in suspend state
  if (suspend) return

  const validView = await visibleWebView();

  // Only process changes if there are visible webviews
  if (!validView && autoCloseTimer != null) {
    console.log('No Valid WebViews Present - Stopping Timers')
    stopTimers();
    return;
  }

  if (!validView) return;

  const closeProximityDetected = await xapi.Status.RoomAnalytics.Engagement.CloseProximity.get() == 'True';
  const peopleDetected = await xapi.Status.RoomAnalytics.PeopleCount.Current.get() > 0;

  if (closeProximityDetected && peopleDetected) {
    console.log(`People and Close Poximiity Detected - Stopping Timers`);
    stopTimers();
    return
  }

  if (autoCloseTimer == null) {
    console.log('WebView [ Visible ] - Close Proximity:', closeProximityDetected, ' - People Detected', peopleDetected, ' - Starting Timers');
    startTimers();
  } 

}

async function processWebViews(change) {

  if (change) {
    // Ignore changes which don't include status or ghost
    if (!(change.hasOwnProperty('Status') || change.hasOwnProperty('ghost'))) return
  }

  const validView = await visibleWebView();
  // Stop any timers if no valid WebView is visible 
  if (!validView && autoCloseTimer != null) {
    console.log('No Valid WebViews Present - Stopping Timers')
    stopTimers();
    return;
  }

  // Valid WebView is visible, check presence 
  processPresence();

}

async function visibleWebView() {

  const webViews = await xapi.Status.UserInterface.WebView.get();

  // No WebViews returning false
  if (webViews.length == 0) return false;

  // Filter Visible and valid WebView types
  const validViews = webViews.filter(view => {
    return view.Status == 'Visible' &&
      (view.Type == 'WebApp' ||
        view.Type == 'Integration' ||
        view.Type == 'ECM' ||
        view.Tyel == 'ECMSignIn')
  })

  // Return if any valid webviews are visible
  return validViews.length > 0;

}


function processFeedback(event) {
  if (event.FeedbackId != config.alertPrompt.FeedbackId) return
  if (!event.hasOwnProperty('OptionId')) return;
  console.log(`User selected option [${event.OptionId}] - ${config.alertPrompt["Option.1"]}`);
  if (event.OptionId != 1) return;
  stopTimers();
  suspsendMonitoring(config.detectionSuspendPeriod);
}

function suspsendMonitoring(seconds) {
  suspend = true;
  console.log(`WebView Auto Close suspended for ${seconds} seconds`)
  setTimeout(() => {
    suspend = false;
    console.log(`WebView Auto Close suspension finished, monitioring again`)
    processWebViews();
  }, seconds * 1000)
}

function startTimers() {
  // Prevent Duplicate Timers from starting
  if(autoCloseTimer != null || alertTimer != null ) return;
  console.log('Starting Auto Close and Alert Timers')
  autoCloseTimer = setTimeout(displayPrompt, config.alertTimeout * 1000)
  alertTimer = setTimeout(closeWebViews, config.autoCloseTimeout * 1000)
}

function stopTimers() {
  if (alertTimer != null) {
    console.log('Clearing Alert Timer')
    clearTimeout(alertTimer)
    alertTimer = null;
  }
  if (autoCloseTimer != null) {
    console.log('Clearing Auto Close Timer')
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null;
  }
  closePrompt();
}


function displayPrompt() {
  console.log('Displaying Auto Close Prompt');
  xapi.Command.UserInterface.Message.Prompt.Display(config.alertPrompt);
}

function closePrompt() {
  console.log('Closing Any Open Alert Prompt');
  xapi.Command.UserInterface.Message.Prompt.Clear({ FeedbackId: config.alertPrompt.FeedbackId });
}

async function closeWebViews() {
  console.log('Closing WebViews');
  closePrompt();
  await xapi.Command.UserInterface.Extensions.Panel.Close();
  await xapi.Command.Presentation.Stop();
  if (!config.autoStandby) return
  enterStandby();
}

function enterStandby() {
  console.log('Entering Standby');
  xapi.Command.Standby.Activate();
}
