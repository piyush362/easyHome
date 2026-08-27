package com.easyhome.image

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import android.os.Build
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import kotlin.math.max
import kotlin.math.min

class ImageCompressorModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ImageCompressorModule"

  /**
   * Compresses and resizes high-resolution images to lightweight JPEGs in a worker thread.
   */
  @ReactMethod
  fun compressImage(
      imageUri: String,
      maxWidth: Double,
      maxHeight: Double,
      quality: Double,
      promise: Promise
  ) {
    Thread {
      try {
        val targetWidth = if (maxWidth > 0) maxWidth.toInt() else 512
        val targetHeight = if (maxHeight > 0) maxHeight.toInt() else 512
        val targetQuality = if (quality in 1.0..100.0) quality.toInt() else 80

        val uri = if (imageUri.startsWith("file://") || imageUri.startsWith("content://")) {
          Uri.parse(imageUri)
        } else {
          Uri.fromFile(File(imageUri))
        }

        // 1. Read bounds only to determine inSampleSize without memory bloat
        var inputStream: InputStream? = reactContext.contentResolver.openInputStream(uri)
        if (inputStream == null) {
          promise.reject("INVALID_URI", "Cannot open input stream for: $imageUri")
          return@Thread
        }

        val options = BitmapFactory.Options().apply {
          inJustDecodeBounds = true
        }
        BitmapFactory.decodeStream(inputStream, null, options)
        inputStream.close()

        val rawWidth = options.outWidth
        val rawHeight = options.outHeight

        if (rawWidth <= 0 || rawHeight <= 0) {
          promise.reject("DECODE_ERROR", "Failed to decode image dimensions")
          return@Thread
        }

        // Calculate sample size
        var inSampleSize = 1
        if (rawHeight > targetHeight || rawWidth > targetWidth) {
          val halfHeight = rawHeight / 2
          val halfWidth = rawWidth / 2
          while ((halfHeight / inSampleSize) >= targetHeight && (halfWidth / inSampleSize) >= targetWidth) {
            inSampleSize *= 2
          }
        }

        // 2. Decode downsampled bitmap
        options.inJustDecodeBounds = false
        options.inSampleSize = inSampleSize
        options.inPreferredConfig = Bitmap.Config.RGB_565 // Memory efficient

        inputStream = reactContext.contentResolver.openInputStream(uri)
        var bitmap = BitmapFactory.decodeStream(inputStream, null, options)
        inputStream?.close()

        if (bitmap == null) {
          promise.reject("DECODE_ERROR", "Failed to decode bitmap from stream")
          return@Thread
        }

        // 3. Correct EXIF orientation
        val orientation = getExifOrientation(reactContext, uri)
        if (orientation != 0) {
          val matrix = Matrix().apply { postRotate(orientation.toFloat()) }
          val rotatedBitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
          if (rotatedBitmap != bitmap) {
            bitmap.recycle()
            bitmap = rotatedBitmap
          }
        }

        // 4. Exact scale if still larger than target bounds
        val currentWidth = bitmap.width
        val currentHeight = bitmap.height
        val scale = min(targetWidth.toFloat() / currentWidth, targetHeight.toFloat() / currentHeight)

        val finalBitmap = if (scale < 1.0f) {
          val scaledW = max(1, (currentWidth * scale).toInt())
          val scaledH = max(1, (currentHeight * scale).toInt())
          val scaled = Bitmap.createScaledBitmap(bitmap, scaledW, scaledH, true)
          if (scaled != bitmap) {
            bitmap.recycle()
          }
          scaled
        } else {
          bitmap
        }

        // 5. Save compressed JPEG to cache directory
        val avatarsDir = File(reactContext.cacheDir, "easyhome_avatars").apply {
          if (!exists()) mkdirs()
        }
        val outputFile = File(avatarsDir, "avatar_${System.currentTimeMillis()}.jpg")
        val outputStream = FileOutputStream(outputFile)

        finalBitmap.compress(Bitmap.CompressFormat.JPEG, targetQuality, outputStream)
        outputStream.flush()
        outputStream.close()
        finalBitmap.recycle()

        val resultMap = Arguments.createMap().apply {
          putString("uri", "file://${outputFile.absolutePath}")
          putInt("width", finalBitmap.width)
          putInt("height", finalBitmap.height)
          putDouble("sizeBytes", outputFile.length().toDouble())
        }

        promise.resolve(resultMap)
      } catch (e: Exception) {
        promise.reject("COMPRESS_ERROR", "Image compression failed: ${e.message}", e)
      }
    }.start()
  }

  private fun getExifOrientation(context: Context, uri: Uri): Int {
    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        val stream = context.contentResolver.openInputStream(uri) ?: return 0
        val exif = ExifInterface(stream)
        val orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
        stream.close()
        when (orientation) {
          ExifInterface.ORIENTATION_ROTATE_90 -> 90
          ExifInterface.ORIENTATION_ROTATE_180 -> 180
          ExifInterface.ORIENTATION_ROTATE_270 -> 270
          else -> 0
        }
      } else {
        val path = uri.path ?: return 0
        val exif = ExifInterface(path)
        val orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
        when (orientation) {
          ExifInterface.ORIENTATION_ROTATE_90 -> 90
          ExifInterface.ORIENTATION_ROTATE_180 -> 180
          ExifInterface.ORIENTATION_ROTATE_270 -> 270
          else -> 0
        }
      }
    } catch (e: Exception) {
      0
    }
  }
}
