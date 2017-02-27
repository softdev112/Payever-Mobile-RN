package de.payever.payever;

import com.facebook.stetho.inspector.console.ConsolePeerManager;
import com.facebook.stetho.inspector.helper.ChromePeerManager;
import com.facebook.stetho.inspector.protocol.ChromeDevtoolsMethod;
import com.smixx.fabric.FabricPackage;
import com.facebook.react.ReactPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import de.payever.payever.reactwebviewex.ReactWebViewExPackage;
import de.payever.payever.reactwebviewex.WebViewExActivityCallbacks;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

import android.os.Bundle;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.stetho.Stetho;
import okhttp3.OkHttpClient;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import java.util.concurrent.TimeUnit;
import com.wix.reactnativenotifications.RNNotificationsPackage;

public class MainApplication extends NavigationApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        setActivityCallbacks(new WebViewExActivityCallbacks());

        Fabric.with(this, new Crashlytics());
        if (this.isDebug()) {
            this.initStetho();
        }
    }

    @Override
    public boolean isDebug() {
	    // Make sure you are using BuildConfig from your own application
	    return BuildConfig.DEBUG;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
            new FabricPackage(),
            new StethoLoggerReactPackage(),
            new ReactWebViewExPackage(),
            new RNNotificationsPackage(MainApplication.this)
        );
    }

    private void initStetho() {
        Stetho.initializeWithDefaults(this);
        OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(0, TimeUnit.MILLISECONDS)
            .readTimeout(0, TimeUnit.MILLISECONDS)
            .writeTimeout(0, TimeUnit.MILLISECONDS)
            .cookieJar(new ReactCookieJarContainer())
            .addNetworkInterceptor(new StethoInterceptor())
            .build();
        OkHttpClientProvider.replaceOkHttpClient(client);

        ConsolePeerManager.getInstanceOrNull();
    }
}
