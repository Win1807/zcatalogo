/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZCatalogoMesa/zcatalogo/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});