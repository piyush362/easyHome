package com.easyhome

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
   * Override onBackPressed to prevent the launcher from being dismissed.
   * Standard launcher behavior: pressing Back on the home screen does nothing.
   * The launcher should only be exited by switching to another launcher via settings.
   */
  @Deprecated("Deprecated in Java")
  override fun onBackPressed() {
    // Do not call super.onBackPressed() — launchers should not exit on back press.
    // This prevents the user from accidentally leaving the launcher.
    // The activity remains in place, which is the expected behavior for any Android Home app.
  }
}
