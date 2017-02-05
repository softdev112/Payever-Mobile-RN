package de.payever.payever.reactwebviewex;

import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.util.Log;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.WebStorage.QuotaUpdater;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Environment;
import android.os.Message;
import android.os.Parcelable;
import android.view.View;
import android.provider.MediaStore;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.lang.ref.WeakReference;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.reactnativenavigation.controllers.NavigationActivity;
import com.reactnativenavigation.NavigationApplication;

public class ReactWebViewExManager extends ReactWebViewManager {
	private static final String LOG_TAG = "ReactNativeJS ReactWebViewExManager";
	private static final String PICTURES_DIR_NAME = "de.payever.pictures";
	private static final int REQUEST_FILE_CODE = 51426;
	public static final String REACT_CLASS = "RCTWebViewEx";

	private ReactApplicationContext mContext;
    private String mUploadableFileTypes = "image/*";
    private WeakReference<NavigationActivity> mActivity;
	private WebViewExActivityCallbacks mActivityCallbacks;

	public ReactWebViewExManager(ReactApplicationContext context){
    	super();
    	mContext = context;
    }

	@Override
	public String getName() {
		return REACT_CLASS;
	}

	@ReactProp(name = "uploadEnabledAndroid", defaultBoolean = true)
    public void uploadEnabledAndroid(WebView view, boolean enabled) {
         mActivity = new WeakReference<>((NavigationActivity) mContext.getCurrentActivity());
		 mActivityCallbacks = (WebViewExActivityCallbacks) NavigationApplication
		 	.instance
		 	.getActivityCallbacks();

         if(enabled) {
             view.setWebChromeClient(new WebChromeClient() {
 	  			// file upload callback (Android 2.2 API 8) - Android 2.3 (API 10)
       			@SuppressWarnings("unused")
       			public void openFileChooser(ValueCallback<Uri> uploadMsg) {
       				openFileChooser(uploadMsg, "");
       			}

       			// file upload callback (Android 3.0 API 11) - (Android 4.0 API 15)
       			public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
       				openFileChooser(uploadMsg, acceptType, "");
       			}

       			// file upload callback (Android 4.1 API 16) - (Android 4.3 API 18)
       			@SuppressWarnings("unused")
      			public void openFileChooser(
      				ValueCallback<Uri> uploadMsg,
      				String acceptType,
      				String capture
      			) {
       				if (Build.VERSION.SDK_INT >= 11
       					&& Build.VERSION.SDK_INT < 21
                        && mActivity != null
                        && mActivity.get() != null
                        && mActivityCallbacks != null) {

                        mActivityCallbacks.setFileUploadCallbackBefore5(uploadMsg);

						File photoStorageDir = null;
						File photoFile = null;

						// Create picture folder and file
						photoStorageDir = new File(
							Environment.getExternalStoragePublicDirectory(
								Environment.DIRECTORY_PICTURES
							),
							PICTURES_DIR_NAME
						);

						if (photoStorageDir != null) {
							if (!photoStorageDir.exists()) {
								photoStorageDir.mkdirs();
							}

							photoFile = new File(
								photoStorageDir + File.separator + "IMG_"
								+ String.valueOf(System.currentTimeMillis())
								+ ".jpg");
						}

						Intent takePictureIntent = null;
						if (photoStorageDir != null && photoFile != null) {
	                        // Take photo from camera
                            takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
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
						}

                        // Take file from gallery
                        Intent pictureSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
                        pictureSelectionIntent.setType(mUploadableFileTypes);
                        pictureSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);

		  				Intent chooserIntent = Intent.createChooser(
		  					pictureSelectionIntent,
		  					getFileUploadPromptLabel()
		  				);

		  				if (takePictureIntent != null) {
		  				   	chooserIntent.putExtra(
                           		Intent.EXTRA_INITIAL_INTENTS,
                           		new Parcelable[] { takePictureIntent }
                           	);
                        }

                        mActivity.get().startActivityForResult(chooserIntent, REQUEST_FILE_CODE);
       				}
       			}

       			// file upload callback (Android 5.0 (API level 21) -- current) (public method)
      			@SuppressWarnings("all")
       			public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
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
       					chooserIntent.putExtra(Intent.EXTRA_TITLE, getFileUploadPromptLabel());

                    	if (takePictureIntent != null) {
       						chooserIntent.putExtra(
       							Intent.EXTRA_INITIAL_INTENTS,
       							new Intent[]{ takePictureIntent }
       						);
						}

                   		mActivity.get().startActivityForResult(chooserIntent, REQUEST_FILE_CODE);

       					return true;
       				} else {
             			return false;
             		}
             	}

             	@Override
             	public void onProgressChanged(WebView view, int newProgress) {
   					super.onProgressChanged(view, newProgress);
       			}

