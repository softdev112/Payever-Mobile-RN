package de.payever.payever.reactwebviewex;

import android.annotation.TargetApi;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import android.app.Activity;
import android.content.Intent;
import android.webkit.ValueCallback;
import android.content.ClipData;
import android.os.Build;
import android.net.Uri;

import java.io.File;

public class WebViewExActivityCallbacks extends ActivityCallbacks {
	private static final int REQUEST_FILE_CODE = 51426;

	/** File upload callback for platform versions prior to Android 5.0 */
    private ValueCallback<Uri> mFileUploadCallbackBefore5;

    /** File upload callback for Android 5.0+ */
    private ValueCallback<Uri[]> mFileUploadCallback;

    private String mCapturedFileName;

	@Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == REQUEST_FILE_CODE) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                onActivityResultKitKat(requestCode, resultCode, data);
            } else {
                onActivityResultLollipop(requestCode, resultCode, data);
            }
		}
	}

    private void onActivityResultKitKat(int requestCode, int resultCode, Intent data) {
        if (mFileUploadCallbackBefore5 == null) return;

       	Uri results = null;
       	if ( resultCode == Activity.RESULT_OK ) {
			if (data != null) {
				results = data.getData();
			} else {
				// Test if user take photo
				if (mCapturedFileName != null) {
					File file = new File(mCapturedFileName);
					if (file.exists()) {
						results = Uri.fromFile(file);
					}

					mCapturedFileName = null;
				}
			}
		}

       	mFileUploadCallbackBefore5.onReceiveValue(results);
        mFileUploadCallbackBefore5 = null;
	}

	@TargetApi(Build.VERSION_CODES.LOLLIPOP)
    private void onActivityResultLollipop(int requestCode, int resultCode, Intent data) {
    	if (mFileUploadCallback == null) return;

        Uri[] results = null;
        if (resultCode == Activity.RESULT_OK) {
            if (data != null) {
                String dataString = data.getDataString();
                ClipData clipData = data.getClipData();

                if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                } else if (clipData != null) {
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        ClipData.Item item = clipData.getItemAt(i);
                        results[i] = item.getUri();
                    }
                } else {
                	// Test if user take photo
                	if (mCapturedFileName != null) {
                		File file = new File(mCapturedFileName);
                		if (file.exists()) {
                			results = new Uri[]{ Uri.fromFile(file) };
                		}

   						mCapturedFileName = null;
   					}
                }
            }
        }

        mFileUploadCallback.onReceiveValue(results);
        mFileUploadCallback = null;
    }

	public void setFileUploadCallbackBefore5(ValueCallback<Uri> callback) {
		mFileUploadCallbackBefore5 = callback;
	}

	public void setFileUploadCallback(ValueCallback<Uri[]> callback) {
    	mFileUploadCallback = callback;
    }

    public void setCapturedFileName(String fileName) {
    	mCapturedFileName = fileName;
    }
}