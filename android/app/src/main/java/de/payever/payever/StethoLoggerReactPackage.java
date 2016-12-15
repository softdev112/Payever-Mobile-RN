package de.payever.payever;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.stetho.inspector.console.ConsolePeerManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class StethoLoggerReactPackage implements ReactPackage {

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new StethoLogger(reactContext));

        return modules;
    }

    private class StethoLogger extends ReactContextBaseJavaModule {
        public StethoLogger(ReactApplicationContext reactContext) {
            super(reactContext);
        }

        @Override
        public String getName() {
            return "StethoLogger";
        }

        @ReactMethod
        public void sendChromeNotification(String method, ReadableMap params) {
            ConsolePeerManager peerManager = ConsolePeerManager.getInstanceOrNull();
            if (peerManager == null) {
                return;
            }

            try {
                peerManager.sendNotificationToPeers(
                    method,
                    ReactNativeJson.convertMapToJson(params)
                );
            } catch (Exception e) {
                Log.d("StethoLogger", "Wrong message");
            }
        }

        @ReactMethod
        public void callChromeMethod(String method, ReadableMap params) {
            /*ConsolePeerManager peerManager = ConsolePeerManager.getInstanceOrNull();
            if (peerManager == null) {
                return;
            }

            PendingRequestCallback callback = new PendingRequestCallback();

            try {
                peerManager.invokeMethodOnPeers(
                    method,
                    ReactNativeJson.convertMapToJson(params),
                    null
                );

            } catch (Exception e) {
                Log.d("StethoLogger", "Wrong message");
            }
            */
        }
    }

    private static class ReactNativeJson {
        private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
            WritableMap map = new WritableNativeMap();

            Iterator<String> iterator = jsonObject.keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                Object value = jsonObject.get(key);
                if (value instanceof JSONObject) {
                    map.putMap(key, convertJsonToMap((JSONObject) value));
                } else if (value instanceof  JSONArray) {
                    map.putArray(key, convertJsonToArray((JSONArray) value));
                } else if (value instanceof  Boolean) {
                    map.putBoolean(key, (Boolean) value);
                } else if (value instanceof  Integer) {
                    map.putInt(key, (Integer) value);
                } else if (value instanceof  Double) {
                    map.putDouble(key, (Double) value);
                } else if (value instanceof String)  {
                    map.putString(key, (String) value);
                } else {
                    map.putString(key, value.toString());
                }
            }
            return map;
        }

        private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
            WritableArray array = new WritableNativeArray();

            for (int i = 0; i < jsonArray.length(); i++) {
                Object value = jsonArray.get(i);
                if (value instanceof JSONObject) {
                    array.pushMap(convertJsonToMap((JSONObject) value));
                } else if (value instanceof  JSONArray) {
                    array.pushArray(convertJsonToArray((JSONArray) value));
                } else if (value instanceof  Boolean) {
                    array.pushBoolean((Boolean) value);
                } else if (value instanceof  Integer) {
                    array.pushInt((Integer) value);
                } else if (value instanceof  Double) {
                    array.pushDouble((Double) value);
                } else if (value instanceof String)  {
                    array.pushString((String) value);
                } else {
                    array.pushString(value.toString());
                }
            }
            return array;
        }

        private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
            JSONObject object = new JSONObject();
            ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                switch (readableMap.getType(key)) {
                    case Null:
                        object.put(key, JSONObject.NULL);
                        break;
                    case Boolean:
                        object.put(key, readableMap.getBoolean(key));
                        break;
                    case Number:
                        object.put(key, readableMap.getDouble(key));
                        break;
                    case String:
                        object.put(key, readableMap.getString(key));
                        break;
                    case Map:
                        object.put(key, convertMapToJson(readableMap.getMap(key)));
                        break;
                    case Array:
                        object.put(key, convertArrayToJson(readableMap.getArray(key)));
                        break;
                }
            }
            return object;
        }

        private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
            JSONArray array = new JSONArray();
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case Null:
                        break;
                    case Boolean:
                        array.put(readableArray.getBoolean(i));
                        break;
                    case Number:
                        array.put(readableArray.getDouble(i));
                        break;
                    case String:
                        array.put(readableArray.getString(i));
                        break;
                    case Map:
                        array.put(convertMapToJson(readableArray.getMap(i)));
                        break;
                    case Array:
                        array.put(convertArrayToJson(readableArray.getArray(i)));
                        break;
                }
            }
            return array;
        }
    }
}