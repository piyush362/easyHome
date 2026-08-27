package com.easyhome.contacts

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.provider.ContactsContract
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import java.net.URLEncoder

class ContactsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), PermissionListener {

  override fun getName(): String = "ContactsModule"

  private var permissionPromise: Promise? = null
  private val PERMISSION_REQUEST_CODE = 4401

  /**
   * Checks if READ_CONTACTS runtime permission is granted.
   */
  @ReactMethod
  fun hasContactsPermission(promise: Promise) {
    try {
      val granted =
          ContextCompat.checkSelfPermission(
              reactContext, Manifest.permission.READ_CONTACTS) ==
              PackageManager.PERMISSION_GRANTED
      promise.resolve(granted)
    } catch (e: Exception) {
      promise.reject("PERMISSION_CHECK_ERROR", e.message, e)
    }
  }

  /**
   * Checks if CALL_PHONE runtime permission is granted.
   */
  @ReactMethod
  fun hasCallPermission(promise: Promise) {
    try {
      val granted =
          ContextCompat.checkSelfPermission(
              reactContext, Manifest.permission.CALL_PHONE) ==
              PackageManager.PERMISSION_GRANTED
      promise.resolve(granted)
    } catch (e: Exception) {
      promise.reject("CALL_PERMISSION_CHECK_ERROR", e.message, e)
    }
  }

  /**
   * Requests READ_CONTACTS permission from the user.
   */
  @ReactMethod
  fun requestContactsPermission(promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Cannot request permission without active activity")
      return
    }

    if (ContextCompat.checkSelfPermission(
        reactContext, Manifest.permission.READ_CONTACTS) ==
        PackageManager.PERMISSION_GRANTED) {
      promise.resolve(true)
      return
    }

    if (activity is PermissionAwareActivity) {
      permissionPromise = promise
      activity.requestPermissions(
          arrayOf(Manifest.permission.READ_CONTACTS),
          PERMISSION_REQUEST_CODE,
          this
      )
    } else {
      promise.reject("ACTIVITY_NOT_PERMISSION_AWARE", "Activity cannot request runtime permissions")
    }
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<String>,
      grantResults: IntArray
  ): Boolean {
    if (requestCode == PERMISSION_REQUEST_CODE) {
      val granted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
      permissionPromise?.resolve(granted)
      permissionPromise = null
      return true
    }
    return false
  }

  /**
   * Retrieves all device contacts asynchronously in a background worker thread.
   */
  @ReactMethod
  fun getDeviceContacts(promise: Promise) {
    Thread {
      try {
        val granted =
            ContextCompat.checkSelfPermission(
                reactContext, Manifest.permission.READ_CONTACTS) ==
                PackageManager.PERMISSION_GRANTED

        if (!granted) {
          promise.reject("PERMISSION_DENIED", "READ_CONTACTS permission is required to fetch contacts.")
          return@Thread
        }

        val contentResolver = reactContext.contentResolver
        val uri = ContactsContract.CommonDataKinds.Phone.CONTENT_URI
        val projection = arrayOf(
            ContactsContract.CommonDataKinds.Phone.CONTACT_ID,
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
            ContactsContract.CommonDataKinds.Phone.NUMBER,
            ContactsContract.CommonDataKinds.Phone.PHOTO_THUMBNAIL_URI
        )
        val sortOrder = "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} COLLATE NOCASE ASC"

        val cursor: Cursor? = contentResolver.query(uri, projection, null, null, sortOrder)
        val contactsArray = Arguments.createArray()
        val seenNumbers = HashSet<String>()

        cursor?.use {
          val idIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID)
          val nameIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
          val numberIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
          val photoIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.PHOTO_THUMBNAIL_URI)

          while (it.moveToNext()) {
            val contactId = if (idIndex >= 0) it.getString(idIndex) else ""
            val name = if (nameIndex >= 0) it.getString(nameIndex) else "Unknown"
            val rawNumber = if (numberIndex >= 0) it.getString(numberIndex) ?: "" else ""
            val photoUri = if (photoIndex >= 0) it.getString(photoIndex) else null

            val normalizedNumber = rawNumber.replace(Regex("[^0-9+]"), "")
            if (normalizedNumber.isEmpty() || seenNumbers.contains(normalizedNumber)) {
              continue
            }
            seenNumbers.add(normalizedNumber)

            val contactMap = Arguments.createMap().apply {
              putString("id", contactId)
              putString("name", name)
              putString("phoneNumber", rawNumber.trim())
              putString("photoUri", photoUri)
            }
            contactsArray.pushMap(contactMap)
          }
        }

        promise.resolve(contactsArray)
      } catch (e: Exception) {
        promise.reject("GET_CONTACTS_ERROR", e.message, e)
      }
    }.start()
  }

  /**
   * Initiates a direct phone call.
   * If CALL_PHONE permission is granted, initiates immediate call with ACTION_CALL.
   * If not, safely opens the system dialer with ACTION_DIAL.
   */
  @ReactMethod
  fun makeDirectCall(phoneNumber: String, promise: Promise) {
    try {
      val cleanNumber = phoneNumber.trim()
      if (cleanNumber.isEmpty()) {
        promise.reject("INVALID_PHONE_NUMBER", "Phone number cannot be empty")
        return
      }

      val hasCallPermission =
          ContextCompat.checkSelfPermission(
              reactContext, Manifest.permission.CALL_PHONE) ==
              PackageManager.PERMISSION_GRANTED

      val action = if (hasCallPermission) Intent.ACTION_CALL else Intent.ACTION_DIAL
      val intent = Intent(action, Uri.parse("tel:${Uri.encode(cleanNumber)}")).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("CALL_ERROR", e.message, e)
    }
  }

  /**
   * Opens WhatsApp chat with the specified phone number.
   */
  @ReactMethod
  fun openWhatsApp(phoneNumber: String, message: String?, promise: Promise) {
    try {
      val cleanNumber = phoneNumber.replace(Regex("[^0-9]"), "")
      if (cleanNumber.isEmpty()) {
        promise.reject("INVALID_PHONE_NUMBER", "Phone number cannot be empty for WhatsApp")
        return
      }

      val textParam = if (!message.isNullOrEmpty()) {
        "&text=" + URLEncoder.encode(message, "UTF-8")
      } else {
        ""
      }

      val url = "https://api.whatsapp.com/send?phone=$cleanNumber$textParam"
      val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
        setPackage("com.whatsapp")
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      // Check if WhatsApp package is installed
      val pm = reactContext.packageManager
      if (intent.resolveActivity(pm) != null) {
        reactContext.startActivity(intent)
        promise.resolve(true)
      } else {
        // Fallback: Open URL in standard browser/chooser
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactContext.startActivity(browserIntent)
        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject("WHATSAPP_ERROR", e.message, e)
    }
  }

  /**
   * Opens SMS messenger pre-addressed to the phone number.
   */
  @ReactMethod
  fun sendSMS(phoneNumber: String, message: String?, promise: Promise) {
    try {
      val cleanNumber = phoneNumber.trim()
      val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:${Uri.encode(cleanNumber)}")).apply {
        if (!message.isNullOrEmpty()) {
          putExtra("sms_body", message)
        }
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      reactContext.startActivity(intent)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("SMS_ERROR", e.message, e)
    }
  }
}
