sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	var modeloCentros = null;
	var GrabarCentroT2Set = [];
	var vpanel0 = null;
	var vpanel1 = null;
	var vpanel2 = null;
	var oGuardar = null;//__TRVL
	var vNumCatalogo = "";
	var vValNumPromo = "";
	var vTipoAccion = "";
	var vGParte = "";
	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.CargaCentros", {

		onInit: function () {

			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CargaCentros").attachDisplay(null, this.onDisplay, this);

		},
		onDisplay: function () {
			
			var vthis = this;
			// creo modelo json para manejar los datos
			var TabSur = new JSONModel({
				DATA: []
			});
			var TabNorte = new JSONModel({
				DATA: []
			});
			var TabCentro = new JSONModel({
				DATA: []
			});

			vpanel0 = this.byId("panel0");
			vpanel1 = this.byId("panel1");
			vpanel2 = this.byId("panel2");
			oGuardar = this.byId("Guardar");

			vpanel0.setBlocked(false);
			vpanel1.setBlocked(false);
			vpanel2.setBlocked(false);

			// accedo a las variables  del core (N° catalogo)
			vNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");

			// Numero de promo
			vValNumPromo = sap.ui.getCore().getModel("vValNumPromo");
			// accedo a la variable  tipo de accion 
			vTipoAccion = sap.ui.getCore().getModel("vTipoAccion");
			// N° de parte 
			vGParte = sap.ui.getCore().getModel("vGParte"); 
			
			// fecha de vigencia de la promoción
			//vFehaPromoVigencia = sap.ui.getCore().getModel("globalFechaPromo");

			// muestra numero del catalogo en pantalla
			var vTextCatalogo = vthis.byId("lbNumCatalogo");
			vTextCatalogo.setText(vNumCatalogo);

			// muestra el numero de la promo en pantalla
			var vNumpromo = vthis.byId("lbNumPromo");
			vNumpromo.setText(vValNumPromo);

			modeloCentros = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			modeloCentros.setUseBatch(false); // se puede desactivar el uso de batch

			/////*****//////******
			//var modeloCabecera = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGS_TEST_IH1_SRV");
			//modeloCabecera.setUseBatch(false); // se puede desactivar el uso de batch

			// Parámetros (Agrega filtros a la consulta)******                
			//var oFilters = [];

			////*******/////******

			// Función de éxito
			function fSuccess(oEvent) {

				// recorre tabla
				for (var i = 0; i < oEvent.results.length; i++) {

					// llena tabla en Zona Norte 
					if (oEvent.results[i].Zona === "1") {
						TabNorte.oData.DATA.push(oEvent.results[i]);
					}

					// llena tabla en Zona Centro 
					if (oEvent.results[i].Zona === "2") {
						TabCentro.oData.DATA.push(oEvent.results[i]);
					}

					// llena tabla en Zona Centro 
					if (oEvent.results[i].Zona === "3") {
						TabSur.oData.DATA.push(oEvent.results[i]);
					}

				}
				// asignar el modelo a la vista Norte
				vthis.getView().setModel(TabNorte, "TabNorte");
				// asignar el modelo a la vista Centro
				vthis.getView().setModel(TabCentro, "TabCentro");
				// asignar el modelo a la vista Centro
				vthis.getView().setModel(TabSur, "TabSur");

				//selecciona los registros marcados Para Seccion NOrte
				for (var j = 0; j < TabNorte.oData.DATA.length; j++) {
					if (TabNorte.oData.DATA[j].Marca === "X") {
						var listN = vthis.byId("table0");
						listN.setSelectedItem(listN.getItems()[j], true /*selected*/ , true /*fire event*/ );
					}
				}
				//selecciona los registros marcados Para Seccion Centro
				for (var j = 0; j < TabCentro.oData.DATA.length; j++) {
					if (TabCentro.oData.DATA[j].Marca === "X") {
						var listC = vthis.byId("table1");
						listC.setSelectedItem(listC.getItems()[j], true /*selected*/ , true /*fire event*/ );
					}
				}
				//selecciona los registros marcados Para Seccion Sur
				for (var j = 0; j < TabSur.oData.DATA.length; j++) {
					if (TabSur.oData.DATA[j].Marca === "X") {
						var listS = vthis.byId("table2");
						listS.setSelectedItem(listS.getItems()[j], true /*selected*/ , true /*fire event*/ );
					}
				}
				
				//Desbloquea paneles  fin de la busqueda
				vpanel0.setBusy(false);
				debugger;
				if (vTipoAccion === "C") {
					vpanel0.setBlocked(true);
					vpanel1.setBlocked(true);
					vpanel2.setBlocked(true);
					oGuardar.setVisible(true);
				} else if(sap.ui.getCore().getModel("vValOrigen") !== "Promo"){ //__TRVL
					vpanel0.setBlocked(true);
					vpanel1.setBlocked(true);
					vpanel2.setBlocked(true);
					oGuardar.setVisible(true);
				} else {
					vpanel0.setBlocked(false);
					vpanel1.setBlocked(false);
					vpanel2.setBlocked(false);
					oGuardar.setVisible(true);
				}
			}

			// Función de error
			function fError(oEvent) {

				sap.m.MessageToast.show("Error al cargar datos");
				vpanel0.setBusy(false);
				vpanel1.setBlocked(false);
				vpanel2.setBlocked(false);

				if (vTipoAccion === "C") {
					vpanel0.setBlocked(true);
					vpanel1.setBlocked(true);
					vpanel2.setBlocked(true);
				} else {
					vpanel0.setBlocked(false);
					vpanel1.setBlocked(false);
					vpanel2.setBlocked(false);
				}
			}

			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;
			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Pcatalogo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vNumCatalogo
			});
			oFilters.push(filter);
			//Id Promocion
			
			if (vValNumPromo !== undefined) {
				filter = new sap.ui.model.Filter({
					path: "PPromo",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: vValNumPromo
				});
				oFilters.push(filter);
			}

			// consulta centros
			modeloCentros.read("/ConsultaZonaCentroSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

			vpanel1.setBlocked(true);
			vpanel2.setBlocked(true);
			vpanel0.setBusy(true);

		},
		onBack: function () {

			this.getOwnerComponent().getTargets().display("ZNuevaPromo");
			//this.getOwnerComponent().getTargets().display("CatalogoMain");
		},

		onClick: function () {
			var vthis = this;
			var vValStado = sap.ui.getCore().getModel("vValStado"); 
			
			var sCentroSel = this.getView().byId("table0").getSelectedItems().length;
			var sCentroSel1 = this.getView().byId("table1").getSelectedItems().length;
			var sCentroSel2 = this.getView().byId("table2").getSelectedItems().length;
			
			if(sCentroSel === 0 && sCentroSel1 === 0 && sCentroSel2 === 0){
				sap.m.MessageBox.warning("Debe tener al menos un centro seleccionado.");
				return;
			}
	
			var ofilterCab = {
				"Idcatalogo": "",
				"Check1": "",
				"Idpromo": "",
				"Idparte": vGParte,
				"Nompromo": "",
				"Omitircyp": "",
				"Omitirpangui": "",
				"Fechadesde": "",
				"Fechahasta": "",
				"Estado": "",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"Idcatalogos": "",
				"Idpromos": "",
				"Idpartes": "",
				"Nompromos": "",
				"Omitircyps": "",
				"Omitirpanguis": "",
				"Fechadesdes": "",
				"Fechahastas": "",
				"Fechacreas": "",
				"Horacreas": "",
				"Estados": vValStado
			};
			// asigna valores
			ofilterCab.Idcatalogo = vNumCatalogo; // ID catalog
			ofilterCab.Idpromo = vValNumPromo; // Id Promo

			if (vTipoAccion === "I" && vValNumPromo !== undefined) {
				vTipoAccion = "M";
			}

			ofilterCab.Check1 = vTipoAccion; // accion

			var vImputNomPromo = sap.ui.getCore().getModel("globalNomPromo");
			ofilterCab.Nompromo = vImputNomPromo; // nombre de la promocion 

			var vOmitirCampa = sap.ui.getCore().getModel("globalOmitirCam");
			if (vOmitirCampa === true) {
				ofilterCab.Omitircyp = "X"; // Omitir campaña
			} else {
				ofilterCab.Omitircyp = "";
			}

			var vOmitirPangi = sap.ui.getCore().getModel("globalOmitirPan");

			if (vOmitirPangi === true) {
				ofilterCab.Omitirpangui = "X"; // Omitir campaña
			} else {
				ofilterCab.Omitirpangui = "";
			}

			//ofilterCab.Omitirpangui = vOmitirPangi // Omitir campaña

			// recupera fecha de vigencia (desde - hasta)
			var VfechaDesde = sap.ui.getCore().getModel("GFechaPromoVD");
			var VfechaHasta = sap.ui.getCore().getModel("GFechaPromoVH");

			ofilterCab.Fechadesde = VfechaDesde;
			ofilterCab.Fechahasta = VfechaHasta;

			// Función de éxito
			function fSuccess1(oEvent) {
				
				

				// Muestra el N° de promo en pantalla
				var vNumpromo = vthis.byId("lbNumPromo");
				vNumpromo.setText(oEvent.Idpromos);
				//asigno a variable al core
				vValNumPromo = oEvent.Idpromos;
				sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");
				
				//optiene el numero de parte 
				
				if (vGParte === undefined || vGParte === ""){
				vGParte = oEvent.Idpartes;
				sap.ui.getCore().setModel(vGParte, "vGParte");
				}

				//Graba cabecera de la promocion
				vthis.GrabarCentros();

			}

			function fError1(oEvent) {
				

				vpanel0.setBusy(false);
				vpanel1.setBlocked(false);
				vpanel2.setBlocked(false);
				sap.m.MessageToast.show("Error al grabar Data");

			}

			// consulta centros
			
			
			modeloCentros.create("/GraConCabeceraPromoSet", ofilterCab, {
				success: fSuccess1,
				error: fError1

			});
			vpanel0.setBusy(true);
			vpanel1.setBlocked(true);
			vpanel2.setBlocked(true);

			//****************************************************************
			//***************************************************************

		},

		GrabarCentros: function (vNumPromo) {

			
			var oEntrada = {
				"IdCatalogo": "",
				"Pmensaje1": "",
				"PMensaje2": "",
				"GrabarCentroT2Set": []

			};

			var vthis = this;
			// toma el  valor de las tablas 
			var vTable0 = this.getView().byId("table0");
			var vTable1 = this.getView().byId("table1");
			var vTable2 = this.getView().byId("table2");

			// tomo valor de los registros seleccionados Norte

			var rowItems0 = vTable0.getSelectedItems();
			
			GrabarCentroT2Set = [];
			// pasa valores a llenar tabla principal
			this.llenarTab(rowItems0, "1");
			// tomo valor de los registros seleccionados Centro
			var rowItems1 = vTable1.getSelectedItems();
			// pasa valores a llenar tabla principal
			this.llenarTab(rowItems1, "2");
			// tomo valor de los registros seleccionados SUR
			var rowItems2 = vTable2.getSelectedItems();
			// pasa valores a llenar tabla principal
			this.llenarTab(rowItems2, "3");

			//llena archivo para envio al servicio 
			oEntrada.IdCatalogo = vNumCatalogo;
			oEntrada.Pmensaje1 = "1";

			oEntrada.GrabarCentroT2Set = GrabarCentroT2Set;

			//evento llamado exitoso 
			function fSuccess(oEvent) {

				vpanel0.setBusy(false);
				//vpanel1.setBlocked(false);
				//vpanel2.setBlocked(false);
				sap.m.MessageToast.show("Registro Guardado");
			}

			function fError(oEvent) {

				vpanel0.setBusy(false);
				//vpanel1.setBlocked(false);
				//vpanel2.setBlocked(false);
				sap.m.MessageToast.show("Error al grabar Data");

			}
			
			modeloCentros.create("/GrabarCentroH2Set", oEntrada, {
				success: fSuccess,
				error: fError
			});

		},

		llenarTab: function (Tab, zona) {
			
			
			// Recorro los itens seleccionado en tabla 
			for (var i = 0; i < Tab.length; i++) {
				//selecciono celda
				var item = Tab[i];
				// tomo valor de la celda
				var Cells = item.getCells();

				var oReg1 = {
					"Zona": zona,
					"Centro": Cells[0].getText(), //Centro
					"Name1": Cells[1].getText(), //Nombre
					"IdPromot": vValNumPromo,
					"Idcatalogot": vNumCatalogo,
					"Marca": "X"

				};
				// ingresa registro selecionados a tabla temporal 
				GrabarCentroT2Set.push(oReg1);

			}

		}

	});

});