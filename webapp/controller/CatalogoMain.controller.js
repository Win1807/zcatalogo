jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.jszip");
jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.xlsx");
sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/export/Spreadsheet",
	"ZCatalogoMesa/zcatalogo/model/formatter"
], function (MessageBox, Fragment, Controller, JSONModel, History, Spreadsheet, formatter) {
	"use strict";
	var _varcatalogo = null,
		vValOrigen = "";
	var vidTituloPage = "";
	var vlabel0 = "";
	var vbutton0 = "";
	var vtxGerRespon = "";
	var vGerRespon = "";
	var vCargComerciD = "";
	var vCargComerciH = "";
	var vPrimeraRevD = "";
	var vPrimeraRevH = "";
	var vSegundaraRevD = "";
	var vSegundaraRevH = "";
	var vFechaPreD = "";
	var vFechaPreH = "";
	var vFechaPubD = "";
	var vFechaPubH = "";
	var vInput1 = "";
	var vNombreCat = "";
	var vRangoPromo = "";
	var vidCore = "";
	var vidCore2 = "";
	var vModelAccionP = "";
	var vbtGuardar = "";
	var modeloCatalogo = "";
	var _varBusquedaOK = "";
	var vTabCat = [];
	var vNomCatBus = "";
	var vLabelCatBus = "";
	var vGCatCerrado = "";
	var vGFechaPublicI = "";
	var vGFechaPublicF = "";
	//	var vDP1 = "";
	//	var vidCheck = "";
	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.CatalogoMain", {
		_modelo: null,
		formatter: formatter,
		_oModelCatalogo: new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV"),
		onInit: function () {

			// creo modelo json para manejar los datos
			var modelo = new JSONModel();
			// asignar el modelo a la vista
			this.getView().setModel(modelo);
			// asigno modelo creado al modelo global de la vista 
			this._modelo = modelo;
			// creo propiedades al modelo
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CatalogoMain").attachDisplay(null, this.onDisplay, this);

		},

		onDisplay: function () {
			// Se crea el modelo DEL SERVICIO
			modeloCatalogo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			modeloCatalogo.setUseBatch(false); // se puede desactivar el uso de batch

			vValOrigen = sap.ui.getCore().getModel("vValOrigen");

			vidTituloPage = this.byId("idTituloPage"); //titulo de la Pagina
			vlabel0 = this.byId("label0"); //titulo de la Pagina
			vbutton0 = this.byId("button0"); //boton de consulta de catalogo 

			vtxGerRespon = this.byId("txGerRespon"); //Label gerencia responsable
			vGerRespon = this.byId("GerRespon"); //input gerencia responsable
			vCargComerciD = this.byId("CargComerciD"); //imput Carga comercial desed
			vCargComerciH = this.byId("CargComerciH"); //imput Carga comercial hasta
			vPrimeraRevD = this.byId("PrimeraRevD"); //Primera revicion desde
			vPrimeraRevH = this.byId("PrimeraRevH"); //Primera revicion hasta
			vSegundaraRevD = this.byId("SegundaraRevD"); // segunda revicion desde
			vSegundaraRevH = this.byId("SegundaraRevH"); // segunda revicion hasta
			vFechaPreD = this.byId("FechaPreD"); //Carga de precio desde
			vFechaPreH = this.byId("FechaPreH"); //Carga de precio Hasta
			vFechaPubD = this.byId("FechaPubD"); // Fecha de publicación desde 
			vFechaPubH = this.byId("FechaPubH"); // Fecha de publicación desde 
			vInput1 = this.byId("input1"); //ID accion promocional/Catalogo
			vNombreCat = this.byId("NombreCat"); //Nombre promocional/Catalogo
			vRangoPromo = this.byId("RangoPromo");
			vbtGuardar = this.byId("btGuardar");
			vNomCatBus = this.byId("productInput");
			vLabelCatBus = this.byId("LabelCatList");
			var vTabIcon = this.byId("IdIconTab");
			vTabIcon.setSelectedKey("__filter0");

			vidCore = this.byId("idCore");
			vidCore2 = this.byId("idCore2");
			//vDP1 = this.byId("DP1");
			//	vidCheck = this.byId("idCheck");

			this.LimpiaCampos();

			if (vValOrigen === "Cata") {
				vidTituloPage.setTitle("INGRESO DE CATALOGO");
				vlabel0.setText("ID Catalogo");
				vbutton0.setVisible(true);
				vtxGerRespon.setVisible(true);
				vCargComerciD.setVisible(true);
				vCargComerciH.setVisible(true);
				vPrimeraRevD.setVisible(true);
				vPrimeraRevH.setVisible(true);
				vSegundaraRevD.setVisible(true);
				vSegundaraRevH.setVisible(true);
				vFechaPreD.setVisible(true);
				vFechaPreH.setVisible(true);
				vFechaPubD.setVisible(true);
				vFechaPubH.setVisible(true);
				vInput1.setBlocked(false);

				vRangoPromo.setVisible(false);
				vNombreCat.setBlocked(true);
				vidCore.setText("Información Catalogo");
				vidCore2.setText("Parametro de Busqueda");
				vbtGuardar.setVisible(false);
				this.BucsaListCata();
				vNomCatBus.setVisible(true);
				vLabelCatBus.setVisible(true);
				//vDP1.setVisible(false);
				//	vidCheck.setVisible(false);

			} else {
				if (vValOrigen === "Promo") {
					vidTituloPage.setTitle("ACCIÓN PROMOCIONAL");
					vlabel0.setText("ID Acción Promo");
					vbutton0.setVisible(false);
					vGerRespon.setVisible(false);
					vCargComerciD.setVisible(false);
					vCargComerciH.setVisible(false);
					vPrimeraRevD.setVisible(false);
					vPrimeraRevH.setVisible(false);
					vSegundaraRevD.setVisible(false);
					vSegundaraRevH.setVisible(false);
					vFechaPreD.setVisible(false);
					vFechaPreH.setVisible(false);
					vFechaPubD.setVisible(false);
					vFechaPubH.setVisible(false);
					vInput1.setBlocked(true);
					vRangoPromo.setVisible(true);
					vNombreCat.setBlocked(false);
					vbtGuardar.setVisible(true);
					vidCore.setText("Datos Acción Promo");
					vidCore2.setText("Información Promo");
					vNomCatBus.setVisible(false);
					vLabelCatBus.setVisible(false);
					//vDP1.setVisible(true);
					//	vidCheck.setVisible(true);
					//accedo al core para los datos de la accion promocional 
					vModelAccionP = sap.ui.getCore().getModel("vModelAccionP");
					// setea Id Accion promocional 
					vInput1.setValue(vModelAccionP.IdCatalogo);
					// setea Nombre Acción Promocional 
					vNombreCat.setValue(vModelAccionP.NomCatalogo);
					// seta Fecha de vigencia de la accion 
					// fecha vigencia de a promo

					var vFechaVigencia = vModelAccionP.FechaDesde.substr(0, 4) + "/" + vModelAccionP.FechaDesde.substr(4, 2) + "/" + vModelAccionP.FechaDesde
						.substr(6,
							2) + " -- " + vModelAccionP.FechaHasta.substr(0, 4) + "/" + vModelAccionP.FechaHasta.substr(4, 2) + "/" + vModelAccionP.FechaHasta
						.substr(6, 2);
					vRangoPromo.setValue(vFechaVigencia);

				}

			}

		},
		BucsaListCata: function () {
			// busca listado de catalogo
			var that = this;
			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;
			var modelo = new JSONModel();
			// se asigna el modelo a la vista
			this.getView().setModel(modelo);
			// se inician estructuras
			modelo.setProperty("/ListCata", []);
			var bDialog = new sap.m.BusyDialog();
			bDialog.open();

			//tipo de Catalogo
			filter = new sap.ui.model.Filter({
				path: "TipoCat",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "1"
			});
			oFilters.push(filter);

			function fSuccess(oEvent) {

				modelo.setProperty("/ListCata", oEvent.results);

				if (vTabCat.length === 0) {
					//llena tabla para catalago 
					for (var j = 0; j < oEvent.results.length; j++) {
						vTabCat.push(oEvent.results[j]);
					}

				}
				bDialog.close();

			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error en Listar Catalogos");
				bDialog.close();

			}

			modeloCatalogo.read("/ConsulCataListSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});
		},

		onClick: function (oEvent) {

			// verifica el valor que devuelve los botones SKU/Precio/Mesa

			var vthis = this;
			var vvalbotton = oEvent.getSource().getHeader();

			var varCatalogo = this.byId("input1").getValue();

			if (varCatalogo === "" || varCatalogo === undefined) {
				sap.m.MessageToast.show("Id Catalogo Vacio");

			} else {
				if (vValOrigen === "Promo") {
					_varBusquedaOK = "X";
				}

				if (_varBusquedaOK === "X") {
					//asigno a variable al core

					sap.ui.getCore().setModel(_varcatalogo, "vValNumCatalogo"); //Numero de catalogo

					vNombreCat = vNombreCat.getValue();
					sap.ui.getCore().setModel(vNombreCat, "vNombreCat"); //Nombre del catalogo

					if (vvalbotton === "Gestión Carteleria y Pangui") {

						var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

						// var vTipoAccion = "I"; // tipo de accion I=insertar
						// sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion");
						var vValViewCata = "X"; // inicia ciclo desde la pantalla CatalogoMain
						sap.ui.getCore().setModel(vValViewCata, "vValViewCata");

						var vValNumPromo = "";
						sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");
						//navega a la Vista Nueva promo

						// vValOrigen = "Cata";
						// sap.ui.getCore().setModel(vValOrigen, "vValOrigen");

						var vValLimpiarNP = "X";
						sap.ui.getCore().setModel(vValLimpiarNP, "vValLimpiarNP");

						//graba en el core si el catalogo esta cerrado 
						sap.ui.getCore().setModel(vGCatCerrado, "vGCatCerrado");
						// graba en el core la fecha de publicación 

						sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
						sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");

						//navega a la Vista Nueva promo
						vthis.getOwnerComponent().getTargets().display("ListadoPromoMain");
						_varBusquedaOK = "";
					}
					if (vvalbotton === "Gestión de SKU y Precios") {
						// si es una Promo carga N° Promo = N° Catalogo 
						if (vValOrigen === "Promo") {
							sap.ui.getCore().setModel(varCatalogo, "vValNumCatalogo"); //Numero de catalogo
						}

						//navega a la Carga de Sku
						vthis.getOwnerComponent().getTargets().display("CargaSKU2");
						_varBusquedaOK = "";

					}
				} else {
					sap.m.MessageToast.show("Debe buscar Id Catalogo");
				}
			}
		},
		onEnter: function (oEvent) {

			this.onBuscarCat();
		},
		onEnter2: function (oEvent) {

			for (var i = 0; i < vTabCat.length; i++) {
				if (oEvent.getSource().getValue().toUpperCase() === vTabCat[i].NomCatalogo) {
					vInput1.setValue(vTabCat[i].IdCatalogo);
					this.onBuscarCat();
					return;
				}

			}
			// no existe Catalago indicado
			sap.m.MessageToast.show("No existe Catálogo Indicado");
			this.LimpiaCampos();

		},
		onSuggest: function (oEvent) {

			var vCodCata = oEvent.getParameters().selectedItem.mProperties.additionalText;
			vInput1.setValue(vCodCata);
			this.onBuscarCat();

		},

		//Buscar Catalogo
		onBuscarCat: function () {

			var vthis = this;
			var modelo = this._modelo;
			var vSimpleF = this.byId("FieldGroupView");

			_varcatalogo = this.getView().byId("input1").getValue();

			//pasa variable a global 

			var IdCatalogo = vthis.byId("input1");

			// valida de que no ingresen string
			if (isNaN(_varcatalogo)) {
				sap.m.MessageToast.show("Ingrese solo Numeros");
				IdCatalogo.setValue("");
				return;
			}

			// Función de éxito
			function fSuccess(oEvent) {
				vSimpleF.setBusy(false);
				//animacion para dejar el primer icon tab
				vthis.byId("IdIconTab").setSelectedKey("0");
				vthis.ocultarPlanVentas(oEvent.Cataloga);
				//Envia  mensaje  cunado no existen datos
				if (oEvent.NomCatalogo === "") {
					sap.m.MessageToast.show("Registro no existe");
					vthis.LimpiaCampos();
					return;
				}
				// envia un mensaje si el catalogo se encuentra cerrado 
				vGCatCerrado = oEvent.Catcerrado;
				if (oEvent.Catcerrado === "X") {
					sap.m.MessageToast.show("Catalogo Cerrado");
				}

				// asigno datos a la estructura Canales del modelo
				modelo.setProperty("/catalogo", []);
				modelo.setProperty("/catalogo", oEvent.results);
				// NombreCat = vthis.byId("NombreCat"),
				// 	GerRespon = vthis.byId("GerRespon"),
				// 	CargComerciD = vthis.byId("CargComerciD"),
				// 	CargComerciH = vthis.byId("CargComerciH"),
				// 	PrimeraRevD = vthis.byId("PrimeraRevD"),
				// 	PrimeraRevH = vthis.byId("PrimeraRevH"),
				// 	SegundaraRevD = vthis.byId("SegundaraRevD"),
				// 	SegundaraRevH = vthis.byId("SegundaraRevH"),
				// 	FechaPubD = vthis.byId("FechaPubD"),
				// 	FechaPubH = vthis.byId("FechaPubH"),
				// 	FechaPreD = vthis.byId("FechaPreD"),
				// 	FechaPreH = vthis.byId("FechaPreH");

				vthis.getOwnerComponent().getModel("catalogaModel").setProperty("/CatalogData", oEvent);
				vNombreCat.setValue(oEvent.NomCatalogo);
				vNomCatBus.setValue(oEvent.NomCatalogo);
				vGerRespon.setValue(oEvent.NomArea);
				vCargComerciD.setValue(oEvent.FechaCarComIni);
				vCargComerciH.setValue(oEvent.FechaCarComFin);
				vPrimeraRevD.setValue(oEvent.FechaCarPrevIni);
				vPrimeraRevH.setValue(oEvent.FechaCarPrevFin);
				vSegundaraRevD.setValue(oEvent.FechaCarSegrIni);
				vSegundaraRevH.setValue(oEvent.FechaCarSegrFin);
				vFechaPubD.setValue(oEvent.FechaCarPrecIni);
				vFechaPubH.setValue(oEvent.FechaCarPrecFin);
				vFechaPreD.setValue(oEvent.FechaCarPublIni);
				vFechaPreH.setValue(oEvent.FechaCarPublFin);

				vGFechaPublicI = oEvent.FechaCarPrecIni;
				vGFechaPublicF = oEvent.FechaCarPrecFin;

				// setea mariable OK 
				_varBusquedaOK = "X";
				if(oEvent.Cataloga === "X") {
					vthis.initContadores(_varcatalogo);
				}
			}

			// Función de error
			function fError(oEvent) {
				vSimpleF.setBusy(false);
				sap.m.MessageToast.show("Error al Buscar datos");
			}

			//Lee el servicio

			modeloCatalogo.read("/ConsultaCatalogo2Set(IdCatalogo='" + _varcatalogo + "')", {
				success: fSuccess,
				error: fError
			});
			//activa el busy
			vSimpleF.setBusy(true);

		},
		onBack: function () {
			if (vValOrigen === "Cata") {
				this.getOwnerComponent().getTargets().display("TipoAccionMain");
			} else {
				if (vValOrigen === "Promo") {
					this.getOwnerComponent().getTargets().display("ListadoPromoMain");
				}
			}

		},
		onGuardarAccion: function () {

			// valida que no queden vacios los campos 
			var VvInput1 = vInput1.getValue();
			var VvNombreCat = vNombreCat.getValue();
			var VvRangoPromo = vRangoPromo.getValue();

			if (VvNombreCat === "") {
				sap.m.MessageToast.show("Debe completar todos los Campos");
				return;
			}
			if (VvRangoPromo === "" || VvRangoPromo === "yyyyMMdd--yyyyMMddFecha") {
				sap.m.MessageToast.show("Debe completar todos los Campos");
				return;
			}
			// da formato a la fecha 
			var vformato = VvRangoPromo.replace(/[/\s]/g, "");
			var vFechaDesde = vformato.substr(0, 8);
			var vFechaHasta = vformato.substr(10, 8);

			// guarda la información de la acción promocional 
			var oEntrada = {
				"IdCatalogo": VvInput1,
				"NomCatalogo": VvNombreCat,
				"FechaDesde": vFechaDesde,
				"FechaHasta": vFechaHasta,
				"Check1": "M"
			};

			// Función de éxito
			function fSuccess(oEvent) {
				_varBusquedaOK = "X";
				sap.m.MessageToast.show("Registro Guardado ");
			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al Guardar Registro ");
			}

			// Consume servicio para grabar catalogo CyP

			modeloCatalogo.create("/GrabarAccionProSet", oEntrada, {
				success: fSuccess,
				error: fError

			});

		},

		LimpiaCampos: function () {

			vInput1.setValue("");
			vNombreCat.setValue("");
			vRangoPromo.setValue("");
			vGerRespon.setValue("");
			vCargComerciD.setValue("");
			vCargComerciH.setValue("");
			vPrimeraRevD.setValue("");
			vPrimeraRevH.setValue("");
			vSegundaraRevD.setValue("");
			vSegundaraRevH.setValue("");
			vFechaPreD.setValue("");
			vFechaPreH.setValue("");
			vFechaPubD.setValue("");
			vFechaPubH.setValue("");
			vNomCatBus.setValue("");

		},

		//*********************************TRVL

		onClickCatalog: function (oEvent) {

			var varCatalogo = this.byId("input1").getValue();

			if (varCatalogo === "" || varCatalogo === undefined) {
				sap.m.MessageToast.show("Id Catalogo Vacio");
				return;
			}
			sap.ui.core.BusyIndicator.show(0);
			this.getOwnerComponent().getModel("catalogaModel").setProperty("/idCata", varCatalogo);
			this.getOwnerComponent().getTargets().display("Catalog");
		},

		OnselcetCheck: function (oEvent) {
			// if (oEvent.getParameters().selected){
			// 	vDP1.setBlocked(false);

			// }else{
			// 	vDP1.setBlocked(true);
			// 	vDP1.setValue("");
			// }
			// debugger
			// ;
		},
		//funcion que descarga el excel de venta historico
		onDescargarExcelPlanVentas: function (oEvent) {
			var sCatalogo = this.byId("input1").getValue();
			var that = this;
			var sID = this.getIDPlanVenta(oEvent.getSource().getText());
			var sName = oEvent.getSource().getText() + "_" + sCatalogo;
			if (sCatalogo) {
				sap.ui.core.BusyIndicator.show(0);
				var fnSuccess = function () {
					var aColumns = that.getColumnsExcel(sID);
					that._oModelCatalogo.create("/DeepAbastVentasPSet", {
						Accion: "C",
						IIdcatalogo: sCatalogo,
						IUname: "",
						Tipo: "1",
						Pmensaje1: "",
						Pmensaje2: "",
						DeepAbastVentasTSet: []
					}, {
						success: function (oResponse) {
							if (oResponse.Pmensaje1 !== "0") {
								sap.ui.core.BusyIndicator.hide();
								that.getErrorLog([{
									Mensaje: oResponse.Pmensaje2
								}]);
							} else {
								// var oSettings = {
								// 	workbook: {
								// 		columns: aColumns
								// 	},
								// 	// dataSource: {
								// 	// 	type: "odata",
								// 	// 	dataUrl: Response.DeepAbastVentasTSet.results,
								// 	// 	count: oResponse.DeepAbastVentasTSet.results.length
								// 	// },
								// 	dataSource: oResponse.DeepAbastVentasTSet.results, //oEvent.results,
								// 	fileName: sName,
								// 	worker: false
								// 		// showProgress: false
								// };
								// var oSheet = new Spreadsheet(oSettings);
								// oSheet.build().then(function () {
								// 	sap.ui.core.BusyIndicator.hide();
								// 	sap.m.MessageToast.show("Descarga exitosa");
								// }).finally(function () {
								// 	oSheet.destroy();
								// });
								var oSettings = {
									workbook: {
										columns: aColumns
									},
									showProgress: true,
									dataSource: oResponse.DeepAbastVentasTSet.results,
									fileName: sName
								};
								var oSheet = new Spreadsheet(oSettings);
								oSheet.onprogress = function (iValue) {
									//eslint-disable-next-line no-console
									console.info("Export: %" + iValue + " completed");
								};
								oSheet.build().then(function () {
										sap.ui.core.BusyIndicator.hide();
										sap.m.MessageToast.show("Descarga exitosa");
								});
							}
						},
						error: function (oResponse) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show("Error al descargar");
						}
					});
				};
				if (sID !== "VS" && sID !== "VC") {
					fnSuccess();
				} else {
					this.getSeguridad(sCatalogo, sID, fnSuccess, "C"); //ARREGLAR ESTO, NO DEBE DE IR EL INPUT DEL SEARCH SI NO EL MODELO
				}
			} else {
				sap.m.MessageToast.show("Ingrese catalogo");
			}
		},
		getIDPlanVenta: function (sText) {
			return sText.search("Historica") > 0 ? "VH" : (
				sText.search("Sugerido") > 0 ? "VS" : (
					sText.search("Corregido") > 0 ? "VC" : "VR"
				));
		},
		getColumnsExcel: function (sID) {
			var aVH = [{
				label: "N° Catalogo",
				property: "IdCatalogo"
			}, {
				label: "Parte",
				property: "IdParte"
			}, {
				label: "Material",
				property: "Matnr"
			}, {
				label: "Tienda",
				property: "Centro"
			}, {
				label: "Fecha Inicio Comparativa 1",
				property: "FecIniCom1"
			}, {
				label: "Fecha Fin Comparativa 1",
				property: "FecFinCom1"
			}, {
				label: "Fecha Inicio Comparativa 2",
				property: "FecIniCom2"
			}, {
				label: "Fecha Fin Comparativa 2",
				property: "FecFinCom2"
			}, {
				label: "Venta Neta-Retail (Historico1)",
				property: "Vh1RetMonto",
				type: "Number"
			}, {
				label: "Cantidad-Retail (Historico1)",
				property: "Vh1RetUnid",
				type: "Number"
			}, {
				label: "Contribución-Retail (Historico1)",
				property: "Vh1RetCont",
				type: "Number"
			}, {
				label: "Venta neta-Mayorista (Historico1)",
				property: "Vh1MayMonto",
				type: "Number"
			}, {
				label: "Cantidad-Mayorista (Historico1)",
				property: "Vh1MayUnid",
				type: "Number"
			}, {
				label: "Contribución-Mayorista (Historico1)",
				property: "Vh1MayCont",
				type: "Number"
			}, {
				label: "Venta Neta-Internet (Historico1)",
				property: "Vh1IntMonto",
				type: "Number"
			}, {
				label: "Cantidad-Internet (Historico1)",
				property: "Vh1IntUnid",
				type: "Number"
			}, {
				label: "Contribución-Internet (Historico1)",
				property: "Vh1IntCont",
				type: "Number"
			}, {
				label: "Venta Neta-Retail (Historico2)",
				property: "Vh2RetMonto",
				type: "Number"
			}, {
				label: "Cantidad-Retail (Historico2)",
				property: "Vh2RetUnid",
				type: "Number"
			}, {
				label: "Contribución-Retail (Historico2)",
				property: "Vh2RetCont",
				type: "Number"
			}, {
				label: "Venta neta-Mayorista (Historico2)",
				property: "Vh2MayMonto",
				type: "Number"
			}, {
				label: "Cantidad-Mayorista (Historico2)",
				property: "Vh2MayUnid",
				type: "Number"
			}, {
				label: "Contribución-Mayorista (Historico2)",
				property: "Vh2MayCont",
				type: "Number"
			}, {
				label: "Venta Neta-Internet (Historico2)",
				property: "Vh2IntMonto",
				type: "Number"
			}, {
				label: "Cantidad-Internet (Historico2)",
				property: "Vh2IntUnid",
				type: "Number"
			}, {
				label: "Contribución-Internet (Historico2)",
				property: "Vh2IntCont",
				type: "Number"
			}];
			var aVS = [{
				label: "Cantidad Sugerido",
				property: "PlanSug",
				type: "Number"
			}];
			var aVC = [{
				label: "Cantidad Corregido",
				property: "PlanCor",
				type: "Number"
			}];
			var aVR = [{
				label: "Venta Neta-Retail (Real)",
				property: "Vh3RetMonto",
				type: "Number"
			}, {
				label: "Cantidad-Retail (Real)",
				property: "Vh3RetUnid",
				type: "Number"
			}, {
				label: "Contribución-Retail (Real)",
				property: "Vh3RetCont",
				type: "Number"
			}, {
				label: "Venta neta-Mayorista (Real)",
				property: "Vh3MayMonto",
				type: "Number"
			}, {
				label: "Cantidad-Mayorista (Real)",
				property: "Vh3MayUnid",
				type: "Number"
			}, {
				label: "Contribución-Mayorista (Real)",
				property: "Vh3MayCont",
				type: "Number"
			}, {
				label: "Venta Neta-Internet (Real)",
				property: "Vh3IntMonto",
				type: "Number"
			}, {
				label: "Cantidad-Internet (Real)",
				property: "Vh3IntUnid",
				type: "Number"
			}, {
				label: "Contribución-Internet (Real)",
				property: "Vh3IntCont",
				type: "Number"
			}];
			switch (sID) {
			case "VS":
				aVH = aVH.concat(aVS);
				break;
			case "VC":
				aVH = aVH.concat(aVS, aVC);
				break;
			case "VR":
				aVH = aVH.concat(aVS, aVC);
				aVH = aVH.concat(aVR);
				break;
			}
			return aVH;
		},
		/**
		 * Odata que trae la seguridad si el usuario puede o no puede descargar los excel de plan de ventas
		 * ID Actividad | Descripción
		 *     16   	| Ingreso Plan Vta. sugerido (VS)
		 *     17   	| Ingreso Plan Vta. corregido (VC)
		 */
		getSeguridad: function (sID, sTipo, fnSuccess, sAccion) {
			//accion C consulta M modifica
			sap.ui.core.BusyIndicator.show(0);
			sTipo = sTipo === "VS" ? "16" : "17";
			this._oModelCatalogo.read(
				"/SeguridadAbastSet(IIdActividad='" + sTipo + "',IIdCatalogo='" + sID + "',IFecha='',IUsuario='',IAccion='" + sAccion + "')", {
					success: function (oResponse) {
						// oResponse.OAutoriza = "SI";
						if (oResponse.OAutoriza === "NO") {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error(oResponse.OMensaje);
						} else {
							fnSuccess();
						}
					},
					error: function (oResponse) {
						sap.ui.core.BusyIndicator.hide();
						formatter.showODataError(oResponse);
					}
				});
		},
		handleChangefileUploaderPlanVentas: function (oEvent) {
			//-------------------------INICIA SUBIDA DE EXCEL
			var sCatalogo = this.byId("input1").getValue();
			if (sCatalogo) {
				sap.ui.core.BusyIndicator.show(0);
				var that = this;
				var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
				var sTipo = oEvent.getParameter("id").search("Sugerido") > 0 ? "VS" : "VC";
				//se limpia el fileUploader para que pueda subir el mismo archivo denuevo
				this.byId("fileUploaderPlanSugerido").setValue("");
				this.byId("fileUploaderPlanCorregido").setValue("");
				var fnSuccess = function () {
					if (file && window.FileReader) {
						var reader = new FileReader(),
							data;
						reader.onload = function (e) {
							data = e.target.result;
							var wb = XLS.read(data, {
								type: "binary",
								cellDates: true,
								cellStyles: true
							});
							//se recorre el arreglo para crear el objeto ROA (array del excel)
							wb.SheetNames.forEach(function (sheetName) {
								var roa = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
								if (roa.length > 0) {
									this.validacionExcelPlanVentas(roa, sTipo, sCatalogo);
								} else {
									this.getErrorLog([{
										Mensaje: "Error: Excel sin datos"
									}]);
								}
							}.bind(that));
						}.bind(that);
						reader.readAsBinaryString(file);
					}
				};
				if (file.name.search(".xlsx") < 0) { //pregunto por la extension del archivo
					sap.m.MessageBox.error("Solo archivos Excel");
					sap.ui.core.BusyIndicator.hide();
				} else {
					this.getSeguridad(sCatalogo, sTipo, fnSuccess, "M"); //ARREGLAR ESTO, NO DEBE DE IR EL INPUT DEL SEARCH SI NO EL MODELO
				}
			} else {
				sap.m.MessageToast.show("Ingrese catalogo");
			}

		},
		validacionExcelPlanVentas: function (aData, sTipo, sCatalogo) {
			var aError = [];
			var bExit = false;
			aData.forEach(function (oData, i) {
				var sTitulo = sTipo === "VS" ? "Cantidad Sugerido" : "Cantidad Corregido";
				if (!oData["N° Catalogo"] || !oData.Parte || !oData.Tienda || !oData.Material) {
					if (!bExit) {
						aError.push({
							Mensaje: "Error: formato del Excel erroneo"
						});
						bExit = true; //salir del foreach para solo mostrar que el formato del excel es el incorrecto
					}
				} else {
					if (!bExit) {
						if (isNaN(oData[sTitulo]) && oData[sTitulo] !== undefined) { //cantidad sugerida o corregida solo puede ser numerico
							aError.push({
								Mensaje: "Error linea del Excel " + (i + 2) + ": " + sTitulo + " solo puede ser Numerico"
							});
						} else if (Number(sCatalogo) !== Number(oData["N° Catalogo"])) { //si el catalogo es diferente al catalogo dentro del excel da error
							aError.push({
								Mensaje: "Error: Catalogo incorrecto, subiendo: " + oData["N° Catalogo"] + ", seleccionado: " + sCatalogo
							});
							bExit = true; //salir del foreach para solo mostrar que el formato del excel es el incorrecto
						}
					}
				}
			});
			if (aError.length) {
				this.getErrorLog(aError);
			} else {
				this.setExcelPlanVentas(aData, sTipo, sCatalogo);
			}
		},
		setExcelPlanVentas: function (aData, sTipo, sCatalogo) {
			sap.ui.core.BusyIndicator.show(0); //busy
			var that = this;
			var oCreate = {
				Accion: "M", // C = consulta, M = Modifica
				IIdcatalogo: sCatalogo,
				IUname: "",
				Tipo: sTipo, // VS = Venta Sugerido, VC = Venta Corregido
				Pmensaje1: "",
				Pmensaje2: "",
				DeepAbastVentasTSet: []
			};
			aData.forEach(function (oData) {
				var oPush = {
					IdCatalogo: oData["N° Catalogo"],
					IdParte: oData.Parte,
					Centro: oData.Tienda,
					Matnr: oData.Material
				};
				if (sTipo === "VS") {
					oPush.PlanSug = oData["Cantidad Sugerido"];
				} else {
					oPush.PlanCor = oData["Cantidad Corregido"];
				}
				oCreate.DeepAbastVentasTSet.push(oPush);
			});
			this._oModelCatalogo.create("/DeepAbastVentasPSet", oCreate, {
				success: function (oResponse) {
					sap.ui.core.BusyIndicator.hide(); //ocultar busy
					if (oResponse.Pmensaje1 === "0") {
						sap.m.MessageToast.show("Carga completada");
					} else {
						var aError = [];
						oResponse.DeepAbastVentasTSet.results.forEach(function (oData) {
							aError.push({
								Mensaje: "Error: " + oData.Matnr + " " + oData.Mensaje
							});
						});
						that.getErrorLog(aError);
					}
				},
				error: function (oResponse) {
					sap.ui.core.BusyIndicator.hide(); //ocultar busy
					sap.m.MessageToast.show("Error al cargar");
				}
			});
		},
		getErrorLog: function (oDataError) {
			sap.ui.core.BusyIndicator.hide();
			var ModelLog = new JSONModel({
				DATA: []
			});
			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ShowError", this);
			this._Dialog.setModel(this.getView().getModel());
			this._Dialog.open(); //
			ModelLog.setProperty("/DATA", oDataError);
			this._Dialog.setModel(ModelLog, "ModelLog");
		},
		onCerrarFrag: function () {
			this._Dialog.close();
			this._Dialog.destroy();
		},
		handlePressCargaExcelPlanVenta: function () {
			var varCatalogo = this.byId("input1").getValue();
			if (varCatalogo === "" || varCatalogo === undefined) {
				sap.m.MessageToast.show("Id Catalogo Vacio");
				return;
			}
			var fnSuccess = function () {
				this.getOwnerComponent().getModel("catalogaModel").setProperty("/idCata", varCatalogo);
				this.getOwnerComponent().getTargets().display("PlanVentaCorregido");
			}.bind(this);
			this.getSeguridad(varCatalogo, "VC", fnSuccess, "M");
		},
		initContadores: function (sCatalogo) {
			var oIconTab = this.byId("IconTabPlanVentas");
			this._oModelCatalogo.read("/ConsultaUltiCargaSet('" +
				sCatalogo + "')", {
					success: function (oResponse) {
						oResponse.FechaModPl = oResponse.FechaModPl ? oResponse.FechaModPl : "N/A";
						oResponse.FechaModPm = oResponse.FechaModPm ? oResponse.FechaModPm : "N/A";
						oIconTab.setModel(new JSONModel(oResponse));
					},
					error: function (oResponse) {
						console.log(oResponse);
						debugger;
					}
				});
		},
		ocultarPlanVentas: function (sCataloga) {
			this.byId("IconTabPlanVentas").setEnabled(sCataloga === "X" ? true : false);
		}
	});
});