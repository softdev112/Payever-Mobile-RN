package de.payever.payever;

import com.smixx.fabric.FabricPackage;
import com.facebook.react.ReactPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
    }

    @Override
    public boolean isDebug() {
	    // Make sure you are using BuildConfig from your own application
	    return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new FabricPackage()
        );
    }
}