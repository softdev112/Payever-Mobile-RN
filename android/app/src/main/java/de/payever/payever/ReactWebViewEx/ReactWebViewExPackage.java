package de.payever.payever.reactwebviewex;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ReactWebViewExPackage implements ReactPackage {

    @Override public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new ReactWebViewExManager(reactContext));
    }

    @Override public List<NativeModule> createNativeModules( ReactApplicationContext reactContext) {
    	return Collections.emptyList();
    }
}