       			@Override
       			public void onReceivedTitle(WebView view, String title) {
   					super.onReceivedTitle(view, title);
       			}

       			@Override
       			public void onReceivedIcon(WebView view, Bitmap icon) {
  					super.onReceivedIcon(view, icon);
   				}

       			@Override
       			public void onReceivedTouchIconUrl(WebView view, String url, boolean precomposed) {
   					super.onReceivedTouchIconUrl(view, url, precomposed);
       			}

       			@Override
       			public void onShowCustomView(View view, CustomViewCallback callback) {
   					super.onShowCustomView(view, callback);
       			}

       			@SuppressWarnings("all")
       			public void onShowCustomView(
       				View view,
       				int requestedOrientation,
       				CustomViewCallback callback
       			) {
       				if (Build.VERSION.SDK_INT >= 14) {
  						super.onShowCustomView(view, requestedOrientation, callback);
  					}
				}

             	@Override
             	public void onHideCustomView() {
   					super.onHideCustomView();
       			}

       			@Override
       			public boolean onCreateWindow(
       				WebView view,
       				boolean isDialog,
       				boolean isUserGesture,
       				Message resultMsg
       			) {
   					return super.onCreateWindow(view, isDialog, isUserGesture, resultMsg);
       			}

       			@Override
       			public void onRequestFocus(WebView view) {
  					super.onRequestFocus(view);
      			}

       			@Override
       			public void onCloseWindow(WebView window) {
   					super.onCloseWindow(window);
       			}

       			@Override
       			public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
   					return super.onJsAlert(view, url, message, result);
       			}

       			@Override
      			public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
  					return super.onJsConfirm(view, url, message, result);
       			}

       			@Override
       			public boolean onJsPrompt(
       				WebView view,
       				String url,
       				String message,
       				String defaultValue,
       				JsPromptResult result
       			) {
   					return super.onJsPrompt(view, url, message, defaultValue, result);
       			}

       			@Override
       			public boolean onJsBeforeUnload(
       				WebView view,
       				String url,
       				String message,
       				JsResult result
       			) {
   					return super.onJsBeforeUnload(view, url, message, result);
       			}

       			@SuppressWarnings("all")
       			public void onPermissionRequest(PermissionRequest request) {
      				if (Build.VERSION.SDK_INT >= 21) {
   						super.onPermissionRequest(request);
       				}
       			}

             	@SuppressWarnings("all")
             	public void onPermissionRequestCanceled(PermissionRequest request) {
             		if (Build.VERSION.SDK_INT >= 21) {
   						super.onPermissionRequestCanceled(request);
             		}
				}

             	@Override
             	public boolean onJsTimeout() {
   					return super.onJsTimeout();
       			}

       			@Override
       			public void onConsoleMessage(String message, int lineNumber, String sourceID) {
   					super.onConsoleMessage(message, lineNumber, sourceID);
       			}

       			@Override
      			public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
   					return super.onConsoleMessage(consoleMessage);
       			}

       			@Override
       			public Bitmap getDefaultVideoPoster() {
   					return super.getDefaultVideoPoster();
       			}

       			@Override
       			public View getVideoLoadingProgressView() {
   					return super.getVideoLoadingProgressView();
       			}

       			@Override
       			public void getVisitedHistory(ValueCallback<String[]> callback) {
   					super.getVisitedHistory(callback);
       			}

      			@Override
       			public void onExceededDatabaseQuota(
       				String url,
       				String databaseIdentifier,
       				long quota,
       				long estimatedDatabaseSize,
       				long totalQuota,
       				QuotaUpdater quotaUpdater
       			) {
  					super.onExceededDatabaseQuota(
  						url,
  						databaseIdentifier,
  						quota,
  						estimatedDatabaseSize,
  						totalQuota,
  						quotaUpdater
  					);
       			}

       			@Override
       			public void onReachedMaxAppCacheSize(
       				long requiredStorage,
       				long quota,
       				QuotaUpdater quotaUpdater
       			) {
   					super.onReachedMaxAppCacheSize(requiredStorage, quota, quotaUpdater);
       			}
            });
	    }
    }

    /**
     * @return the label for the file upload prompts as a string
     */
    private String getFileUploadPromptLabel() {
      	// return English translation by default
       	return "Choose a picture";
    }

    /**
     * Create file for photo from the camera
     *
     * @return the File for photo
     */
    private File createImageFile() throws IOException {
      	// Create image file name for photo from camera
       	String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
       	String imageFileName = "JPEG_" + timeStamp + "_";

       	File storageDir = Environment.getExternalStoragePublicDirectory(
       		Environment.DIRECTORY_PICTURES
       	);
       	File imageFile = File.createTempFile(imageFileName,	".jpg", storageDir);

       	return imageFile;
    }
}