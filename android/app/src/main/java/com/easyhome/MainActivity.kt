package com.easyhome

import android.content.Intent
import com.easyhome.launcher.LauncherModule
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "EasyHome"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Called when a new intent is delivered to the existing singleTask activity.
   * Standard Android Home button and navigation gesture re-launches the HOME activity via onNewIntent.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleHomeIntent(intent)
  }

  private fun handleHomeIntent(intent: Intent?) {
    if (intent == null) return
    val action = intent.action
    val hasHomeCategory = intent.hasCategory(Intent.CATEGORY_HOME)
    val hasLauncherCategory = intent.hasCategory(Intent.CATEGORY_LAUNCHER)
    val isMainAction = Intent.ACTION_MAIN == action

    // If intent is HOME category or MAIN action with HOME/LAUNCHER/empty category, notify JS
    if (hasHomeCategory || (isMainAction && (hasLauncherCategory || intent.categories.isNullOrEmpty()))) {
      LauncherModule.onHomeButtonPressed()
    }
  }
}
