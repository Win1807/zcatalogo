/*global QUnit*/

sap.ui.define([
	"ZCatalogoMesa/zcatalogo/controller/CatalogoMain.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CatalogoMain Controller");

	QUnit.test("I should test the CatalogoMain controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});