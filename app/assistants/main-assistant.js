var updaterModel = null;

function MainAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the 
       additional parameters (after the scene name) that were passed to pushScene. The reference
       to the scene controller (this.controller) has not be established yet, so any initialization
       that needs the scene controller should be done in the setup function below. */
    updaterModel = new UpdaterModel();
    this.updateCheckDone = false;
}

MainAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the scene is first created */

    /* use Mojo.View.render to render view templates and add them to the scene, if needed */

    /* setup widgets here */
    this.controller.setupWidget("toggleYouTubeLong",
        this.attributes = {
            trueValue: true,
            falseValue: false
        },
        this.model = {
            value: false,
            disabled: false
        }
    );
    this.controller.setupWidget("toggleYouTubeMobile",
        this.attributes = {
            trueValue: true,
            falseValue: false
        },
        this.model = {
            value: false,
            disabled: false
        }
    );
    this.controller.setupWidget("toggleYouTubeShort",
        this.attributes = {
            trueValue: true,
            falseValue: false
        },
        this.model = {
            value: false,
            disabled: false
        }
    );
    this.controller.setupWidget("toggleRedditShort",
        this.attributes = {
            trueValue: true,
            falseValue: false
        },
        this.model = {
            value: false,
            disabled: false
        }
    );
    this.controller.setupWidget("drawerCustom",
        this.attributes = {
            modelProperty: 'open',
            unstyled: false
        },
        this.model = {
            open: false
        }
    );
    this.customType = "URL";
    this.controller.setupWidget("listCustomUrlType",
        this.attributes = {
            choices: [
                { label: "URL", value: "URL" },
                { label: "URI", value: "URI" }
            ]
        },
        this.model = {
            value: this.customType,
            disabled: false
        }
    );
    this.controller.setupWidget("txtCustomUrlPattern",
        this.attributes = {
            hintText: $L("^[^:]+://yourserver.com"),
            multiline: false,
            enterSubmits: false,
            focus: false,
            textCase: Mojo.Widget.steModeLowerCase,
            textReplacement: false,
            autoReplace: false
        },
        this.model = {
            value: "",
            disabled: false
        }
    );
    this.controller.setupWidget("txtCustomAppid",
        this.attributes = {
            hintText: $L("com.yourcompany.app"),
            multiline: false,
            enterSubmits: false,
            focus: false,
            textCase: Mojo.Widget.steModeLowerCase,
            textReplacement: false,
            autoReplace: false
        },
        this.model = {
            value: "",
            disabled: false
        }
    );
    this.controller.setupWidget("btnAddCustom",
        this.attributes = {},
        this.model = {
            label: "Add Custom",
            disabled: false,
            buttonClass: "affirmative"
        }
    );
    this.controller.setupWidget("btnRemoveCustom",
        this.attributes = {},
        this.model = {
            label: "Clear Custom",
            disabled: false,
            buttonClass: "negative"
        }
    );
    this.controller.setupWidget("drawerTest",
        this.attributes = {
            modelProperty: 'open',
            unstyled: false
        },
        this.model = {
            open: true
        }
    );
    this.controller.setupWidget("txtTestURL",
        this.attributes = {
            hintText: $L("http://www.yourserver.com"),
            multiline: false,
            enterSubmits: false,
            focus: false,
            textCase: Mojo.Widget.steModeLowerCase,
            textReplacement: false,
            autoReplace: false
        },
        this.model = {
            value: "https://www.youtube.com/watch?v=VYVz2qa30G0",
            disabled: false
        }
    );
    this.controller.setupWidget("btnTest",
        this.attributes = {},
        this.model = {
            label: "Test",
            disabled: false,
            buttonClass: "primary"
        }
    );
    //Main Menu
    this.appMenuAttributes = { omitDefaultItems: true };
    this.appMenuModel = {
        items: [
            Mojo.Menu.editItem,
            { label: "About", command: 'do-myAbout' }
        ]
    };
    this.controller.setupWidget(Mojo.Menu.appMenu, this.appMenuAttributes, this.appMenuModel);
    /* add event handlers to listen to events from widgets */
    Mojo.Event.listen(this.controller.get("titleYouTubeLong"), Mojo.Event.tap, this.handleTitleTap.bind(this));
    Mojo.Event.listen(this.controller.get("toggleYouTubeLong"), Mojo.Event.propertyChange, this.handleValueChange.bind(this));
    Mojo.Event.listen(this.controller.get("titleYouTubeMobile"), Mojo.Event.tap, this.handleTitleTap.bind(this));
    Mojo.Event.listen(this.controller.get("toggleYouTubeMobile"), Mojo.Event.propertyChange, this.handleValueChange.bind(this));
    Mojo.Event.listen(this.controller.get("titleYouTubeShort"), Mojo.Event.tap, this.handleTitleTap.bind(this));
    Mojo.Event.listen(this.controller.get("toggleYouTubeShort"), Mojo.Event.propertyChange, this.handleValueChange.bind(this));
    Mojo.Event.listen(this.controller.get("titleRedditShort"), Mojo.Event.tap, this.handleTitleTap.bind(this));
    Mojo.Event.listen(this.controller.get("toggleRedditShort"), Mojo.Event.propertyChange, this.handleValueChange.bind(this));
    Mojo.Event.listen(this.controller.get("listCustomUrlType"), Mojo.Event.propertyChange, this.handleCustomTypeChange.bind(this));
    Mojo.Event.listen(this.controller.get("advancedTwisty"), Mojo.Event.tap, this.handleTwistyTap.bind(this));
    Mojo.Event.listen(this.controller.get("btnAddCustom"), Mojo.Event.tap, this.addCustomHandler.bind(this));
    Mojo.Event.listen(this.controller.get("btnRemoveCustom"), Mojo.Event.tap, this.removeCustomHandler.bind(this));
    Mojo.Event.listen(this.controller.get("testTwisty"), Mojo.Event.tap, this.handleTwistyTap.bind(this));
    Mojo.Event.listen(this.controller.get("btnTest"), Mojo.Event.tap, this.testURL.bind(this));

    //Check for updates
    if (!this.UpdateCheckDone) {
        this.UpdateCheckDone = true;
        updaterModel.CheckForUpdate("URL Assist", this.handleUpdateResponse.bind(this));
    }
};

