package de.payever.payever.reactwebviewex;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.util.Log;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.NavigationActivity;

import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ReactWebViewExManager extends ReactWebViewManager {
  private static final String LOG_TAG = "ReactNativeJS ReactWebViewExManager";
  private static final String FILE_CHOOSER_TITLE = "Choose Picture";
  private static final String PICTURES_DIR_NAME = "de.payever.pictures";
  private static final String REACT_CLASS = "RCTWebViewEx";
  private static final int REQUEST_FILE_CODE = 51426;

  private ReactApplicationContext mContext;
  private String mUploadableFileTypes = "image/*";
  private WeakReference<NavigationActivity> mActivity;
  private WebViewExActivityCallbacks mActivityCallbacks;
  private Boolean mUploadEnabled = false;

  public ReactWebViewExManager(ReactApplicationContext context) {
    super();
    mContext = context;
    mActivity = new WeakReference<>((NavigationActivity) mContext.getCurrentActivity());
    mActivityCallbacks = (WebViewExActivityCallbacks) NavigationApplication
      .instance
      .getActivityCallbacks();
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected WebView createViewInstance(ThemedReactContext reactContext) {
    WebView webView = super.createViewInstance(reactContext);

    webView.setWebChromeClient(new WebChromeClient() {
      // file upload callback (Android 4.1 API 16) - (Android 4.3 API 18)
      @SuppressWarnings("unused")
      public void openFileChooser(
        ValueCallback<Uri> uploadMsg,
        String acceptType,
        String capture
      ) {
        if (!mUploadEnabled) return;

        if (Build.VERSION.SDK_INT >= 11
          && Build.VERSION.SDK_INT < 21
          && mActivity != null
          && mActivity.get() != null
          && mActivityCallbacks != null) {

          mActivityCallbacks.setFileUploadCallbackBefore5(uploadMsg);

          // Create picture folder and file
          File photoStorageDir = new File(
            Environment.getExternalStoragePublicDirectory(
              Environment.DIRECTORY_PICTURES
            ),
            PICTURES_DIR_NAME
          );

          Boolean isDirCreated = true;
          if (!photoStorageDir.exists()) {
            isDirCreated = photoStorageDir.mkdirs();
          }

          File photoFile = new File(
            (isDirCreated ? photoStorageDir : "")
              + File.separator + "IMG_"
              + String.valueOf(System.currentTimeMillis())
              + ".jpg");

          // Take photo from camera
          Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
          ActivityInfo activityInfo = takePictureIntent.resolveActivityInfo(
            mActivity.get().getPackageManager(),
            takePictureIntent.getFlags()
          );

          if (activityInfo.exported) {
            // Create file for photo
            takePictureIntent.putExtra(
              MediaStore.EXTRA_OUTPUT,
              Uri.fromFile(photoFile)
            );
            mActivityCallbacks.setCapturedFileName(photoFile.getAbsolutePath());
          } else {
            takePictureIntent = null;
          }

          // Take file from gallery
          Intent pictureSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
          pictureSelectionIntent.setType(mUploadableFileTypes);
          pictureSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);

          Intent chooserIntent = Intent.createChooser(
            pictureSelectionIntent,
            FILE_CHOOSER_TITLE
          );

          if (takePictureIntent != null) {
            chooserIntent.putExtra(
              Intent.EXTRA_INITIAL_INTENTS,
              new Parcelable[]{takePictureIntent}
            );
          }

          mActivity.get().startActivityForResult(chooserIntent, REQUEST_FILE_CODE);
        }
      }

      // file upload callback (Android 5.0 (API level 21) -- current) (public method)
      @SuppressWarnings("all")
      public boolean onShowFileChooser(
        WebView webView,
        ValueCallback<Uri[]> filePathCallback,
        WebChromeClient.FileChooserParams fileChooserParams
      ) {
        if (!mUploadEnabled) return false;

        if (Build.VERSION.SDK_INT >= 21
          && mActivity != null
          && mActivity.get() != null
          && mActivityCallbacks != null) {

          mActivityCallbacks.setFileUploadCallback(filePathCallback);

          // Take photo from camera
          Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
          ActivityInfo activityInfo = takePictureIntent.resolveActivityInfo(
            mActivity.get().getPackageManager(),
            takePictureIntent.getFlags()
          );

          if (activityInfo.exported) {
            // Create file for photo
            File photoFile = null;
            try {
              photoFile = createImageFile();
            } catch (IOException ex) {
              Log.e(LOG_TAG, "Enable to create file for photo", ex);
            }

            if (photoFile != null) {
              takePictureIntent.putExtra(
                MediaStore.EXTRA_OUTPUT,
                Uri.fromFile(photoFile)
              );
              mActivityCallbacks.setCapturedFileName(photoFile.getAbsolutePath());
            } else {
              takePictureIntent = null;
            }
          }

          // Take file from gallery
          Intent pictureSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
          pictureSelectionIntent.setType(mUploadableFileTypes);
          pictureSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);

          boolean allowMultiple =
            fileChooserParams.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE;
          if (allowMultiple) {
            pictureSelectionIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
          }

          Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
          chooserIntent.putExtra(Intent.EXTRA_INTENT, pictureSelectionIntent);
          chooserIntent.putExtra(Intent.EXTRA_TITLE, FILE_CHOOSER_TITLE);

          if (takePictureIntent != null) {
            chooserIntent.putExtra(
              Intent.EXTRA_INITIAL_INTENTS,
              new Intent[]{takePictureIntent}
            );
          }

          mActivity.get().startActivityForResult(chooserIntent, REQUEST_FILE_CODE);
          return true;
        } else {
          return false;
        }
      }

      @Override
      public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        if (Build.VERSION.SDK_INT < 21
          && mActivity != null
          && mActivity.get() != null) {
          new AlertDialog.Builder(mActivity.get())
            .setTitle("Message")
            .setMessage(message)
            .setPositiveButton(android.R.string.ok, null)
            .setCancelable(false)
            .create()
            .show();

          return false;
        }

        return super.onJsAlert(view, url, message, result);
      }

      /**
       * Create file for photo from the camera
       *
       * @return the File for photo
       *
       * @throws IOException
       */
      private File createImageFile() throws IOException {
        // Create image file name for photo from camera
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";

        File storageDir = Environment.getExternalStoragePublicDirectory(
          Environment.DIRECTORY_PICTURES
        );

        return File.createTempFile(imageFileName, ".jpg", storageDir);
      }
    });

    return webView;
  }

  @SuppressWarnings("unused")
  @ReactProp(name = "uploadEnabledAndroid", defaultBoolean = true)
  public void uploadEnabledAndroid(WebView view, boolean enabled) {
    mUploadEnabled = enabled;
  }
}