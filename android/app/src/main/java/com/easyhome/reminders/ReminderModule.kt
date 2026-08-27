package com.easyhome.reminders

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ReminderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ReminderModule"

    @ReactMethod
    fun scheduleReminder(
        id: String,
        title: String,
        message: String,
        type: String,
        timeMillis: Double,
        recurring: Boolean,
        pattern: String?,
        promise: Promise
    ) {
        try {
            val success = ReminderScheduler.schedule(
                reactContext,
                id,
                title,
                message,
                type,
                timeMillis.toLong(),
                recurring,
                pattern
            )
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelReminder(id: String, promise: Promise) {
        try {
            val success = ReminderScheduler.cancel(reactContext, id)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun createNotificationChannel(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val notificationManager =
                    reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                val channel = NotificationChannel(
                    ReminderReceiver.CHANNEL_ID,
                    ReminderReceiver.CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "EasyHome senior reminders for medication, hydration and tasks"
                    enableVibration(true)
                    setShowBadge(true)
                }
                notificationManager.createNotificationChannel(channel)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CHANNEL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun canScheduleExactAlarms(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            promise.resolve(alarmManager?.canScheduleExactAlarms() ?: false)
        } else {
            promise.resolve(true)
        }
    }
}