MainAssistant.prototype.handleUpdateResponse = function(responseObj) {
    if (responseObj && responseObj.updateFound) {
        updaterModel.PromptUserForUpdate(function(response) {
            if (response)
                updaterModel.InstallUpdate();
        }.bind(this));
    }
}

MainAssistant.prototype.activate = function(event) {

    this.toggleLoaded = 0;
    this.loadToggleStates();
};

MainAssistant.prototype.loadToggleStates = function() {
    switch (this.toggleLoaded) {
        case 0:
            this.setToggleFromHandlersList("https://www.youtube.com/watch?v=VYVz2qa30G0", "com.jonandnic.metube", "toggleYouTubeLong", this.loadToggleStates);
            break;
        case 1:
            this.setToggleFromHandlersList("http://m.youtube.com/watch?v=VYVz2qa30G0", "com.jonandnic.metube", "toggleYouTubeMobile", this.loadToggleStates);
            break;
        case 2:
            this.setToggleFromHandlersList("https://youtu.be/VYVz2qa30G0", "com.jonandnic.metube", "toggleYouTubeShort", this.loadToggleStates);
            break;
        case 3:
            this.setToggleFromHandlersList("https://v.redd.it", "com.jonandnic.metube", "toggleRedditShort", this.loadToggleStates);
            break;
    }
}

MainAssistant.prototype.setToggleFromHandlersList = function(url, appId, toggleButtonId, callback) {
    Mojo.Log.info("Listing handlers for URL: " + url);
    this.appId = appId;
    this.toggleButtonId = toggleButtonId;
    this.handlerLoadedCallback = callback;
    this.launchRequest = new Mojo.Service.Request("palm://com.palm.applicationManager", {
        method: "listAllHandlersForUrl",
        parameters: {
            "url": url
        },
        onSuccess: function(responseObj) {
            Mojo.Log.info("Handler list success: " + JSON.stringify(responseObj));

            if (responseObj && responseObj.redirectHandlers) {
                var found = false;
                if (responseObj.redirectHandlers.activeHandler.appId == this.appId) {
                    found = true;
                    Mojo.Log.info("Checked handler, " + this.appId + " found!");
                }

                if (found) {
                    Mojo.Log.info("setting button " + this.toggleButtonId + " to true");
                    this.setToggleValue(this.toggleButtonId, true);
                } else {
                    Mojo.Log.info("Checked handler, " + this.appId + " not found");
                }

            } else {
                Mojo.Log.warn("Unexpected payload in system service request");
            }
            this.toggleLoaded++;
            this.handlerLoadedCallback();
        }.bind(this),
        onFailure: function(response) {
            Mojo.Log.error("Handler list failure: " + JSON.stringify(response));
            //TODO: Error dialog
            this.toggleLoaded++;
            this.handlerLoadedCallback();
        }.bind(this)
    });
}

