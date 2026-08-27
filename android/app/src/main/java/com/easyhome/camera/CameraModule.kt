package com.easyhome.camera

import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CameraModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "CameraModule"

  private fun startActivitySafely(intent: Intent) {
    val activity = reactContext.currentActivity
    intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
    if (activity != null) {
      activity.startActivity(intent)
      activity.overridePendingTransition(0, 0)
    } else {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
    }
  }

  /**
   * Opens the device's default rear camera app for taking photos.
   */
  @ReactMethod
  fun openCamera(promise: Promise) {
    try {
      val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)
      val pm = reactContext.packageManager
      if (intent.resolveActivity(pm) != null) {
        startActivitySafely(intent)
        promise.resolve(true)
      } else {
        // Fallback to basic image capture intent
        val fallbackIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivitySafely(fallbackIntent)
        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject("CAMERA_ERROR", "Failed to launch default camera: ${e.message}", e)
    }
  }

  /**
   * Opens the device's default camera app in selfie (front-facing) mode.
   */
  @ReactMethod
  fun openSelfie(promise: Promise) {
    try {
      val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).apply {
        putExtra("android.intent.extras.CAMERA_FACING", 1)
        putExtra("android.intent.extras.LENS_FACING_FRONT", 1)
        putExtra("android.intent.extra.USE_FRONT_CAMERA", true)
        putExtra("default_camera", "1")
        putExtra("camerafacing", "front")
      }

      val pm = reactContext.packageManager
      if (intent.resolveActivity(pm) != null) {
        startActivitySafely(intent)
        promise.resolve(true)
      } else {
        // Fallback to general camera
        openCamera(promise)
      }
    } catch (e: Exception) {
      promise.reject("SELFIE_ERROR", "Failed to launch selfie camera: ${e.message}", e)
    }
  }

  /**
   * Opens the device's default camera app in video recording mode.
   */
  @ReactMethod
  fun openVideoCamera(promise: Promise) {
    try {
      val intent = Intent(MediaStore.INTENT_ACTION_VIDEO_CAMERA)
      val pm = reactContext.packageManager
      if (intent.resolveActivity(pm) != null) {
        startActivitySafely(intent)
        promise.resolve(true)
      } else {
        // Fallback to video capture
        val fallbackIntent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)
        startActivitySafely(fallbackIntent)
        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject("VIDEO_CAMERA_ERROR", "Failed to launch video camera: ${e.message}", e)
    }
  }

  /**
   * Opens the device's default gallery / photos app.
   */
  @ReactMethod
  fun openGallery(promise: Promise) {
    try {
      // Known Android gallery packages
      val galleryPackages = listOf(
          "com.google.android.apps.photos",
          "com.sec.android.gallery3d",
          "com.android.gallery3d",
          "com.miui.gallery",
          "com.coloros.gallery3d",
          "com.huawei.photos"
      )

      val pm = reactContext.packageManager
      for (pkg in galleryPackages) {
        val launchIntent = pm.getLaunchIntentForPackage(pkg)
        if (launchIntent != null) {
          startActivitySafely(launchIntent)
          promise.resolve(true)
          return
        }
      }

      // Fallback 1: View external photos intent
      val viewIntent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*")
      }
      if (viewIntent.resolveActivity(pm) != null) {
        startActivitySafely(viewIntent)
        promise.resolve(true)
        return
      }

      // Fallback 2: Category App Gallery
      val categoryIntent = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_APP_GALLERY)
      }
      startActivitySafely(categoryIntent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("GALLERY_ERROR", "Failed to launch gallery: ${e.message}", e)
    }
  }
}
