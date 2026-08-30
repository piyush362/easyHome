package com.easyhome.launcher

import android.app.role.RoleManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class LauncherModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "LauncherModule"
        private const val REQUEST_CODE_SET_DEFAULT = 1001
        const val EVENT_ON_HOME_PRESSED = "EasyHome_onHomeButtonPressed"

        private var instance: LauncherModule? = null

        /**
         * Called by MainActivity when a Home button/gesture intent is received.
         */
        fun onHomeButtonPressed() {
            instance?.emitHomeButtonPressed()
        }
    }

    override fun getName(): String = "LauncherModule"

    override fun initialize() {
        super.initialize()
        instance = this
    }

    override fun invalidate() {
        super.invalidate()
        if (instance == this) {
            instance = null
        }
    }

    /**
     * Emits the home button pressed event to React Native JavaScript.
     */
    private fun emitHomeButtonPressed() {
        try {
            if (reactContext.hasActiveReactInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    ?.emit(EVENT_ON_HOME_PRESSED, null)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to emit home pressed event", e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for React Native NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Double) {
        // Required for React Native NativeEventEmitter
    }

    /**
     * Checks whether EasyHome is currently the device's default launcher/home app.
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
                val resolveInfo = ctx.packageManager.resolveActivity(intent, 0)
                val currentLauncher = resolveInfo?.activityInfo?.let {
                    ComponentName(it.packageName, it.name)
                }
                currentLauncher?.packageName == ctx.packageName
            }
            promise.resolve(isDefault)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check launcher status", e)
            promise.reject("LAUNCHER_CHECK_ERROR", e.message, e)
        }
    }

    /**
     * Requests Android to set EasyHome as the default launcher.
     *
     * API 29+: Uses RoleManager with startActivityForResult (required for role requests).
     * Below API 29: Fires a HOME intent that triggers the system's launcher chooser dialog.
     */
    @ReactMethod
    fun requestSetDefaultLauncher(promise: Promise) {
        try {
            val activity = reactContext.currentActivity
            if (activity == null) {
                Log.e(TAG, "requestSetDefaultLauncher: currentActivity is null")
                promise.reject("NO_ACTIVITY", "No current activity available")
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // RoleManager intent MUST use startActivityForResult, not startActivity
                val roleManager = activity.getSystemService(Context.ROLE_SERVICE) as RoleManager
                if (!roleManager.isRoleAvailable(RoleManager.ROLE_HOME)) {
                    Log.w(TAG, "ROLE_HOME not available, falling back to home settings")
                    openHomeSettings(promise)
                    return
                }
                val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME)
                activity.startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT)
            } else {
                // Pre-Q: Fire a HOME intent to trigger the system chooser
                val intent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to request default launcher", e)
            // Fallback: try opening home settings
            try {
                openHomeSettings(promise)
            } catch (e2: Exception) {
                promise.reject("LAUNCHER_SET_ERROR", e.message, e)
            }
        }
    }

    /**
     * Opens the Android system Home/Launcher settings screen directly.
     */
    @ReactMethod
    fun openHomeSettings(promise: Promise) {
        try {
            // Try ACTION_HOME_SETTINGS first (most reliable)
            try {
                val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
                return
            } catch (e: Exception) {
                Log.w(TAG, "ACTION_HOME_SETTINGS failed, trying fallback", e)
            }

            // Fallback: open general app settings
            try {
                val intent = Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
                return
            } catch (e: Exception) {
                Log.w(TAG, "ACTION_MANAGE_DEFAULT_APPS_SETTINGS failed, trying fallback", e)
            }

            // Last fallback: open general settings
            val intent = Intent(Settings.ACTION_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open any settings screen", e)
            promise.reject("SETTINGS_ERROR", e.message, e)
        }
    }
}