MainAssistant.prototype.setToggleValue = function(toggleButtonId, value) {
    var thisWidgetSetup = this.controller.getWidgetSetup(toggleButtonId);
    var thisWidgetModel = thisWidgetSetup.model;
    thisWidgetModel.value = value;
    this.controller.setWidgetModel(toggleButtonId, thisWidgetModel);
    this.controller.modelChanged(thisWidgetModel);
}

//Handle menu and button bar commands
MainAssistant.prototype.handleCommand = function(event) {
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case 'do-myAbout':
                this.ShowDialogBox("URL Assist", "Use this app to configure URL Redirect handlers that can launch apps, instead of the webOS Browser.<br>Copyright 2021, Jonathan Wise. Available under an MIT License. Source code available at: https://github.com/codepoet80/webos-urlassist");
                break;
        }
    }
};

MainAssistant.prototype.handleTitleTap = function(event) {
    //Mojo.Log.info("Title tap on: " + event.srcElement.id);
    var testURL = "https://www.youtube.com/watch?v=VYVz2qa30G0";
    switch (event.srcElement.id) {
        case "titleYouTubeMobile":
            testURL = "http://m.youtube.com/watch?v=tU6V1AL5WgA";
            break;
        case "titleYouTubeShort":
            testURL = "https://youtu.be/X3Of-DItNfw";
            break;
        case "titleRedditShort":
            testURL = "https://v.redd.it/0b6pmbs3s1k61";
            break;
        default:
            break;
    }
    this.controller.get('txtTestURL').mojo.setValue(testURL);
}

MainAssistant.prototype.handleValueChange = function(event) {
    Mojo.Log.info(event.srcElement.id + " value changed to " + event.value);
    if (event.value == false) {
        this.removeUrlHandler("com.jonandnic.metube");
        //This is an all or nothing operation, so set all toggles to false
        this.setToggleValue("toggleYouTubeLong", false);
        this.setToggleValue("toggleYouTubeMobile", false);
        this.setToggleValue("toggleYouTubeShort", false);
        this.setToggleValue("toggleRedditShort", false);
    } else {
        switch (event.srcElement.id) {
            case "toggleYouTubeLong":
                this.addUrlHandler("com.jonandnic.metube", "^[^:]+://www.youtube.com/watch");
                break;
            case "toggleYouTubeMobile":
                this.addUrlHandler("com.jonandnic.metube", "^[^:]+://m.youtube.com/watch");
                break;
            case "toggleYouTubeShort":
                this.addUrlHandler("com.jonandnic.metube", "^[^:]+://youtu.be");
                break;
            case "toggleRedditShort":
                this.addUrlHandler("com.jonandnic.metube", "^[^:]+://v.redd.it");
                break;
        }
    }
}

MainAssistant.prototype.handleTwistyTap = function(event) {
    Mojo.Log.info("Twisty was: " + event.srcElement.id);
    switch (event.srcElement.id) {
        case "advancedTwistyImg":
            Mojo.Log.info("toggle custom drawer, currently: " + this.controller.get("drawerCustom").mojo.getOpenState());
            drawerOpen = this.controller.get("drawerCustom").mojo.getOpenState();
            if (!drawerOpen) {
                this.controller.get("advancedTwistyImg").src = "images/arrow-down.png";
            } else {
                this.controller.get("advancedTwistyImg").src = "images/arrow-right.png";
            }
            this.controller.get('drawerCustom').mojo.toggleState();
            break;
        case "testTwistyImg":
            Mojo.Log.info("toggle test drawer, currently: " + this.controller.get("drawerTest").mojo.getOpenState());
            drawerOpen = this.controller.get("drawerTest").mojo.getOpenState();
            if (!drawerOpen) {
                this.controller.get("testTwistyImg").src = "images/arrow-down.png";
            } else {
                this.controller.get("testTwistyImg").src = "images/arrow-right.png";
            }
            this.controller.get('drawerTest').mojo.toggleState();
            break;
    }

}

MainAssistant.prototype.handleCustomTypeChange = function(event) {
    Mojo.Log.info(event.srcElement.id + " value changed to " + event.value);
    var thisWidgetSetup = this.controller.getWidgetSetup("txtCustomUrlPattern");
    var thisWidgetModel = thisWidgetSetup.attributes;
    if (event.value == "URI") {
        thisWidgetModel.hintText = "^yourprotocol:";
        this.customType = "URI";
    } else {
        thisWidgetModel.hintText = "^[^:]+://yourserver.com";
        this.customType = "URL";
    }
    this.controller.setWidgetModel("txtCustomUrlPattern", thisWidgetModel);
    this.controller.modelChanged(thisWidgetModel);
}

