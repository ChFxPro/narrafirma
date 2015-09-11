import m = require("mithril");
import PanelSetup = require("./PanelSetup");
import Globals = require("./Globals");

"use strict";

var panelSpecificationCollection;

var currentSectionID;
var currentPageSpecification;
var userIdentifier;

var navigationController = null;

/* jshint scripturl:true */
var launchHelpCommand = "javascript:narrafirma_helpClicked()";
var logoutCommand = "javascript:narrafirma_logoutClicked()";

var Navigation: any = {
    panelBuilder: null,
    
    controller: function(args) {
        // console.log("********************** Making new navigation pane");
        this.pageID = null;
        this.pageSpecification = null;
        this.panelBuilder = Navigation.panelBuilder;
    },
    
    view: function(controller, args) {
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&& View called for navigation pane");
        return m("div[id=narrafirma-navigation]", [
            m("span[id=narrafirma-name]", {
                "class": Globals.clientState().serverStatus(),
                "title": Globals.clientState().serverStatusText()
            }, "NarraFirma™"),
            m("span[id=narrafirma-breadcrumbs]", buildBreadcrumbs(controller)),
            m("a[id=narrafirma-help-link]", {href: launchHelpCommand}, "(Help)"),
            m("a[id=narrafirma-logout-link]", {href: logoutCommand}, 'Logout (' + userIdentifier + ')')
        ]);
    }
};

export function initializeNavigationPane(thePanelSpecificationCollection, theUserIdentifier, panelBuilder) {
    panelSpecificationCollection = thePanelSpecificationCollection;
    userIdentifier = theUserIdentifier;
    
    Navigation.panelBuilder = panelBuilder;
    navigationController = m.mount(document.getElementById("navigationDiv"), Navigation);
}
    
export function setCurrentPageSpecification(pageID, pageSpecification) {
    currentPageSpecification = pageSpecification;
    
    navigationController.pageID = pageID;
    navigationController.pageSpecification = pageSpecification;
}

function buildBreadcrumbs(controller) {
    var pageID = controller.pageID;
    var pageSpecification = controller.pageSpecification;
    
    currentPageSpecification = pageSpecification;
    
    if (!pageSpecification) return ["Starting up..."];

    var breadcrumbs = [];
    if (pageID !== PanelSetup.startPage()) {
        breadcrumbs.push(htmlForBreadcrumb(PanelSetup.startPage(), "Home"));
        breadcrumbs .push(" > ");
        // console.log("pageSpecification", pageSpecification);
        // TODO: Should lookup name of section
        if (!pageSpecification.isHeader) {
            var sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID("page_" + pageSpecification.section);
            if (sectionPageSpecification) {
                breadcrumbs.push(htmlForBreadcrumb(sectionPageSpecification.id, sectionPageSpecification.displayName));
                breadcrumbs.push(" > ");
            } else {
                console.log("ERROR: could not find sectionPageSpecification for: ", pageSpecification.section, pageSpecification);
            }
        }
    }
    breadcrumbs.push(m("span", {id: "narrafirma-breadcrumb-current"}, pageSpecification.displayName));
    return breadcrumbs;
}

function htmlForBreadcrumb(pageIdentifier, pageName) {
    return m("a", {href: "javascript:narrafirma_openPage(\'" + pageIdentifier + "\')"}, pageName);
}

export function getCurrentPageSpecification() {
    return currentPageSpecification;
}