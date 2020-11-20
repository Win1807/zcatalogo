sap.ui.define([
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (jQuery, MessageToast, Fragment, Controller, Log, JSONModel, Spreadsheet, Filter, FilterOperator) {
	"use strict";
	var Modelo = "";
	var vList1 = "";
	var vTabPrecioZona = new JSONModel({
		DATA: []
	});
	var vTab1 = "";
	var vTdcat = [];
	var vToolbarMaster = "";

	var vTotalRegPrecios = [];

	var vValNumCatalogo = "";
	var vSkuSelect = "";
	var vZonaCentro = "";

	var vGuardar = "";
	var vfileUploader = "";
	var vChkPrecios = "";
	var bDialog = new sap.m.BusyDialog();
	var vGprecioViFR = ""; //factor de rendimiento  variable 
	var vIdMasterAux = "";

	var vValoresPrecio = [];
	var vTabFR = [];

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.CargaPrecios", {

		onAfterRendering: function () {
			var oSplitCont = this.getSplitContObj(),
				ref = oSplitCont.getDomRef() && oSplitCont.getDomRef().parentNode;
			// set all parent elements to 100% height, this should be done by app developer, but just in case
			if (ref && !ref._sapUI5HeightFixed) {
				ref._sapUI5HeightFixed = true;
				while (ref && ref !== document.documentElement) {
					var $ref = jQuery(ref);
					if ($ref.attr("data-sap-ui-root-content")) { // Shell as parent does this already
						break;
					}
					if (!ref.style.height) {
						ref.style.height = "100%";
					}
					ref = ref.parentNode;
				}
			}
		},
		onInit: function () {
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CargaPrecios").attachDisplay(null, this.onDisplay, this);

		},
		onDisplay: function () {

			var that = this;
			vList1 = this.getView().byId("list1");
			vTab1 = this.byId("table1");
			vList1.setBusy(true);
			vToolbarMaster = this.byId("idToolbarMaster");
			vToolbarMaster.setBlocked(true);
			vChkPrecios = this.byId("idChkPrecios");
			vIdMasterAux = "";
			vValoresPrecio = [];
			vTabFR = [];

			vGuardar = this.getView().byId("idGuardar");
			vfileUploader = this.getView().byId("fileUploader");

			Modelo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");

			vValNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");

			var oEntrada = {
				"Cata": vValNumCatalogo,
				"Parte": "1",
				"Despl": "",
				"Check": "C",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"CosulSkuTcvigSet": [],
				"CosulSkuTdcatSet": [],
				"CosulSkuTpvigSet": []
			};

			function fSuccess(oEvent) {

				//Habilita o no Botones de accion 
				if (oEvent.Pprovenc === "X") {
					vGuardar.setBlocked(true);
					vfileUploader.setBlocked(true);
				} else {
					vGuardar.setBlocked(false);
					vfileUploader.setBlocked(false);
				}

				if (oEvent.CosulSkuTpvigSet !== null) {

					var ListSku = new JSONModel({
						DATA: []
					});

					vTotalRegPrecios = oEvent.CosulSkuTpvigSet["results"];
					// elimina el espacio en blanco en los precios 
					for (var i = 0; i < vTotalRegPrecios.length; i++) {
						vTotalRegPrecios[i].Preciovig = vTotalRegPrecios[i].Preciovig.replace(/\s/g, '');
						//da formato de salida
						vTotalRegPrecios[i].Preciovig = that.onFormatoPrecio(vTotalRegPrecios[i].Preciovig);

						vTotalRegPrecios[i].Precvigpro = vTotalRegPrecios[i].Precvigpro.replace(/\s/g, '');
						//da formato de salida
						vTotalRegPrecios[i].Precvigpro = that.onFormatoPrecio(vTotalRegPrecios[i].Precvigpro);

						vTotalRegPrecios[i].Precpropro = vTotalRegPrecios[i].Precpropro.replace(/\s/g, '');
						//da formato de salida
						vTotalRegPrecios[i].Precpropro = that.onFormatoPrecio(vTotalRegPrecios[i].Precpropro);

						vTotalRegPrecios[i].Promoprecio = vTotalRegPrecios[i].Promoprecio.replace(/\s/g, '');
						//da formato de salida
						vTotalRegPrecios[i].Promoprecio = that.onFormatoPrecio(vTotalRegPrecios[i].Promoprecio);

						vTotalRegPrecios[i].Promotarjet = vTotalRegPrecios[i].Promotarjet.replace(/\s/g, '');

						vTotalRegPrecios[i].Inhal = vTotalRegPrecios[i].Inhal.replace(/\s/g, '');

						vTotalRegPrecios[i].Vpreh = vTotalRegPrecios[i].Vpreh.replace(/\s/g, '');

						vTotalRegPrecios[i].Redimiento = vTotalRegPrecios[i].Redimiento.replace(/\s/g, '');

						vTotalRegPrecios[i].Ppum = vTotalRegPrecios[i].Ppum.replace(/\s/g, '');
						//da formato de salida
						vTotalRegPrecios[i].Ppum = that.onFormatoPrecio(vTotalRegPrecios[i].Ppum);

						//almacena arreglo para FR 
						if (vTotalRegPrecios[i].Ppum !== "000") {
							var lineFR = {
								Idcatalogo: vTotalRegPrecios[i].Idcatalogo,
								Idparte: vTotalRegPrecios[i].Idparte,
								Idposnr: vTotalRegPrecios[i].Idposnr,
								Zona: vTotalRegPrecios[i].Zona,
								Matnr: vTotalRegPrecios[i].Matnr,
								Preciovig: vTotalRegPrecios[i].Preciovig,
								Redimiento: vTotalRegPrecios[i].Redimiento
							};
							vTabFR.push(lineFR);

						}

					}

					//Optiene en memoria los resultado de la tabla CosulSkuTdcatSet
					vTdcat = oEvent.CosulSkuTdcatSet.results;

					var SKU = {};
					var TabDisplay = [];

					for (var j = 0; j < oEvent.CosulSkuTdcatSet.results.length; j++) {

						SKU = {
							IdSku: oEvent.CosulSkuTdcatSet.results[j].Matnr,
							NomSku: oEvent.CosulSkuTdcatSet.results[j].Maktx,
							Status: "",
							Idposnr: oEvent.CosulSkuTdcatSet.results[j].Idposnr,
							Index: j
						};

						// agreta estado 
						if (oEvent.CosulSkuTdcatSet.results[j].Estado === "S") {
							SKU.Status = "sap-icon://sys-enter";
						}

						TabDisplay.push(SKU);
					}

					ListSku.setProperty("/DATA", TabDisplay);

					// almecena tabla de precios 
					vTabPrecioZona = oEvent.CosulSkuTpvigSet["results"];

					// asignar el modelo a la vista
					that.getView().setModel(ListSku, "ListSku");

					// asigna tabla de valores de precio al core 
					sap.ui.getCore().setModel(ListSku, "ListSku");
					vList1.setBusy(false);
					vToolbarMaster.setBlocked(false)

					//that.getRouter().getRoute("master").attachPatternMatched(that._onMasterMatched, this);
					//that.getRouter().attachBypassed(this.onBypassed, this);
				} else {
					sap.m.MessageToast.show("Sku sin Precios Vigente");
					vList1.setBusy(false);
				}

			}

			function fError(oEvent) {
				vList1.setBusy(false);
				vToolbarMaster.setBlocked(false)
				sap.m.MessageToast.show("Error al grabar Data");

			}

			Modelo.create("/CosulSkuSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

		},

		onPressNavToDetail: function () {

			this.getSplitContObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {

			this.getSplitContObj().backDetail();
		},

		onPressMasterBack: function () {

			this.getSplitContObj().backMaster();
		},

		onPressGoToMaster: function () {

			this.getSplitContObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {

			var vRegisterPrice = {
				Idcatalogo: vValNumCatalogo,
				Idparte: "",
				Idposnr: "",
				Matnr: "",
				Moneda: "",
				Preciovig: "",
				Precpropro: "",
				Precvigpro: "",
				Promoprecio: "",
				Promotarjet: "",
				Zona: "",
				index: "",
				Status: "",
				Fr: "", //factor de rendimiento
				PreciovigAux: ""
			};
			var VTabPrecioSelec = [];

			var model = new JSONModel({
				DATA: []
			});

			vSkuSelect = oEvent.getParameter("listItem").getTitle();
			//var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			var sToPageId = "1";
			this.getSplitContObj().toDetail(this.createId(sToPageId));
			//llena tabla del detail 
			if (vTotalRegPrecios.length > 0) {

				var vPosnr = oEvent.getSource().getBindingInfo("items").binding.getModel().getObject(oEvent.getSource()._aSelectedPaths[0]).Idposnr;

				var vIndex = oEvent.getSource().getBindingInfo("items").binding.getModel().getObject(oEvent.getSource()._aSelectedPaths[0]).Index;

				for (var j = 0; j < vTotalRegPrecios.length; j++) {
					if (vSkuSelect === vTotalRegPrecios[j].Matnr && vPosnr === vTotalRegPrecios[j].Idposnr) {

						//vRegisterPrice.Preciovig = "";
						vRegisterPrice = vTotalRegPrecios[j];

						// Marca Check de confirmacion de precios
						if (vTotalRegPrecios[j].Estado === "X") {
							vChkPrecios.setSelected(true);
						} else {
							vChkPrecios.setSelected(false);
						}

						//	vRegisterPrice.Preciovig = parseInt(vTotalRegPrecios[j].Preciovig, 10) // convierte String a Numerico
						vRegisterPrice.Preciovig = vTotalRegPrecios[j].Preciovig;
						if (vRegisterPrice.Preciovig === "0" || isNaN(vRegisterPrice.Preciovig.replace(/[.,]/g, "")) === true) {
							vRegisterPrice.Preciovig = vRegisterPrice.Preciovig.toString();
							vRegisterPrice.Preciovig = "";
						}

						//	vRegisterPrice.Precpropro = parseInt(vTotalRegPrecios[j].Precpropro, 10);
						vRegisterPrice.Precpropro = vTotalRegPrecios[j].Precpropro;

						if (vRegisterPrice.Precpropro === "0" || isNaN(vRegisterPrice.Precpropro.replace(/[.,]/g, "")) === true) {
							vRegisterPrice.Precpropro = vRegisterPrice.Precpropro.toString();
							vRegisterPrice.Precpropro = "";
						}

						//vRegisterPrice.Precvigpro = parseInt(vTotalRegPrecios[j].Precvigpro, 10);
						vRegisterPrice.Precvigpro = vTotalRegPrecios[j].Precvigpro;
						if (vRegisterPrice.Precvigpro === "0" || isNaN(vRegisterPrice.Precvigpro.replace(/[.,]/g, "")) === true) {
							vRegisterPrice.Precvigpro = vRegisterPrice.Precvigpro.toString();
							vRegisterPrice.Precvigpro = "";
						}

						//vRegisterPrice.Promoprecio = parseInt(vTotalRegPrecios[j].Promoprecio, 10);
						vRegisterPrice.Promoprecio = vTotalRegPrecios[j].Promoprecio;
						if (vRegisterPrice.Promoprecio === "0" || isNaN(vRegisterPrice.Promoprecio.replace(/[.,]/g, "")) === true) {
							vRegisterPrice.Promoprecio = vRegisterPrice.Promoprecio.toString();
							vRegisterPrice.Promoprecio = "";
						}

						if (vRegisterPrice.Promotarjet === "0.00" || vRegisterPrice.Promotarjet === "0") {
							vRegisterPrice.Promotarjet = "";
						}

						if (vRegisterPrice.Ppum !== "000") {

							if (!vValoresPrecio[vIndex]) {

								vValoresPrecio[vIndex] = {
									Indice: vIndex,
									valprice: vRegisterPrice.Preciovig
								}

							}

							// if (vIdMasterAux !== vIndex) {
							// 	vGprecioViFR = vRegisterPrice.Preciovig;

							// 	console.log("LINEA 275 " + vGprecioViFR);

							// 	vIdMasterAux = vIndex;
							// } 

							vRegisterPrice.Preciovig = vRegisterPrice.Ppum;
							vRegisterPrice.Fr = "FR";

						} else {
							vGprecioViFR = "";
						}

						vRegisterPrice.index = j;
						VTabPrecioSelec.push(vRegisterPrice);
						//VTabPrecioSelec.push(vTotalRegPrecios);

					}

				}

				if (VTabPrecioSelec.length > 0) {

					// this.getView().byId("table1").setModel(VTabPrecioSelec, "VTab");
					model.setProperty("/DATA", VTabPrecioSelec);
					//model.setData(VTabPrecioSelec, "VTab")
					this.getView().byId("table1").setModel(model, "VTab");

					// Devuelvo el cambio cuand si son factor de Rendimiento

					// for (var j = 0; j < VTabPrecioSelec.length; j++) {
					// 	if (VTabPrecioSelec[j].Ppum !== "000"){
					// 		VTabPrecioSelec[j].Preciovig = VTabPrecioSelec[j].PreciovigAux;

					// 	}

					// }

				}

			}

		},

		onPressModeBtn: function (oEvent) {

			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitContObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {
				duration: 5000
			});
		},

		getSplitContObj: function () {
			var result = this.byId("SplitContDemo");
			if (!result) {
				Log.error("SplitApp object can't be found");
			}
			return result;
		},
		onBack: function () {
			var model = new JSONModel({
				DATA: []
			});
			//blanque tablas
			model.setProperty("/DATA", []);
			this.getView().byId("table1").setModel(model, "VTab");

			this.getOwnerComponent().getTargets().display("CargaSKU2");

		},
		onGuardar: function (oEvent) {
			var that = this;

			var vInput = {
				Cata: vValNumCatalogo,
				Parte: "",
				Pmensaje1: "",
				Pmensaje2: "",
				GrabarPreciosTdcatSet: [],
				GrabarPreciosTeprecSet: [],
				GrabarPreciosTsprecSet: []
			};

			var vTdcatIn = {
				Idcatalogo: "",
				Idparte: "",
				Idposnr: "",
				Matnr: "",
				Vrkme: "",
				Matkl: ""
			};

			var vTabContenido = [];

			//Extrae contenido de la tabla 
			//vTabContenido.push(vTab1.getModel("VTab").getData())
			vTabContenido = vTab1.getModel("VTab").getData().DATA;

			// llena tabla de precios
			debugger
			if (vTabContenido.length > 0) {

				var vChek = ""
				if (vChkPrecios.getSelected() === true) {
					vChek = "X";
				} else {
					vChek = "";
				}

				for (var j = 0; j < vTabContenido.length; j++) {

					var vTeprec = {
						Idcatalogo: vValNumCatalogo,
						Idparte: vTabContenido[j].Idparte,
						Idposnr: vTabContenido[j].Idposnr,
						Matnr: vTabContenido[j].Matnr,
						Zona: vTabContenido[j].Zona,
						Preciovig: vTabContenido[j].Preciovig.toString().replace(/[.,]/g, ""),
						Moneda: vTabContenido[j].Moneda,
						Precvigpro: vTabContenido[j].Precvigpro.toString().replace(/[.,]/g, ""),
						Precpropro: vTabContenido[j].Precpropro.toString().replace(/[.,]/g, ""),
						Promoprecio: vTabContenido[j].Promoprecio.toString().replace(/[.,]/g, ""),
						Promotarjet: vTabContenido[j].Promotarjet,
						Estado: vChek,
						Inhal: vTabContenido[j].Inhal,
						Vpreh: vTabContenido[j].Vpreh,
						Redimiento: vTabContenido[j].Redimiento,
						Ppum: vTabContenido[j].Ppum.toString().replace(/[.,]/g, ""),
						Cantidad: vTabContenido[j].Cantidad
					};

					if (vTabContenido[j].Precvigpro === "0.00" || vTabContenido[j].Precvigpro === "0" ||
						isNaN(vTabContenido[j].Precvigpro.replace(/[.,]/g, "")) === true) {
						vTeprec.Precvigpro = "";
					}

					if (vTabContenido[j].Precpropro === "0.00" || vTabContenido[j].Precpropro === "0" ||
						isNaN(vTabContenido[j].Precpropro.replace(/[.,]/g, "")) === true) {
						vTeprec.Precpropro = "";
					}

					if (vTabContenido[j].Promoprecio === "0.00" || vTabContenido[j].Promoprecio === "0" ||
						isNaN(vTabContenido[j].Promoprecio.replace(/[.,]/g, "")) === true) {
						vTeprec.Promoprecio = "";
					}

					if (vTabContenido[j].Promotarjet === "0.00" || vTabContenido[j].Promotarjet === "0" ||
						isNaN(vTabContenido[j].Promotarjet.replace(/[.,]/g, "")) === true) {
						vTeprec.Promotarjet = "";
					}

					if (vTabContenido[j].Cantidad !== "") {
						if (vTabContenido[j].Promoprecio === "" && vTabContenido[j].Promotarjet === "") {
							sap.m.MessageToast.show("Cantidad sin promo de trajeta asociada");
							return;
						}

					}

					//devuelve el cambio si tiene FR(Factor de rendimiento)

					if (vTabContenido[j].Ppum !== "000") {
						var oPath = oEvent.getSource().getParent().getParent().getParent().getParent().getAggregation("_navMaster").getPages()[0].getContent()[
							0].getSelectedItem().getBindingContext("ListSku").getPath();
						var iIndex = oEvent.getSource().getParent().getParent().getParent().getParent().getAggregation("_navMaster").getPages()[0].getContent()[
							0].getSelectedItem().getBindingContext("ListSku").getModel().getObject(oPath).Index;

						if (vValoresPrecio[iIndex].valprice) {
							// vTeprec.Preciovig = vTabContenido[j].PreciovigAux.toString().replace(/[.,]/g, "");
							//vTeprec.Preciovig = vGprecioViFR.toString().replace(/[.,]/g, "");
							vTeprec.Preciovig = vValoresPrecio[iIndex].valprice.toString().replace(/[.,]/g, "");
						}
					}

					//aqui
					vInput.GrabarPreciosTeprecSet.push(vTeprec);
					console.log(vTeprec);

				}

			}
			//llena tabla de SKU

			if (vTdcat.length > 0) {
				for (var i = 0; i < vTdcat.length; i++) {
					if (vTdcat[i].Matnr === vSkuSelect) {
						vTdcatIn.Idcatalogo = vTdcat[i].Idcatalogo;
						vTdcatIn.Idparte = vTdcat[i].Idparte;
						vTdcatIn.Idposnr = vTdcat[i].Idposnr;
						vTdcatIn.Matkl = vTdcat[i].Matkl;
						vTdcatIn.Matnr = vTdcat[i].Matnr;
						vTdcatIn.Vrkme = vTdcat[i].Vrkme;

						vInput.GrabarPreciosTdcatSet.push(vTdcatIn);
					}

				}
			}

			//vInput.GrabarPreciosTdcatSet.push(pp);

			function fSuccess(oEvent2) {

				sap.m.MessageToast.show("Registros Guardado");
				that.onDisplay();
			}

			function fError(oEvent2) {

				sap.m.MessageToast.show("Error al grabar Data");

			}

			Modelo.create("/GrabarPreciosSet", vInput, {
				success: fSuccess,
				error: fError
			});

		},

		createColumnConfig: function () {
			return [{
					label: "N° Catalogo",
					property: "Idcatalogo",
					type: "string",
					width: "25"
				}, {
					label: "ID Parte",
					property: "Idparte",
					type: "string",
					width: "25"
				}, {
					label: "Posicion",
					property: "Idposnr",
					type: "string",
					width: "25"
				}, {
					label: "SKU",
					property: "Matnr",
					type: "string",
					width: "25"
				}, {
					label: "Zona",
					property: "Zona",
					type: "string",
					width: "10"
				}, {
					label: "Precio vigente",
					property: "Preciovig",
					type: "string",
					width: "25"
				}, {
					label: "Precio Vigente Propuesto",
					property: "Precvigpro",
					type: "string",
					width: "25"
				}, {
					label: "Precio Promo Propuesto",
					property: "Precpropro",
					type: "string",
					width: "25"
				}, {
					label: "Promo a Precio",
					property: "Promoprecio",
					type: "string",
					width: "25"
				}, {
					label: "Promo a Tarjeta",
					property: "Promotarjet",
					type: "string",
					width: "25"
				}, {
					label: "Cantidad",
					property: "Cantidad",
					type: "string",
					width: "15"
				}

			];

		},

		onBajarExcel: function () {

			// baja archivo excel 

			if (vTotalRegPrecios.length > 0) {

				var vTab1 = [];

				for (var i = 0; i < vTotalRegPrecios.length; i++) {
					var vLine1 = {
						Idcatalogo: vTotalRegPrecios[i].Idcatalogo,
						Idparte: vTotalRegPrecios[i].Idparte,
						Idposnr: vTotalRegPrecios[i].Idposnr,
						Matnr: vTotalRegPrecios[i].Matnr,
						Zona: vTotalRegPrecios[i].Zona,
						Preciovig: vTotalRegPrecios[i].Preciovig.replace(/[.,]/g, ""),
						Precvigpro: vTotalRegPrecios[i].Precvigpro.replace(/[.,]/g, ""),
						Precpropro: vTotalRegPrecios[i].Precpropro.replace(/[.,]/g, ""),
						Promoprecio: vTotalRegPrecios[i].Promoprecio.replace(/[.,]/g, ""),
						Promotarjet: vTotalRegPrecios[i].Promotarjet,
						Cantidad: vTotalRegPrecios[i].Cantidad
					};

					//sustituye 0 por '' para defecto de bajar archivo excel 
					if (vTotalRegPrecios[i].Precvigpro === "0.00" || vTotalRegPrecios[i].Precvigpro === "0" ||
						isNaN(vTotalRegPrecios[i].Precvigpro) === true) {
						vLine1.Precvigpro = "";
					}

					if (vTotalRegPrecios[i].Precpropro === "0.00" || vTotalRegPrecios[i].Precpropro === "0" ||
						isNaN(vTotalRegPrecios[i].Precpropro) === true) {
						vLine1.Precpropro = "";
					}

					if (vTotalRegPrecios[i].Promoprecio === "0.00" || vTotalRegPrecios[i].Promoprecio === "0" ||
						isNaN(vTotalRegPrecios[i].Promoprecio) === true) {
						vLine1.Promoprecio = "";
					}

					if (vTotalRegPrecios[i].Promotarjet === "0.00" || vTotalRegPrecios[i].Promotarjet === "0" ||
						isNaN(vTotalRegPrecios[i].Promotarjet) === true) {
						vLine1.Promotarjet = "";
					}

					// vLine1.Idcatalogo = vTotalRegPrecios[i].Idcatalogo;
					// vLine1.Idparte = vTotalRegPrecios[i].Idparte;
					// vLine1.Idposnr = vTotalRegPrecios[i].Idposnr;
					// vLine1.Matnr = vTotalRegPrecios[i].Matnr;
					// vLine1.Zona = vTotalRegPrecios[i].Zona;
					// vLine1.Precvigpro = vTotalRegPrecios[i].Precvigpro;
					// vLine1.Precpropro = vTotalRegPrecios[i].Precpropro;
					// vLine1.Promoprecio = vTotalRegPrecios[i].Promoprecio;
					// vLine1.Promotarjet = vTotalRegPrecios[i].Promotarjet;
					vTab1.push(vLine1);
				}

				var aCols, oSettings, oSheet;

				aCols = this.createColumnConfig();

				oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: vTab1
				};
				oSheet = new Spreadsheet(oSettings);

				oSheet.build()
					.then(function () {
						MessageToast.show("Archivo Descargado");
					})
					.finally(function () {
						oSheet.destroy();
					});

			}

		},

		handleUploadPress: function (oEvent) {
			//carga archivo de Excel 
			var vthis = this;
			var vTable1 = "";

			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

			var vIdFileUp = this.byId("fileUploader"); //id del objeto FileUpload

			if (file && window.FileReader) {
				var reader = new FileReader();
				var that = this;

				reader.onload = function (evn) {

					var strCSV = evn.target.result; //string in CSV 

					var datosCSV = strCSV.split("\n");

					var largo = datosCSV.length;
					var entrada = [];
					var SKU = {};
					var TabEntrada = [];

					// no toma la primera ni la última linea
					for (var i = 1; i < largo - 1; i++) {

						entrada = datosCSV[i].split(";");

						SKU = {
							Idcatalogo: entrada[0],
							Idparte: entrada[1],
							Idposnr: entrada[2],
							Matnr: entrada[3],
							Zona: entrada[4],
							Precvigpro: entrada[6].replace(/[.,]/g, ""), //quita '.'' y ',' 
							Precpropro: entrada[7].replace(/[.,]/g, ""),
							Promoprecio: entrada[8].replace(/[.,]/g, ""),
							Promotarjet: entrada[9].replace(/(\r\n|\n|\r)/gm, ""), // quita salto de pagina
							Cantidad: entrada[10].replace(/(\r\n|\n|\r)/gm, "")

						};
						// valida formato de campos de entra del archivo Excel
						if (SKU.Precvigpro !== "") {
							if (vthis.ValidarCampos(SKU.Precvigpro) === "1") { //valida Precio vigente propuesto
								var vLinea = i + 1;
								var vMensaje1 = "Error de formato en linea: " + vLinea + " Del Excel";
								sap.m.MessageToast.show(vMensaje1);
								return;
							}
						}
						if (SKU.Precpropro !== "") {
							if (vthis.ValidarCampos(SKU.Precpropro) === "1") { //valida Precio Promo Prompuesto
								var vLinea2 = i + 1;
								var vMensaje2 = "Error de formato en linea: " + vLinea2 + " Del Excel";
								sap.m.MessageToast.show(vMensaje2);
								return;
							}
						}
						if (SKU.Promoprecio !== "") {
							if (vthis.ValidarCampos(SKU.Promoprecio) === "1") { //valida Precio a promo
								var vLinea3 = i + 1;
								var vMensaje3 = "Error de formato en linea: " + vLinea3 + " Del Excel";
								sap.m.MessageToast.show(vMensaje3);
								return;
							}
						}
						if (SKU.Promotarjet !== "") {
							if (vthis.ValidarCampos2(SKU.Promotarjet) === "1") { //valida Precio a tarjeta
								var vLinea4 = i + 1;
								var vMensaje4 = "Error de formato en linea: " + vLinea4 + " Del Excel";
								sap.m.MessageToast.show(vMensaje4);
								return;
							}
						}

						if (SKU.Cantidad !== "") {
							if (SKU.Promoprecio === "" && SKU.Promotarjet === "") {
								sap.m.MessageToast.show("Cantidad sin promo de trajeta asociada");
								return;
							}

						}

						TabEntrada.push(SKU);
					}

					if (TabEntrada.length > 0) {

						bDialog.open();
						vthis.SubirExcel(TabEntrada);

					}

					//vthis.CargarData();

				}

			}
			reader.readAsText(file);
			vIdFileUp.setValue(""); //Blanque Objeto 

		},
		//valida que solo sean numeros los cargados desde la planilla excel 
		ValidarCampos: function (Val1) {

			// chekea que este en rango numerico
			if (/^([0-9])*$/.test(Val1)) {
				return "0";
			} else {
				return "1";
			}
		},
		//Valida columna promo a tarjeta
		ValidarCampos2: function (Val1) {

			var vCon = 0;
			// valida que no exista mas de un '.'
			for (var i = 0; i < Val1.length; i++) {
				if (Val1[i] === ".") {
					vCon = vCon + 1;
					if (vCon > 1) {
						return "1";
					}

				}
			}

			var Val2 = Val1.replace(/[.]/g, "");
			//Elimina el salto de line
			var Val3 = Val2.replace(/(\r\n|\n|\r)/gm, "");

			// chekea que este en rango numerico
			if (/^([0-9])*$/.test(Val3)) {
				return "0";
			} else {
				return "1";
			}
		},

		SubirExcel: function (TabIn) {
			var that = this;
			var vInput = {
				Cata: vValNumCatalogo,
				Parte: "",
				Pmensaje1: "",
				Pmensaje2: "",
				GrabarPreciosTdcatSet: [],
				GrabarPreciosTeprecSet: [],
				GrabarPreciosTsprecSet: []
			};
			var PreciosTsprecSet = {
				Idcatalogo: "",
				Idparte: "",
				Idposnr: "",
				Matnr: "",
				Zona: "",
				Preciovig: "",
				Moneda: "",
				Precvigpro: "",
				Precpropro: "",
				Promoprecio: "",
				Promotarjet: ""

			};

			//sube data  masivo
			//realiza el Mach con los Sku en memoria  

			var vTotalRegPreciosAux = [];
			for (var i = 0; i < vTotalRegPrecios.length; i++) {
				for (var j = 0; j < TabIn.length; j++) {
					if (parseInt(vTotalRegPrecios[i].Idcatalogo, 10) === parseInt(TabIn[j].Idcatalogo, 10) &&
						parseInt(vTotalRegPrecios[i].Idparte, 10) === parseInt(TabIn[j].Idparte, 10) &&
						parseInt(vTotalRegPrecios[i].Idposnr, 10) === parseInt(TabIn[j].Idposnr, 10) &&
						vTotalRegPrecios[i].Zona === TabIn[j].Zona &&
						vTotalRegPrecios[i].Matnr === TabIn[j].Matnr) {
						vTotalRegPrecios[i].Preciovig = vTotalRegPrecios[i].Preciovig.replace(/[.,]/g, "");
						vTotalRegPrecios[i].Precpropro = TabIn[j].Precpropro;
						vTotalRegPrecios[i].Precvigpro = TabIn[j].Precvigpro;
						vTotalRegPrecios[i].Promoprecio = TabIn[j].Promoprecio;
						vTotalRegPrecios[i].Promotarjet = TabIn[j].Promotarjet;
						vTotalRegPrecios[i].Cantidad = TabIn[j].Cantidad;

						vTotalRegPreciosAux.push(vTotalRegPrecios[i]);
						//delete vTotalRegPrecios[i].index;
						break;
					}

				}
			}

			//Rutina para Factor de rendimiento 
			// devuelve el Precio vigente sin factor de rendimiento para guardar precio
			if (vTabFR.length > 0) {
				for (var i = 0; i < vTotalRegPreciosAux.length; i++) {
					for (var j = 0; j < vTabFR.length; j++) {

						if (parseInt(vTotalRegPreciosAux[i].Idcatalogo, 10) === parseInt(vTabFR[j].Idcatalogo, 10) &&
							parseInt(vTotalRegPreciosAux[i].Idparte, 10) === parseInt(vTabFR[j].Idparte, 10) &&
							parseInt(vTotalRegPreciosAux[i].Idposnr, 10) === parseInt(vTabFR[j].Idposnr, 10) &&
							vTotalRegPreciosAux[i].Zona === vTabFR[j].Zona &&
							vTotalRegPreciosAux[i].Matnr === vTabFR[j].Matnr) {

							vTotalRegPreciosAux[i].Preciovig = vTabFR[j].Preciovig.replace(/[.,]/g, "");

						}

					}
				}
			}

			for (var i = 0; i < vTotalRegPreciosAux.length; i++) {
				var vTeprec = {
					Idcatalogo: vTotalRegPreciosAux[i].Idcatalogo,
					Idparte: vTotalRegPreciosAux[i].Idparte,
					Idposnr: vTotalRegPreciosAux[i].Idposnr,
					Matnr: vTotalRegPreciosAux[i].Matnr,
					Zona: vTotalRegPreciosAux[i].Zona,
					Preciovig: vTotalRegPreciosAux[i].Preciovig,
					Moneda: vTotalRegPreciosAux[i].Moneda,
					Precvigpro: vTotalRegPreciosAux[i].Precvigpro,
					Precpropro: vTotalRegPreciosAux[i].Precpropro,
					Promoprecio: vTotalRegPreciosAux[i].Promoprecio,
					Promotarjet: vTotalRegPreciosAux[i].Promotarjet,
					Redimiento: vTotalRegPreciosAux[i].Redimiento,
					Ppum: vTotalRegPreciosAux[i].Ppum.replace(/[.,]/g, ""),
					Cantidad: vTotalRegPreciosAux[i].Cantidad
				};
				vInput.GrabarPreciosTeprecSet.push(vTeprec);
			}

			// pasa tabla con precios 
			//vInput.GrabarPreciosTeprecSet = vTotalRegPrecios;

			//llena tabla de SKU
			for (var i = 0; i < vTdcat.length; i++) {

				var vTdcatIn = {
					Idcatalogo: vTdcat[i].Idcatalogo,
					Idparte: vTdcat[i].Idparte,
					Idposnr: vTdcat[i].Idposnr,
					Matnr: vTdcat[i].Matnr,
					Vrkme: vTdcat[i].Vrkme,
					Matkl: vTdcat[i].Matkl
				};

				vInput.GrabarPreciosTdcatSet.push(vTdcatIn);

			}

			function fSuccess(oEvent) {

				bDialog.close();

				sap.m.MessageToast.show("Registros Guardados");
				that.onRefresh();

			}

			function fError(oEvent) {
				bDialog.close();
				sap.m.MessageToast.show("Refresque Listado y Suba Archivo CSV");

			}

			vInput.GrabarPreciosTsprecSet.push(PreciosTsprecSet);

			Modelo.create("/GrabarPreciosSet", vInput, {
				success: fSuccess,
				error: fError
			});

		},
		onSearch: function (oEvt) {
			// add filter for search

			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("IdSku", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			var list = this.byId("list1");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

		},
		onRefresh: function () {

			var model = new JSONModel({
				DATA: []
			});
			//blanque tablas
			model.setProperty("/DATA", []);
			this.getView().byId("table1").setModel(model, "VTab");

			this.onDisplay();
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

		/* =========================================================== */
		/* begin: metodos Fragment centros                             */
		/* =========================================================== */
		onVisualCentro: function (oEvent) {
			var that = this;
			vZonaCentro = "";

			//ubica el registro seleccionado 
			var row = oEvent.getSource().getParent().getId();
			var vValString = row.indexOf("table1");
			var vPos = row.substr(vValString + 7);

			var vTab = this.byId("table1");
			var vList1 = vTab1.getModel("VTab").getData().DATA[vPos];

			var oEntrada = {
				"Cata": vValNumCatalogo,
				"Parte": vList1.Idparte,
				"Despl": "X",
				"Check": "C",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"CosulSkuTcvigSet": [],
				"CosulSkuTdcatSet": [],
				"CosulSkuTpvigSet": []
			};
			//almacena zona seleccionada
			vZonaCentro = vList1.Zona;

			var vTdcat = {
				Idcatalogo: vList1.Idcatalogo,
				Idparte: vList1.Idparte,
				Matnr: vList1.Matnr

			}

			oEntrada.CosulSkuTdcatSet.push(vTdcat);

			function fSuccess(oEvent2) {

				var ListSkuCentro = new JSONModel({
					DATA: []
				});

				var vListCentro = [];

				for (var i = 0; i < oEvent2.CosulSkuTcvigSet.results.length; i++) {
					if (oEvent2.CosulSkuTcvigSet.results[i].Zona === vZonaCentro) {
						var vRowCentro = {
							Zona: oEvent2.CosulSkuTcvigSet.results[i].Zona,
							Centro: oEvent2.CosulSkuTcvigSet.results[i].Centro,
							Preciovig: oEvent2.CosulSkuTcvigSet.results[i].Preciovig,
							Moneda: oEvent2.CosulSkuTcvigSet.results[i].Moneda

						};
						//  da formato al precio
						if (vRowCentro.Preciovig !== "") {
							vRowCentro.Preciovig = that.onFormatoPrecio(vRowCentro.Preciovig.replace(/\s/g, ""));
						}

						vListCentro.push(vRowCentro);
					}
				}

				//valida que exista informacion registrada en tabla vListCentro 
				if (vListCentro.length === 0 || vListCentro === undefined) {
					sap.m.MessageToast.show("No existen Precios asociado a la Zona");
					return
				}

				//vListCentro = oEvent2.CosulSkuTcvigSet.results;

				// asignar el modelo a la vista al fragment
				that._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ListCentro", that);
				that._Dialog.setModel(that.getView().getModel());
				// abre el fragment
				that._Dialog.open();

				ListSkuCentro.setProperty("/DATA", vListCentro);

				//var tabCentro = sap.ui.getCore().byId("table0");
				// asignar el modelo a la vista
				that._Dialog.setModel(ListSkuCentro, "ListCentro");

				//tabCentro.setModel(ListSkuCentro, "ListCentro");

			}

			function fError(oEvent2) {

			}
			// this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ListCentro", this);
			// this._Dialog.setModel(this.getView().getModel());
			// // abre el fragment
			// this._Dialog.open();

			Modelo.create("/CosulSkuSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

		},

		onCerrarFrag: function () {

			this._Dialog.destroy(true);
			this._Dialog.close();

		},

	});

});