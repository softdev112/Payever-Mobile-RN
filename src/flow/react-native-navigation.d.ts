/**
 * Webstorm works better with TS than with Flow
 */
declare module "react-native-navigation" {
    export interface NavigatorInterface {
        constructor(
            navigatorID: number,
            navigatorEventID: number,
            screenInstanceID: number
        ): void;
        push(params: Object): any;
        pop(params: Object): any;
        popToRoot(params: Object): any;
        resetTo(params: Object): any;
        showModal(params: Object): any;
        dismissModal(params: Object): any;
        dismissAllModals(params: Object): any;
        showLightBox(params: Object): any;
        dismissLightBox(params: Object): any;
        showInAppNotification(params: Object): any;
        dismissInAppNotification(params: Object): any;
        setButtons(params: Object): any;
        setTitle(params: Object): any;
        setSubTitle(params: Object): any;
        setTitleImage(params: Object): any;
        toggleDrawer(params: Object): any;
        toggleTabs(params: Object): any;
        toggleNavBar(params: Object): any;
        setTabBadge(params: Object): any;
        switchToTab(params: Object): any;
        showSnackbar(params: Object): any;
        showContextualMenu(params: Object, onButtonPressed: Function): any;
        dismissContextualMenu() : any;
        setOnNavigatorEvent(callback: Function): any;
        handleDeepLink(params: Object): any;
        onNavigatorEvent(event: Object): void;
        cleanup(): void;
    }

    export type Navigator = NavigatorInterface;
}