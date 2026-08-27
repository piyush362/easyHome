package com.easyhome.torch

import android.content.Context
import android.content.pm.PackageManager
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import com.facebook.react.bridge.*

class TorchModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "TorchModule"

  private val cameraManager: CameraManager? by lazy {
    reactContext.getSystemService(Context.CAMERA_SERVICE) as? CameraManager
  }

  private var isTorchOn: Boolean = false
  private var cameraIdWithFlash: String? = null

  init {
    try {
      findCameraWithFlash()
      registerTorchCallback()
    } catch (e: Exception) {
      // Hardware initialization error handling
    }
  }

  private fun findCameraWithFlash(): String? {
    if (cameraIdWithFlash != null) return cameraIdWithFlash
    val cm = cameraManager ?: return null
    for (id in cm.cameraIdList) {
      val characteristics = cm.getCameraCharacteristics(id)
      val hasFlash = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
      val isBackFacing = characteristics.get(CameraCharacteristics.LENS_FACING) == CameraCharacteristics.LENS_FACING_BACK
      if (hasFlash && isBackFacing) {
        cameraIdWithFlash = id
        return id
      }
    }
    // Fallback: any camera with flash
    for (id in cm.cameraIdList) {
      val characteristics = cm.getCameraCharacteristics(id)
      if (characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true) {
        cameraIdWithFlash = id
        return id
      }
    }
    return null
  }

  private fun registerTorchCallback() {
    cameraManager?.registerTorchCallback(
        object : CameraManager.TorchCallback() {
          override fun onTorchModeChanged(cameraId: String, enabled: Boolean) {
            super.onTorchModeChanged(cameraId, enabled)
            if (cameraId == cameraIdWithFlash) {
              isTorchOn = enabled
            }
          }

          override fun onTorchModeUnavailable(cameraId: String) {
            super.onTorchModeUnavailable(cameraId)
            if (cameraId == cameraIdWithFlash) {
              isTorchOn = false
            }
          }
        },
        null
    )
  }

  /**
   * Check if torch / flash hardware is available on the device.
   */
  @ReactMethod
  fun isAvailable(promise: Promise) {
    try {
      val hasFlash =
          reactContext.packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)
      promise.resolve(hasFlash && findCameraWithFlash() != null)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", e.message, e)
    }
  }

  /**
   * Check current torch state.
   */
  @ReactMethod
  fun isTorchActive(promise: Promise) {
    promise.resolve(isTorchOn)
  }

  /**
   * Turn the torch on.
   */
  @ReactMethod
  fun turnOn(promise: Promise) {
    try {
      val cm = cameraManager
      val id = findCameraWithFlash()
      if (cm == null || id == null) {
        promise.reject("NO_FLASH", "Flashlight hardware is not available on this device")
        return
      }

      cm.setTorchMode(id, true)
      isTorchOn = true
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", "Failed to turn on flashlight: ${e.message}", e)
    }
  }

  /**
   * Turn the torch off.
   */
  @ReactMethod
  fun turnOff(promise: Promise) {
    try {
      val cm = cameraManager
      val id = findCameraWithFlash()
      if (cm == null || id == null) {
        promise.resolve(false)
        return
      }

      cm.setTorchMode(id, false)
      isTorchOn = false
      promise.resolve(false)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", "Failed to turn off flashlight: ${e.message}", e)
    }
  }

  /**
   * Toggle the torch on/off and return the new state.
   */
  @ReactMethod
  fun toggle(promise: Promise) {
    try {
      val cm = cameraManager
      val id = findCameraWithFlash()
      if (cm == null || id == null) {
        promise.reject("NO_FLASH", "Flashlight hardware is not available on this device")
        return
      }

      val targetState = !isTorchOn
      cm.setTorchMode(id, targetState)
      isTorchOn = targetState
      promise.resolve(targetState)
    } catch (e: Exception) {
      promise.reject("TORCH_ERROR", "Failed to toggle flashlight: ${e.message}", e)
    }
  }
}
