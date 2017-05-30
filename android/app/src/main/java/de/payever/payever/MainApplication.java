package de.payever.payever;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.smixx.fabric.FabricPackage;
import com.facebook.react.ReactPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import de.payever.payever.reactwebviewex.ReactWebViewExPackage;
import de.payever.payever.reactwebviewex.WebViewExActivityCallbacks;
import com.reactnativenavigation.NavigationApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

import com.wix.reactnativenotifications.RNNotificationsPackage;

public class MainApplication extends NavigationApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        setActivityCallbacks(new WebViewExActivityCallbacks());
        Fabric.with(this, new Crashlytics());
    }

    @Override
    public boolean isDebug() {
	    // Make sure you are using BuildConfig from your own application
	    return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.asList(
            new FabricPackage(),
            new ReactWebViewExPackage(),
            new RNNotificationsPackage(MainApplication.this),
            new RNDeviceInfo(),
            new RNSoundPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage()
        );
    }
}
