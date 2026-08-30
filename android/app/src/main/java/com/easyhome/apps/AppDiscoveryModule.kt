package com.easyhome.apps

import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class AppDiscoveryModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "AppDiscoveryModule"

  /**
   * Discovers all launchable applications installed on the Android device.
   * Runs in a background thread to avoid blocking the JavaScript/UI thread.
   */
  @ReactMethod
  fun getInstalledApps(promise: Promise) {
    Thread {
      try {
        val pm = reactContext.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
          addCategory(Intent.CATEGORY_LAUNCHER)
        }

        val resolveInfos: List<ResolveInfo> =
            pm.queryIntentActivities(mainIntent, PackageManager.MATCH_ALL)

        val appList = mutableListOf<AppItem>()
        val selfPackageName = reactContext.packageName

        for (resolveInfo in resolveInfos) {
          val packageName = resolveInfo.activityInfo.packageName
          if (packageName == selfPackageName) {
            continue
          }

          val appName = resolveInfo.loadLabel(pm).toString()
          var iconBase64 = ""

          try {
            // Load high-resolution launcher icon
            val drawable = try {
              resolveInfo.activityInfo.loadIcon(pm)
            } catch (e: Exception) {
              resolveInfo.loadIcon(pm)
            }
            iconBase64 = drawableToBase64(drawable)
          } catch (e: Exception) {
            // If icon conversion fails, proceed without icon
          }

          appList.add(AppItem(packageName, appName, iconBase64))
        }

        // Sort alphabetically by app name (case-insensitive)
        appList.sortBy { it.appName.lowercase() }

        val resultArray = Arguments.createArray()
        for (item in appList) {
          val map = Arguments.createMap().apply {
            putString("packageName", item.packageName)
            putString("appName", item.appName)
            putString("icon", if (item.icon.isNotEmpty()) item.icon else null)
            putBoolean("isImportant", false)
          }
          resultArray.pushMap(map)
        }

        promise.resolve(resultArray)
      } catch (e: Exception) {
        promise.reject("APP_DISCOVERY_ERROR", "Failed to retrieve installed apps: ${e.message}", e)
      }
    }.start()
  }

  /**
   * Launches an installed application by package name.
   */
  @ReactMethod
  fun launchApp(packageName: String, promise: Promise) {
    try {
      val pm = reactContext.packageManager
      val launchIntent = pm.getLaunchIntentForPackage(packageName)

      if (launchIntent != null) {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(launchIntent)
        promise.resolve(true)
      } else {
        promise.reject("APP_NOT_FOUND", "Could not create launch intent for package: $packageName")
      }
    } catch (e: Exception) {
      promise.reject("LAUNCH_ERROR", "Failed to launch app $packageName: ${e.message}", e)
    }
  }

  /**
   * Checks if an application is installed by package name.
   */
  @ReactMethod
  fun isAppInstalled(packageName: String, promise: Promise) {
    try {
      val pm = reactContext.packageManager
      pm.getPackageInfo(packageName, 0)
      promise.resolve(true)
    } catch (e: PackageManager.NameNotFoundException) {
      promise.resolve(false)
    } catch (e: Exception) {
      promise.reject("CHECK_ERROR", "Failed to check package: ${e.message}", e)
    }
  }

  /**
   * Helper function to convert any Android Drawable into a sharp, high-res Base64 PNG.
   */
  private fun drawableToBase64(drawable: Drawable): String {
    val targetSize = 160 // Crisp high resolution (160x160)

    val bitmap: Bitmap = if (drawable is BitmapDrawable && drawable.bitmap != null) {
      val src = drawable.bitmap
      if (src.width != targetSize || src.height != targetSize) {
        Bitmap.createScaledBitmap(src, targetSize, targetSize, true)
      } else {
        src
      }
    } else {
      val bmp = Bitmap.createBitmap(targetSize, targetSize, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bmp)
      drawable.setBounds(0, 0, canvas.width, canvas.height)
      drawable.draw(canvas)
      bmp
    }

    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 95, outputStream)
    val byteArray = outputStream.toByteArray()
    return "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP)
  }

  private data class AppItem(
      val packageName: String,
      val appName: String,
      val icon: String
  )
}