MainAssistant.prototype.addCustomHandler = function(event) {
    var customUrlPattern = this.controller.get('txtCustomUrlPattern').mojo.getValue();
    var customAppId = this.controller.get('txtCustomAppid').mojo.getValue();
    if (customUrlPattern && customUrlPattern != "" && customAppId && customAppId != "" && customAppId.indexOf(".") > -1) {
        if (this.customType == "URI") {
            this.addUrlHandler(customAppId, customUrlPattern, true);
        } else {
            this.addUrlHandler(customAppId, customUrlPattern);
        }
    } else {
        Mojo.Log.warn("Invalid parameters specified. Not attempting to add Redirect Handler!");
        this.ShowDialogBox("Invalid Parameters", "Required parameter empty or invalid. Not attempting to add Redirect Handler!")
    }
}

MainAssistant.prototype.removeCustomHandler = function(event) {
    var customAppId = this.controller.get('txtCustomAppid').mojo.getValue();
    if (customAppId && customAppId != "" && customAppId.indexOf(".") > -1) {
        this.removeUrlHandler(customAppId);
    } else {
        Mojo.Log.warn("Invalid parameters specified. Not attempting to remove Redirect Handler!");
        this.ShowDialogBox("Invalid Parameters", "Required parameter empty or invalid. Not attempting to remove Redirect Handler!")
    }
}

MainAssistant.prototype.addUrlHandler = function(appId, urlPattern, schemeForm) {
    Mojo.Log.info("Installing handler for: " + urlPattern);
    if (!schemeForm)
        schemeForm = false;
    this.launchRequest = new Mojo.Service.Request("palm://com.palm.applicationManager", {
        method: "addRedirectHandler",
        parameters: {
            "appId": appId,
            "urlPattern": urlPattern,
            "schemeForm": false,
        },
        onSuccess: function(response) {
            Mojo.Log.info("Handler registration success: " + JSON.stringify(response));
            Mojo.Controller.getAppController().showBanner("URL Helper added: " + appId + ".", { source: 'notification' });
        }.bind(this),
        onFailure: function(response) {
            Mojo.Controller.getAppController().showBanner("URL Helper failed: " + appId + ".", { source: 'notification' });
            Mojo.Log.error("Handler registration failure: " + JSON.stringify(response));
        }.bind(this)
    });
}

MainAssistant.prototype.removeUrlHandler = function(appId) {
    Mojo.Log.info("Remove hanlder button pressed!");
    this.launchRequest = new Mojo.Service.Request("palm://com.palm.applicationManager", {
        method: "removeHandlersForAppId",
        parameters: {
            "appId": appId
        },
        onSuccess: function(response) {
            Mojo.Controller.getAppController().showBanner("URL Helper removed: " + appId + ".", { source: 'notification' });
            Mojo.Log.info("Handler remove success: " + JSON.stringify(response));
        }.bind(this),
        onFailure: function(response) {
            Mojo.Controller.getAppController().showBanner("URL Helper failed: " + appId + ".", { source: 'notification' });
            Mojo.Log.error("Handler list failure: " + JSON.stringify(response));
        }.bind(this)
    });
}

MainAssistant.prototype.testURL = function() {
    var testURL = this.controller.get('txtTestURL').mojo.getValue();
    if (testURL && testURL != "" && testURL.indexOf(":") > -1) {
        this.launchRequest = new Mojo.Service.Request("palm://com.palm.applicationManager", {
            method: "open",
            parameters: {
                "target": testURL,
            },
            onSuccess: function(response) {
                Mojo.Log.info("Test URL Launch Success: " + JSON.stringify(response));
            }.bind(this),
            onFailure: function(response) {
                Mojo.Controller.getAppController().showBanner(JSON.stringify(response) + ".", { source: 'notification' });
                Mojo.Log.error("Test URL Launch Failure: " + JSON.stringify(response));
            }.bind(this)
        });
    }
    //   luna: //com.palm.applicationManager/open '{ "target": "http://www.pat2pdf.org/patents/pat5463489.pdf", "subscribe": true }'
}

MainAssistant.prototype.ShowDialogBox = function(title, message, callBack) {
    var stageController = Mojo.Controller.getAppController().getActiveStageController();
    this.controller = stageController.activeScene();
    this.controller.showAlertDialog({
        onChoose: callBack,
        title: title,
        message: message,
        choices: [{ label: 'OK', value: 'OK' }],
        allowHTMLMessage: true
    });
}

MainAssistant.prototype.deactivate = function(event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
       this scene is popped or another scene is pushed on top */
};

MainAssistant.prototype.cleanup = function(event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
       a result of being popped off the scene stack */
};