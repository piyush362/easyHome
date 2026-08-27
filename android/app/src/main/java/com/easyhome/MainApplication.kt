package com.easyhome

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.easyhome.launcher.LauncherPackage
import com.easyhome.apps.AppDiscoveryPackage
import com.easyhome.contacts.ContactsPackage
import com.easyhome.torch.TorchPackage
import com.easyhome.camera.CameraPackage
import com.easyhome.image.ImageCompressorPackage
import com.easyhome.reminders.ReminderPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here:
          add(LauncherPackage())
          add(AppDiscoveryPackage())
          add(ContactsPackage())
          add(TorchPackage())
          add(CameraPackage())
          add(ImageCompressorPackage())
          add(ReminderPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
