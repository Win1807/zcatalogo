sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, History, JSONModel, Fragment, MessageBox) {
	"use strict";
	// variables globales

	var _vTabletPromoCyP = [];
	var vSelectPromoCyP = [];
	var vNumCatalogo = "";
	var vNombreCat = "";
	var VNumPromo = "";
	var vNombrePromo = "";
	var vTipoAccion = "";
	var vTipoAccionPangui = "";
	var vValOrigen = "";
	var vIdEstock = "";
	var vIdPlanVenQ = "";
	var vIdPlanVenD = "";
	var vchkInternet = "";
	// var vValViewCata = "";
	// var vValViewList = "";

	var vImputNomPromo = "";
	var vImputFehaPromo = "";
	var vOmitirCampa = "";
	var vOmitirPangi = "";
	var modeloCyP = "";

	var vValLimpiarNP = "";

	var vpanel0 = "";
	var vpanel1 = "";
	var vpanel2 = "";
	var vBotonGrabar = "";
	var vBotonExtender = "";

	var VfechaDesde = "";
	var VfechaHasta = ""; 

	var vGParte = "";
	var vPanelFragCYP = "";
	var vsaltarBusqueda = "";

	var vResullPangui = "";
	var bDialog = new sap.m.BusyDialog();
	var vListEsta = "";
	var vValStado = "";
	var vExistePromo = ""; //X = no, '' = si 
	var vGFechaPublicI = "";
	var vGFechaPublicF = "";
	var vUserType = "";
	var vFechaVigenciaG = "";
	var vDP1 = "";
	var vDP2 = "";
	var vSimpleExten = "";
	var vExtenderPro = "";
	var vBlockPromo = "";
	
	var vDatosOn = "";

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.ZNuevaPromo", {

		onInit: function () {
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("ZNuevaPromo").attachDisplay(null, this.onDisplay, this);

		},

		onDisplay: function () {

			var vthis = this;
			vGParte = "";
			vValStado = "01";
			vExistePromo = "";
			// Se crea el modelo DEL SERVICIO
			modeloCyP = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			modeloCyP.setUseBatch(false); // se puede desactivar el uso de batch

			// accedo a las variables  del core
			vNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo"); // numero de catalo
			vNombreCat = sap.ui.getCore().getModel("vNombreCat"); // Nombre del catalo
			VNumPromo = sap.ui.getCore().getModel("vValNumPromo"); // numero de promo 
			vTipoAccion = sap.ui.getCore().getModel("vTipoAccion"); // tipo de acción
			vValOrigen = sap.ui.getCore().getModel("vValOrigen"); // Origen del ciclo
			vGFechaPublicI = sap.ui.getCore().getModel("vGFechaPublicI"); // Fecha de publicacion Inicio Catalogo
			vGFechaPublicF = sap.ui.getCore().getModel("vGFechaPublicF"); // Fecha de publicacion Fin Catalogo
			vUserType = sap.ui.getCore().getModel("vUserType"); // tipo de usuario 
			vExtenderPro = sap.ui.getCore().getModel("vExtenderPro"); // Extender Promo 

			vGParte = sap.ui.getCore().getModel("vGParte"); // N° de parte 

			//habilita campos 
			vImputNomPromo = this.byId("NombreCat");
			vImputFehaPromo = this.byId("DRS1");
			vOmitirCampa = this.byId("chk1");
			vOmitirPangi = this.byId("chk2");
			
			vIdEstock   = this.byId("IdEstock");
			vIdPlanVenQ = this.byId("IdPlanVenQ");
			vIdPlanVenD = this.byId("IdPlanVenD");
			vchkInternet = this.byId("chkInternet");


			vpanel0 = this.byId("panel0");
			vpanel1 = this.byId("panel1");
			vpanel2 = this.byId("panel2");
			vListEsta = this.getView().byId("idListEstado");
			vDP2 = this.byId("DP2");

			vBotonGrabar = this.byId("button5");
			//vBotonExtender = this.byId("button6");

			vDP1 = this.byId("DP1");
			vSimpleExten = this.byId("SimpleExten");

			vValLimpiarNP = sap.ui.getCore().getModel("vValLimpiarNP");

			if (vValLimpiarNP === "X") {

				vthis.limpiarCampos();
				vValLimpiarNP = "";
				sap.ui.getCore().setModel(vValLimpiarNP, "vValLimpiarNP");

			}
			debugger
			if (vTipoAccion === "C") {
				vImputNomPromo.setEnabled(false);
				vImputFehaPromo.setEnabled(false);
				vOmitirCampa.setEnabled(false);
				vOmitirPangi.setEnabled(false);
				vListEsta.setEnabled(false);
				vBotonGrabar.setVisible(false);
				
				vIdEstock.setEnabled(false);   
				vIdPlanVenQ.setEnabled(false); 
				vIdPlanVenD.setEnabled(false); 
				vchkInternet.setEnabled(false);


				if (vUserType === "02") {

					if (vExtenderPro) {

						if (vExtenderPro !== "") {
							vDP2.setEnabled(true); //extender promo 
							vBotonGrabar.setVisible(true);
							
							

						} else {
							vDP2.setEnabled(false);
							
							//vBotonGrabar.setVisible(false);

						}

					} else {
						vDP2.setEnabled(false);
						vBotonGrabar.setVisible(false);
					}

				} else {
					vDP2.setEnabled(false);
				}
			} else
			/*if (vValOrigen === "Cata" && vTipoAccion !== "I") {
				vImputNomPromo.setEnabled(false);
				vImputFehaPromo.setEnabled(false);
				vOmitirCampa.setEnabled(true);
				vOmitirPangi.setEnabled(true);
				vListEsta.setEnabled(false);
				// habilita el boton MOdificar cabecera de la promocion 

				if (VNumPromo !== undefined) {
					vBotonGrabar.setVisible(true);
				} else {
					vBotonGrabar.setVisible(false);
				}

				// Cuando el registro es nuevo hereda la fecha del catalogo 
				if (vTipoAccion === "I") {
					this.AsignaFecha(vGFechaPublicI, vGFechaPublicF);
				}

			} else */
			{
				//;
				
				//modificacion 27062020
				
				if (vExtenderPro) {

						if (vExtenderPro !== "") {
							vDP2.setEnabled(true); //extender promo 
							vImputFehaPromo.setEnabled(false);
						} else {
							vDP2.setEnabled(false);
							vImputFehaPromo.setEnabled(true);

						}
				}else{
					vDP2.setEnabled(true);
					vImputFehaPromo.setEnabled(false);
				}
				
				//fin modificacion 27062020
				
				
				
				
				
				
				
				
				vImputNomPromo.setEnabled(true);
				vImputFehaPromo.setEnabled(true);
				vOmitirCampa.setEnabled(true);
				vOmitirPangi.setEnabled(true);
				vListEsta.setEnabled(true);
				
				vIdEstock.setEnabled(true);   
				vIdPlanVenQ.setEnabled(true);
				vIdPlanVenD.setEnabled(true); 
				vchkInternet.setEnabled(true);

				
				// habilita el boton MOdificar cabecera de la promocion 

				if (VNumPromo !== undefined) {
					vBotonGrabar.setVisible(true);
				} else {
					vBotonGrabar.setVisible(false);
				}

				// Cuando el registro es nuevo hereda la fecha del catalogo 
				if (vTipoAccion === "I") {
					this.AsignaFecha(vGFechaPublicI, vGFechaPublicF);
				}
			}

			var vLabelNumCatalogo = this.byId("lbNumCatalogo"),
				vLabelNumPromo = this.byId("lbNumPromo"),
				vVacio = "",
				vNumCatalogo2 = vVacio.concat(" ").concat(vNumCatalogo);
			// agrega Numero de catalogo
			vLabelNumCatalogo.setText(vNumCatalogo2);
			// agrega Numero de Promo
			vLabelNumPromo.setText(VNumPromo);

			if (vsaltarBusqueda === "") {
				vthis.BuscaCabPromo();

			} else {
				vsaltarBusqueda = "";
			}

			//lleno combo de estado 
			vthis.LlenarListEstado();
		},
		AsignaFecha: function (vFe1, vFe2) {
			var vFechaVigencia = vFe1.substr(6, 4) + "/" + vFe1.substr(3, 2) + "/" + vFe1.substr(0, 2) + " -- " + vFe2.substr(6, 4) + "/" +
				vFe2.substr(3, 2) + "/" + vFe2.substr(0, 2);

			vImputFehaPromo.setValue(vFechaVigencia);
			vFechaVigenciaG = vFechaVigencia;

		},

		LlenarListEstado: function () {
			
			
			// si el modelo esta lleno no segir
			if (vListEsta.getModel().getProperty("/ListEstadoPromo")){
				if(vListEsta.getModel().getProperty("/ListEstadoPromo").length > 0){
					return;
				}
			}

			var modelo2 = new JSONModel();

			// se asigna el modelo al Objeto
			vListEsta.setModel(modelo2);
			// se inician estructuras
			modelo2.setProperty("/ListEstadoPromo", []);

			function fSuccess(oEvent) {
				bDialog.close();
				if (oEvent.results.length > 0) {
					modelo2.setProperty("/ListEstadoPromo", oEvent.results);
				} else {
					sap.m.MessageToast.show("Listado de Estado Vacio");
				}
			}

			// Función de error
			function fError() {
				bDialog.close();
				sap.m.MessageToast.show("Error al Cargar Listado de Estado");

			}
			bDialog.open();
			// Lectura del servicio
			modeloCyP.read("/ConsultEstadoPromoSet", {
				success: fSuccess,
				error: fError
					//filters: oFilters
			});

		},
		onCambiarEsta: function (Event) {
			// para esta App solo se limita hacer cambio en el list de estado  de :
			//EN CREACION y EN APROBACION
			var item = Event.getParameters().selectedItem;
			var condiSel = item.getBindingContext().getObject();

			if (vUserType !== "01") { // valida cuado es diferente a administrador
				if (condiSel.Codstd !== "01") {
					if (condiSel.Codstd !== "02") {
						sap.m.MessageToast.show("Selección de Estado no Permitido");
						vListEsta.setSelectedKey("01");
					} else {
						// asigno al core la accion para pangui

						vValStado = condiSel.Codstd;
						sap.ui.getCore().setModel(vValStado, "vValStado");

					}

				}
			}

		},

		listadoPromoCyP: function () {

			var that = this;
			var modelo = new JSONModel();
			// se asigna el modelo a la vista
			this.getView().setModel(modelo);

			// se inician estructuras
			modelo.setProperty("/PromoCyP", []);

			function fSuccess(oEvent) {

				that._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.PromoCYP", that);
				that._Dialog.setModel(that.getView().getModel());
				// abre el fragment
				that._Dialog.open();

				modelo.setProperty("/PromoCyP", oEvent.results);
				//vPanelFragCYP.setBusy(false);

				//almaceno resultado de lista de promo CyP en tabla interna
				if (_vTabletPromoCyP.length === 0) {
					for (var i = 0; i < oEvent.results.length; i++) {
						_vTabletPromoCyP.push(oEvent.results[i]);
					}
				}

			}

			// Función de error
			function fError() {
				sap.m.MessageToast.show("Error al Cargar listado de promociones");
				vPanelFragCYP.setBusy(false);
			}

			// Lectura del servicio
			modeloCyP.read("/ListadoPromoCYPSet", {
				success: fSuccess,
				error: fError
					//filters: oFilters
			});
			// this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.PromoCYP", this);
			// this._Dialog.setModel(this.getView().getModel());
			// // abre el fragment
			// this._Dialog.open();

			//vPanelFragCYP = sap.ui.getCore().byId("idPanelFragCYP"); //Panel del Fragment del Fragment
			//vPanelFragCYP.setBusy(true);

			// //**********************************************************************************************************
			// 			var that = this
			// 				// creo modelo json para manejar los datos
			// 			var modelo = new JSONModel();
			// 			// asignar el modelo a la vista
			// 			this.getView().setModel(modelo);

			// 			// Función de éxito
			// 			function fSuccess(oEvent) {

			// 				//almaceno resultado de lista de promo CyP en tabla interna
			// 				for (var i = 0; i < oEvent.results.length; i++) {
			// 					_vTabletPromoCyP.push(oEvent.results[i]);
			// 				}

			// 				// asigno datos a la estructura Centros del modelo
			// 				modelo.setProperty("/PromoCyP", oEvent.results);
			// 				vPanelFragCYP.setBusy(false);

			// 				// asignar el modelo a la vista

			// 				//that.getView().setModel(modelo);

			// 			}

			// 			// Función de error
			// 			function fError(oEvent) {
			// 				sap.m.MessageToast.show("Error al Cargar listado de promociones");
			// 				vPanelFragCYP.setBusy(false);
			// 			}

			// 			// Lectura del servicio
			// 			modeloCyP.read("/ListadoPromoCYPSet", {
			// 				success: fSuccess,
			// 				error: fError
			// 					//filters: oFilters
			// 			});
			// ////***********************************************************************************************************
		},

		BuscaCabPromo: function () {
			var that = this;
			// creo modelo json para manejar los datos
			var modelo2 = new JSONModel();
			// asignar el modelo a la vista
			this.getView().setModel(modelo2);

			vpanel0.setBusy(true);
			vpanel1.setBlocked(true);
			vpanel2.setBlocked(true);
			// Función de éxito
			function fSuccess(oEvent) {
				debugger
				var vFechaExt = that.byId("DP2");
				var vEstadoExt = that.byId("lbNumCatalogo2");
				//llena datos de la promocion en pantalla

				// solo cuando es accion promocional
				if (vValOrigen === "Promo") {
					// Verifico si visualizo o no La seccion de Extender/Caducar promo 
					if (oEvent.EstSolExt !== "" || vExtenderPro === "X") {

						vSimpleExten.setVisible(true);

						//Fecha de extencion de la promo 
						if (oEvent.FFinNew !== "00000000") {
							vFechaExt.setValue(oEvent.FFinNew);
							vEstadoExt.setText(oEvent.EstSolTxt);

						} else {
							vFechaExt.setValue("");
							vEstadoExt.setText("En Aprobación");
						}

					} else {
						vSimpleExten.setVisible(false);
					}
				}else{
					vSimpleExten.setVisible(false);
				}

				//nombre de la promo 
				vImputNomPromo.setValue(oEvent.Nompromos);
				// fecha vigencia de a promo

				if (vTipoAccion !== "I") {
					var vFechaVigencia = oEvent.Fechadesdes.substr(0, 4) + "/" + oEvent.Fechadesdes.substr(4, 2) + "/" + oEvent.Fechadesdes.substr(6,
						2) + " -- " + oEvent.Fechahastas.substr(0, 4) + "/" + oEvent.Fechahastas.substr(4, 2) + "/" + oEvent.Fechahastas.substr(6, 2);
					vImputFehaPromo.setValue(vFechaVigencia);

					vFechaVigenciaG = vFechaVigencia;
				}
				// check de omicion pangui y promo
				if (oEvent.Omitircyps === "X") {
					vOmitirCampa.setSelected(true);
				}else{
					vOmitirCampa.setSelected(false);
				}
				if (oEvent.Omitirpanguis === "X") {
					vOmitirPangi.setSelected(true);
				}else{
					vOmitirPangi.setSelected(false);
				}
				
				// Estock
				vIdEstock = that.byId("IdEstock");
				vIdEstock.setValue(oEvent.StockDisp);
				
				//Plan de ventasQ
				vIdPlanVenQ = that.byId("IdPlanVenQ");
				vIdPlanVenQ.setValue(oEvent.PlanVtaQ);
				
				//Plan de ventas$
				vIdPlanVenD = that.byId("IdPlanVenD");
				vIdPlanVenD.setValue(oEvent.PlanVtaP);
				
				//internet
				vchkInternet = that.byId("chkInternet");
				if (oEvent.Internet === "X"){
					vchkInternet.setSelected(true);
				}else{
					vchkInternet.setSelected(false);	
				}
				
				// habilita campos de extencion
				if(oEvent.StockDisp !== "" || oEvent.PlanVtaQ !== "" || oEvent.PlanVtaP !== "" || oEvent.Internet !== ""){
					that.habilitarCampAdicio(true);
				}else{
					that.habilitarCampAdicio(false);
				}
				
				
				
				
				
				
				
				
				//asigana el estado
				debugger
				vListEsta.setSelectedKey(oEvent.Estados);

				vpanel0.setBusy(false);
				vpanel1.setBlocked(false);
				vpanel2.setBlocked(false);

			}

			// Función de error
			function fError(oEvent) {
				vpanel0.setBusy(false);
				vpanel1.setBlocked(false);
				vpanel2.setBlocked(false);
			}

			// Lectura del servicio
			debugger
			var vFilter = "/ConsultaCabPromoSet(Idcatalogo='" + vNumCatalogo +
				"',Idpromo='" + VNumPromo + "',Idparte='" + vGParte + "',Check1='C')";

			modeloCyP.read(vFilter, {
				success: fSuccess,
				error: fError
					//filters: oFilters
			});

		},

		onBack: function () {
			var vthis = this;

			// if (vValOrigen === "Cata") {
			// 	this.getOwnerComponent().getTargets().display("CatalogoMain");
			// }
			// if (vValOrigen === "Lista") {
			// 	this.getOwnerComponent().getTargets().display("ListadoPromoMain");
			// }
			vTipoAccionPangui = "";
			// asigno al core la accion para pangui
			sap.ui.getCore().setModel(vTipoAccionPangui, "vTipoAccionPangui");
			//blanque el numero de parte 
			vGParte = "";
			sap.ui.getCore().setModel(vGParte, "vGParte");
			// blanquea extender promo 
			vExtenderPro = ""; // NO
			sap.ui.getCore().setModel(vExtenderPro, "vExtenderPro");

			// blanque Fecha de vigencia 
			// vGFechaPublicI = "00.00.000";
			// vGFechaPublicF = "00.00.000";
			// sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
			// sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");
			
			
			//blaquea fecha de extención 
			debugger
			this.byId("DP2").setValue("");

			vsaltarBusqueda = "";
			this.getOwnerComponent().getTargets().display("ListadoPromoMain");

		},

		onClick: function () {

			var vthis = this;
			vImputNomPromo = this.getView().byId("NombreCat").getValue();
			vImputFehaPromo = this.getView().byId("DRS1").getValue();
			vOmitirCampa = this.byId("chk1").getSelected();
			vOmitirPangi = this.byId("chk2").getSelected();
			vValStado = vListEsta.getSelectedKey();
			//verifica que no este vacio el nombre de la promo
			if (vImputNomPromo === "") {
				sap.m.MessageToast.show("Coloque el Nombre de la Promoción");
			} else {

				// el nombre de la promocion no debe ser mayor a 40 caracteres
				if (vImputNomPromo.length > 40) {
					sap.m.MessageToast.show("Nombre de la Promoción debe contener hasta 40 Caracteres");
					return;
				}

				if (vImputFehaPromo === "" || vImputFehaPromo === "0000/00/00 -- 0000/00/00") {
					sap.m.MessageToast.show("Coloque la fecha de vigencia");
				} else {
					//da formato a la fechade vigencia(Desde - hasta ) y pasa al core 
					vthis.formatoFecha(vImputFehaPromo);

					//verifica que no este vacio la fecha de igencia de la promo 
					//asigno al core el nombre de la promocion 
					sap.ui.getCore().setModel(vImputNomPromo, "globalNomPromo");
					//asigno al core la fecha de la promocion 
					sap.ui.getCore().setModel(vImputFehaPromo, "globalFechaPromo");
					// asigno valor de omitir campaña
					sap.ui.getCore().setModel(vOmitirCampa, "globalOmitirCam");
					// asigno valor de omitir pangui
					sap.ui.getCore().setModel(vOmitirPangi, "globalOmitirPan");
					// asigno valor del estado de la promo 
					sap.ui.getCore().setModel(vValStado, "vValStado");

					this.getOwnerComponent().getTargets().display("CargaCentros");
					vsaltarBusqueda = "X";
				}
			}

		},

		formatoFecha: function (InputFecha) {

			//da formato a la fecha de vigencia 
			var VFechaFormat = InputFecha.replace(/[/\s]/g, '');

			VfechaDesde = VFechaFormat.substr(0, 8);
			VfechaHasta = VFechaFormat.substr(10, 8);

			//asigno al core la fecha Desde, Hasta
			sap.ui.getCore().setModel(VfechaDesde, "GFechaPromoVD");
			sap.ui.getCore().setModel(VfechaHasta, "GFechaPromoVH");

		},
		onCampañaPromo: function () {

			var that = this;
			if (vTipoAccion === "M" || vTipoAccion === "C") {
				// verifica que exista carteleria asociada a la promo
				var vthis = this;
				// creo modelo json para manejar los datos
				var modelo2 = new JSONModel();

				// Lectura del servicio
				var vFilter = "/ConsultaPromoCYPSet(Idcatalogo='" + vNumCatalogo +
					"',Idpromo='" + VNumPromo + "',Idparte='1',Check1='C')";

				// Función OK
				function fSuccess(oEvent) {

					if (oEvent.Pmensaje1 !== "0") {

						if (vTipoAccion === "C") {
							sap.m.MessageToast.show("No se ha cargado Carteleria a la Promoción");
							return
						}
						vExistePromo = "X";
						sap.ui.getCore().setModel(vExistePromo, "vExistePromo");
						//si esta en ""Modificar la promocion no tiene carteleria (proceder a crear nueva)
						that.listadoPromoCyP();
					} else {
						vExistePromo = "";
						sap.ui.getCore().setModel(vExistePromo, "vExistePromo");
						that.onCyP();
					}

				}

				// Función de error
				function fError(oEvent) {
					sap.m.MessageToast.show("Error al Buscar datos");

				}

				modeloCyP.read(vFilter, {
					success: fSuccess,
					error: fError
						//filters: oFilters
				});

			} else {

				this.onCyP();
			}

		},

		onCyP: function () {
			// valida de que exista N° de catalog 
			// this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.PromoCYP", this);
			// this._Dialog.setModel(this.getView().getModel());
			// // abre el fragment
			// this._Dialog.open();

			// vPanelFragCYP = sap.ui.getCore().byId("idPanelFragCYP"); //Panel del Fragment del Fragment
			// vPanelFragCYP.setBusy(true);

			// this.listadoPromoCyP();

			if (vNumCatalogo === "") {
				sap.m.MessageToast.show("Asigne un N° de Catalogo");
			} else {
				// valida de que exista N° de promoción 
				if (VNumPromo === "" || VNumPromo === undefined) {
					sap.m.MessageToast.show("Asigne un N° de Promoción");
				} else {
					if (vTipoAccion === "I") {
						// asignar el modelo a la vista al fragment

						//vPanelFragCYP = sap.ui.getCore().byId("idPanelFragCYP"); //Panel del Fragment del Fragment
						//vPanelFragCYP.setBusy(true);

						this.listadoPromoCyP();

					} else {

						vImputFehaPromo = this.byId("DRS1");
						var VFechaFormat = vImputFehaPromo.getValue().replace(/[/\s]/g, '');
						VfechaDesde = VFechaFormat.substr(0, 8);
						//asigno al core la fecha Desde, Hasta
						sap.ui.getCore().setModel(VfechaDesde, "VfechaDesde");

						this.getOwnerComponent().getTargets().display("CargaCarteleria");

					}

				}

			}

		},
		onClose: function () {

			this._Dialog.destroy(true);
			this._Dialog.close();

		},
		onSelectPromo: function (oEvent) {

			//tomo lo seleccionado en el Lsit de promo

			var vSelecPromo = sap.ui.getCore().byId("idSelectCyP").mProperties.selectedKey //id del listado de promo     

			function BuscarRegistro(Registro) {
				return Registro.Tipopromoc === vSelecPromo
			}

			vSelectPromoCyP = _vTabletPromoCyP.find(BuscarRegistro);
			// pasa valor a variable global 
			sap.ui.getCore().setModel(vSelectPromoCyP, "vGlobalPromoCyP");

			//selecciona la fecha de inicio de la promocion 

			vImputFehaPromo = this.byId("DRS1");
			var VFechaFormat = vImputFehaPromo.getValue().replace(/[/\s]/g, '');
			VfechaDesde = VFechaFormat.substr(0, 8);
			//asigno al core la fecha Desde, Hasta ss
			sap.ui.getCore().setModel(VfechaDesde, "VfechaDesde");

			this._Dialog.destroy(true);
			// vuelve a la pantalla de carteleria
			this.getOwnerComponent().getTargets().display("CargaCarteleria");
			vsaltarBusqueda = "X";
		},
		limpiarCampos: function () {
			//nombre de la promo 

			vImputNomPromo.setValue("");
			vImputFehaPromo.setValue("");
			vOmitirCampa.setSelected(false);
			vOmitirPangi.setSelected(false);
			vListEsta.setSelectedKey("01");
			
			vIdEstock.setValue("");
			vIdPlanVenQ.setValue("");
			vIdPlanVenD.setValue(""); 
			vchkInternet.setSelected(false);


		},
		onGrabarCabecera: function () {
			// graba cabecera de la promo
			debugger

			var vthis = this;
			var vValChk1 = "";
			var vValChk2 = "";
			var vGuardarPromo = "";
			

			vImputNomPromo = vthis.getView().byId("NombreCat").getValue();
			vImputFehaPromo = vthis.getView().byId("DRS1").getValue();
			vOmitirCampa = vthis.byId("chk1").getSelected();
			vOmitirPangi = vthis.byId("chk2").getSelected();
			vValStado = vListEsta.getSelectedKey();
			
			 vIdEstock = this.byId("IdEstock").getValue();
			 vIdPlanVenQ = this.byId("IdPlanVenQ").getValue();
			 vIdPlanVenD = this.byId("IdPlanVenD").getValue();
			
			if (this.byId("chkInternet").getSelected() === true){
				
				 vchkInternet = "X";
			}else{
				vchkInternet = "";
			}
			
			// si estan oculto los campos de campos adicionales, blanquean los campos relacionados
			 if (this.byId("IdEstock").getVisible === false){
			 	vIdEstock = "";
			 	vIdPlanVenQ = "";
			 	vIdPlanVenD = "";
			 	vchkInternet = "";
			 }
			
			
			
			//solo exteder Fecha // proximo a caducar
			//valida que la fecha de extencion sea mayor a la fecha  fin de la promo 
			debugger
			var vFechaExt = this.byId("DP2").getValue().replace(/[/\s]/g, '');
			var VFechaFormat = vImputFehaPromo.replace(/[/\s]/g, '');
			var VfechaHasta1 = VFechaFormat.substr(10, 8);
			if(vFechaExt){
				
				if (vFechaExt <= VfechaHasta1){
				sap.m.MessageToast.show("Solo es posible Extender la Promo");	
					return;
				}
				
				
			} 
			

			//extiende Promo si es un PM
			if (vValOrigen === "Promo") {
				if (vTipoAccion === "C" && vUserType === "02") {
					this.onGrabarExtencion();
					return;
				}
			}
			//verifica que no este vacio el nombre de la promo
			if (vImputNomPromo === "") {
				sap.m.MessageToast.show("Coloque el Nombre de la Promoción");
			} else {

				// el nombre de la promocion no debe ser mayor a 40 caracteres
				if (vImputNomPromo.length > 40) {
					sap.m.MessageToast.show("Nombre de la Promoción debe contener hasta 40 Caracteres");
					return;
				}

				if (vImputFehaPromo === "") {
					sap.m.MessageToast.show("Coloque la fecha de vigencia");
				} else {
					//da formato a la fechade vigencia(Desde - hasta ) y pasa al core 
					this.formatoFecha(vImputFehaPromo);
					//verifica que no este vacio la fecha de igencia de la promo 
					//asigno al core el nombre de la promocion 
					sap.ui.getCore().setModel(vImputNomPromo, "globalNomPromo");
					//asigno al core la fecha de la promocion 
					sap.ui.getCore().setModel(vImputFehaPromo, "globalFechaPromo");
					// asigno valor de omitir campaña
					sap.ui.getCore().setModel(vOmitirCampa, "globalOmitirCam");
					// asigno valor de omitir pangui
					sap.ui.getCore().setModel(vOmitirPangi, "globalOmitirPan");

					// valores de los check (Cyp y Campaña)
					if (vOmitirCampa === true) {
						vValChk1 = "X";
					} else {
						vValChk1 = "";
					}

					if (vOmitirPangi === true) {
						vValChk2 = "X";
					} else {
						vValChk2 = "";
					}

					var ofilterCab = {
						"Idcatalogo": vNumCatalogo,
						"Check1": "M",
						"Idpromo": VNumPromo,
						"Idparte": vGParte,
						"Nompromo": vImputNomPromo,
						"Omitircyp": vValChk1,
						"Omitirpangui": vValChk2,
						"Fechadesde": VfechaDesde,
						"Fechahasta": VfechaHasta,
						"Estado": "",
						"Pmensaje1": "",
						"Pmensaje2": "",
						"Idcatalogos": "",
						"Idpromos": "",
						"Idpartes": vGParte,
						"Nompromos": "",
						"Omitircyps": "",
						"Omitirpanguis": "",
						"Fechadesdes": "",
						"Fechahastas": "",
						"Fechacreas": "",
						"Horacreas": "",
						"Estados": vValStado,
						"StockDisp": vIdEstock ,
						"PlanVtaQ": vIdPlanVenQ,
						"PlanVtaP": vIdPlanVenD,
						"Internet": vchkInternet

					};

					// Función de éxito
					function fSuccess1(oEvent) {
						vpanel0.setBusy(false);
						vpanel1.setBlocked(false);
						vpanel2.setBlocked(false);

						// solo cuando es accion promocional 
						if (vValOrigen === "Promo") {
							//verifica que exista modificacion en la fecha de Extencion 
							var vFechaExt = vthis.byId("DP2")
							if (vFechaExt) {
								if (vFechaExt.getValue() !== "") {
									// si existe valor  envia a guardar fecha 
									vthis.onGrabarExtencion();
								} else {
									sap.m.MessageToast.show("Registro Guardado");
								}

							} else {

								sap.m.MessageToast.show("Registro Guardado");

							}
						} else {
							sap.m.MessageToast.show("Registro Guardado");
						}

					}

					function fError1(oEvent) {

						vpanel0.setBusy(false);
						vpanel1.setBlocked(false);
						vpanel2.setBlocked(false);
						sap.m.MessageToast.show("Error al grabar Data");

					}

					// consulta centros
					debugger
					modeloCyP.create("/GraConCabeceraPromoSet", ofilterCab, {
						success: fSuccess1,
						error: fError1
					});
					vpanel0.setBusy(true);
					vpanel1.setBlocked(true);
					vpanel2.setBlocked(true);

				}
			}

		},
		onPangui: function () {

			var that = this;
			var oEntrada = {
				"Check1": "C",
				"IdCatalogo": vNumCatalogo,
				"IdPromo": VNumPromo,
				"IdParte": vGParte,
				"PanguiDetpanSet": [],
				"PanguiDetsalSet": []
			};
			vImputNomPromo = this.getView().byId("NombreCat").getValue();
			vImputFehaPromo = this.getView().byId("DRS1").getValue();

			if (VNumPromo === "" || VNumPromo === undefined) {
				sap.m.MessageToast.show("Asigne un N° de Promoción");
			} else {

				if (vImputNomPromo === "") {
					sap.m.MessageToast.show("Coloque el Nombre de la Promoción");
				} else {

					vTipoAccionPangui = sap.ui.getCore().getModel("vTipoAccionPangui");
					if (vTipoAccionPangui === undefined || vTipoAccionPangui === "") {
						vTipoAccionPangui = "I";
					}

					if (vTipoAccion === "I" && vTipoAccionPangui === "I") {

						// asigno al core la accion para pangui
						sap.ui.getCore().setModel(vTipoAccionPangui, "vTipoAccionPangui");
						//asigno al core el nombre de la promo
						sap.ui.getCore().setModel(vImputNomPromo, "vImputNomPromo");

						this.getOwnerComponent().getTargets().display("Pangui");
						vsaltarBusqueda = "X";
					} else {

						if (vImputFehaPromo === "") {
							sap.m.MessageToast.show("Coloque la fecha de vigencia");
						} else {
							// verifica si existe asociado promocion pangui 

							function fSuccess(oEvent) {
								bDialog.close();

								if (vTipoAccion === "C") {
									if (oEvent.Pmensaje1 !== "0") {
										sap.m.MessageToast.show(oEvent.Pmensaje2);
										return;
									}
									vTipoAccionPangui = "M"; //OJO
								}

								if (vTipoAccion === "M") {
									if (oEvent.Pmensaje1 !== "0") {
										vTipoAccionPangui = "I";
									} else {
										vTipoAccionPangui = "M";
									}

								}

								// asigno al core la accion para pangui
								sap.ui.getCore().setModel(vTipoAccionPangui, "vTipoAccionPangui");

								//asigno al core el nombre de la promo
								sap.ui.getCore().setModel(vImputNomPromo, "vImputNomPromo");
								// asigno al core el resultado de Pangui

								vResullPangui = oEvent;
								sap.ui.getCore().setModel(vResullPangui, "vResullPangui");

								that.getOwnerComponent().getTargets().display("Pangui");
								vsaltarBusqueda = "X";

							}

							function fError(oEvent) {
								bDialog.close();
								sap.m.MessageToast.show("Error al buscar Data");

							}

							bDialog.open();
							modeloCyP.create("/PanguiSet", oEntrada, {
								success: fSuccess,
								error: fError
							});

						}
					}
					//aqui
				}
			}
		},
		handleChange: function (Event) {

			var vTextMesg = "";

			// valida modificación de rango de fecha y lo compara con la fecha del catalogo o acción promocional 
			var vfehaII = Event.getParameters().value.substr(0, 10).replace(/[/.]/g, "");
			var vfehaIF = Event.getParameters().value.substr(14, 10).replace(/[/.]/g, "");

			var vfechaHeadI = vGFechaPublicI.substr(6, 4) + vGFechaPublicI.substr(3, 2) + vGFechaPublicI.substr(0, 2);
			var vfechaHeadF = vGFechaPublicF.substr(6, 4) + vGFechaPublicF.substr(3, 2) + vGFechaPublicF.substr(0, 2);

			var vFmsgI = vGFechaPublicI.substr(6, 4) + "/" + vGFechaPublicI.substr(3, 2) + "/" + vGFechaPublicI.substr(0, 2);
			var vFmsgF = vGFechaPublicF.substr(6, 4) + "/" + vGFechaPublicF.substr(3, 2) + "/" + vGFechaPublicF.substr(0, 2);

			if (vfehaII < vfechaHeadI) {
				//	sap.m.MessageToast.show("Rango de fecha no puede ser Menor a la Indicada en Acción Promocional/Catalogo");
				vTextMesg = "Fecha ingresada debe de estar entre: " + vFmsgI + "--" + vFmsgF + " Según Acción Promocional o Catálogo";
				vImputFehaPromo.setValue(vFechaVigenciaG);

			}

			if (vfehaIF > vfechaHeadF) {
				vTextMesg = "Fecha ingresada debe de estar entre: " + vFmsgI + "--" + vFmsgF + " Según Acción Promocional o Catálogo";
				vImputFehaPromo.setValue(vFechaVigenciaG);

			}

			if (vTextMesg !== "") {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.warning(
					vTextMesg, {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);

			}

		},

		onHabiltarExt: function (oEvent) {
			vValStado = vListEsta.getSelectedKey();
			if (vValStado > "02" && vValStado < "08") {

				if (oEvent.getParameters().pressed === true) {
					vDP1.setVisible(true);
				} else {
					vDP1.setVisible(false);
				}

			} else {

				sap.m.MessageToast.show("Se modifica fecha entre los estado APROBADO y INSTALADO");
			}

		},

		onGrabarExtencion: function () {
			// grabar extencion/caducacion
			var vAccion = "";
			var vFechaExt = this.byId("DP2").getValue();
			debugger
			if (vFechaExt !== "") {
				var vIFehaPromo = this.byId("DRS1");
				var VFechaFormat = vIFehaPromo.getValue();
				var vLastFechaPromo = VFechaFormat.substr(14)

				//verifica si es una Extencion o coducacion
				if (vFechaExt > vLastFechaPromo) {
					vAccion = "EX";

				} else {
					vAccion = "CA";

				}

				var ofilterCab = {
					Accion: vAccion,
					FecFinNew: vFechaExt,
					IdCatalogo: vNumCatalogo,
					IdParte: vGParte,
					IdPromo: VNumPromo,
					Usuariotp: "02",
					//Usuariotp: vUserType,
					Pmensaje1: "",
					Pmensaje2: ""

				};

				// Función de éxito
				function fSuccess1(oEvent) {
					if (oEvent.Pmensaje1 === "0") {
						sap.m.MessageToast.show("Registro Guardado");
					} else {
						sap.m.MessageToast.show(oEvent.Pmensaje2);
					}
				}

				function fError1(oEvent) {
					sap.m.MessageToast.show("Error al grabar Data");

				}
				// consulta centros
				debugger
				modeloCyP.create("/ExtenderFechaPromoSet", ofilterCab, {
					success: fSuccess1,
					error: fError1
				});

			}

		},
		
			// da formato  a los campos de moneda
		onFormatoPrecio: function (inputp) {

			//var num = inputp.getSource().getValue().replace(/\./g, '');
			var num = inputp.replace(/\./g, '');
			//elimina el 0 delante 

			if (!isNaN(num)) {
				//elimina el 0 delante 
				if (num.length === 1 && num === "0") {
					num = num.replace(/^[\'0']/, '');
				} else {

					num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
					num = num.split('').reverse().join('').replace(/^[\.]/, '');
					//inputp.value = num;

				}
				//inputp.getSource().setValue(num);
				return num;

			}
		},

		onFormat: function (input) {

			var num = input.getSource().getValue();
			num = this.onFormatoPrecio(num);
			input.getSource().setValue(num);

		},
		onAdicional: function(){
			debugger
			if (vIdEstock.getVisible() === true ){
				this.habilitarCampAdicio(false);
			}else{
				this.habilitarCampAdicio(true);
			}
			
			
		},
		habilitarCampAdicio: function(truefalse){
			vIdEstock.setVisible(truefalse); 
			vIdPlanVenQ.setVisible(truefalse);  
			vIdPlanVenD.setVisible(truefalse);  
			vchkInternet.setVisible(truefalse); 

			
		}
		

	});

});