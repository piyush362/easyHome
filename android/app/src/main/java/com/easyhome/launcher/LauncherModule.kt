package com.easyhome.launcher

import android.app.role.RoleManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LauncherModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "LauncherModule"

    /**
     * Checks whether EasyHome is currently the device's default launcher/home app.
     *
     * Uses RoleManager on API 29+ with fallback to resolveActivity for older versions.
     */
    @ReactMethod
    fun isDefaultLauncher(promise: Promise) {
        try {
            val ctx = reactContext
            val isDefault = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = ctx.getSystemService(Context.ROLE_SERVICE) as RoleManager
                roleManager.isRoleHeld(RoleManager.ROLE_HOME)
            } else {
                val intent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                }
                val resolveInfo = ctx.packageManager.resolveActivity(
                    intent,
                    0
                )
                val currentLauncher = resolveInfo?.activityInfo?.let {
                    ComponentName(it.packageName, it.name)
                }
                currentLauncher?.packageName == ctx.packageName
            }
            promise.resolve(isDefault)
        } catch (e: Exception) {
            promise.reject("LAUNCHER_CHECK_ERROR", "Failed to check launcher status", e)
        }
    }

    /**
     * Opens the Android system screen for selecting the default Home/Launcher app.
     *
     * On API 29+ uses RoleManager to request the HOME role directly.
     * On older versions, opens the Home settings or fires a HOME intent chooser.
     */
    @ReactMethod
    fun openDefaultLauncherSettings(promise: Promise) {
        try {
            val activity = reactContext.currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity available")
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = activity.getSystemService(Context.ROLE_SERVICE) as RoleManager
                val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME)
                activity.startActivity(intent)
            } else {
                // Fallback: open Home settings or fire a chooser
                try {
                    val intent = Intent(Settings.ACTION_HOME_SETTINGS)
                    activity.startActivity(intent)
                } catch (e: Exception) {
                    // If ACTION_HOME_SETTINGS is not available, fire a HOME intent
                    // which will trigger the system chooser
                    val intent = Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_HOME)
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    }
                    activity.startActivity(intent)
                }
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("LAUNCHER_SETTINGS_ERROR", "Failed to open launcher settings", e)
        }
    }
}
