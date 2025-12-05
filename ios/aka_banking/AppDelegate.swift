import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CleverTapSDK
import CleverTapReact

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, CleverTapURLDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "aka_banking",
      in: window,
      launchOptions: launchOptions
    )

    // =========================================================
    // 🔵 CleverTap Integrations
    // =========================================================
    CleverTap.autoIntegrate()
    CleverTapReactManager.sharedInstance()?.applicationDidLaunch(options: launchOptions)

    // URL Delegate for deep-links
    CleverTap.sharedInstance()?.setUrlDelegate(self)

    // Rich Notification Categories (REQUIRED for Content Extension)
    let action1 = UNNotificationAction(identifier: "action_1", title: "Back", options: [])
    let action2 = UNNotificationAction(identifier: "action_2", title: "Next", options: [])
    let action3 = UNNotificationAction(identifier: "action_3", title: "View In App", options: [])

    let category = UNNotificationCategory(
        identifier: "CTNotification",
        actions: [action1, action2, action3],
        intentIdentifiers: [],
        options: []
    )

    UNUserNotificationCenter.current().setNotificationCategories([category])

    // Set delegate for notifications
    UNUserNotificationCenter.current().delegate = self

    return true
  }

  // =========================================================
  // 🔵 Foreground Notification Display
  // =========================================================
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.badge, .sound, .alert])
  }

  // =========================================================
  // 🔵 CleverTap URL Delegate
  // =========================================================
  func shouldHandleCleverTap(_ url: URL?, for channel: CleverTapChannel) -> Bool {
    print("Handling URL: \(url?.absoluteString ?? "") for channel: \(channel)")
    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
