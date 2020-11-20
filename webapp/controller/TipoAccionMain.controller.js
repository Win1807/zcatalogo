sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var vValOrigen = ""; //Tipo de origen para inicion de la aplicaion (AccionPromo / Catalogo )
	var bDialog = new sap.m.BusyDialog();
	var vtile1 = "";
	var vtile0 = "";
	var vUserType = "";

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.TipoAccionMain", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZCatalogoMesa.zcatalogo.view.TipoAccionMain
		 */
		onInit: function () {
			//verifica el usuario  00 = no tiene autorización , 01=administrador, 02=Usuario 

			vtile1 = this.byId("tile1");
			vtile0 = this.byId("tile0");

			var modelo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");

			// Función OK
			function fSuccess(oEvent) {

				bDialog.close();
				if (oEvent.Usuariotp === "00") {
					sap.m.MessageToast.show("Usuario no tiene Acceso a la App");
					vtile1.setBlocked(true);
					vtile0.setBlocked(true);
				}
				vUserType = oEvent.Usuariotp;

				//asigno a variable al core
				sap.ui.getCore().setModel(vUserType, "vUserType"); //Tipo de usuario

			}
			// Función de error
			function fError(oEvent) {

				bDialog.close();
				sap.m.MessageToast.show("Error al Comprobar Usuario");
			}
			bDialog.open();

			modelo.read("/AuthCheckCatSet(Usuario='')", {
				success: fSuccess,
				error: fError
			});

		},
		onCatalogo: function () {
			vValOrigen = "Cata";
			//asigno a variable al core
			sap.ui.getCore().setModel(vValOrigen, "vValOrigen"); //origen de la aplicacón 
			this.getOwnerComponent().getTargets().display("CatalogoMain");

		},

		onAccion: function () {
			vValOrigen = "Promo";
			//asigno a variable al core
			sap.ui.getCore().setModel(vValOrigen, "vValOrigen"); //origen de la aplicacón 
			this.getOwnerComponent().getTargets().display("ListadoPromoMain");

		}

		//	onExit: function() {
		//
		//	}

	});

});