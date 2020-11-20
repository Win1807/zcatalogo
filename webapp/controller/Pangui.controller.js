sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	var vImputNomPromo = "";
	var VNumPromo = "";
	var vNumCatalogo = "";
	var vGParte = "";
	var vSeletTipoPromo = "";

	var vTipoPack = "";
	var vTipdoBene = "";
	var vTipoGrupo = "";
	var vCondicion1 = "";
	var vCondicion2 = "";
	var vCondicion3 = "";
	var vFormaPago1 = "";
	var vFormaPago2 = "";
	var vFormaPago3 = "";
	var vPrecioPack1 = "";
	var vPrecioPack2 = "";
	var vPrecioPack3 = "";
	var vLleva = "";
	var vUnidades1 = "";
	var vUnidades2 = "";
	var vUnidades3 = "";
	var vDescuento1 = "";
	var vDescuento2 = "";
	var vDescuento3 = "";
	var vPaga = "";
	var vLleva2 = "";
	var vPaga2 = "";
	var vLleva3 = "";
	var vPaga3 = "";
	var vTipoAccionPangui = "";
	var vResullPangui = "";
	var vPromoG = "";
	var vtxtUnidades = "";
	var vtxtUnidades2 = "";
	var vtxtUnidades3 = "";
	var vDescripcion = "";
	var vObservacion = "";

	var serviceUrl = "";
	var modeloServicio = "";
	var bDialog = new sap.m.BusyDialog();

	var TabSku = new JSONModel({
		DATA: []
	});
	var TabDisplay = [];
	var vDetPan = [];

	var vTotalG1 = "";
	var vTotalG2 = "";
	var vTotalG3 = "";
	var vSeletTipo = "";
	var vGrbarButtonF = "";

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.Pangui", {

		onInit: function () {
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Pangui").attachDisplay(null, this.onDisplay, this);

		},

		onDisplay: function () {

			// Se crea el modelo DEL SERVICIO
			serviceUrl = "/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV";
			modeloServicio = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			modeloServicio.setUseBatch(false); // se desactiva el uso de batch

			// accedo a las variables  del core
			vNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo"); // numero de catalo
			vImputNomPromo = sap.ui.getCore().getModel("vImputNomPromo"); //nombre de la promo
			VNumPromo = sap.ui.getCore().getModel("vValNumPromo"); // numero de promo 

			vTipoAccionPangui = sap.ui.getCore().getModel("vTipoAccionPangui"); // Tipo de acción

			vGParte = sap.ui.getCore().getModel("vGParte"); // N° de parte 

			// recupero datos del core (Pangui)

			vResullPangui = sap.ui.getCore().getModel("vResullPangui");

			var NombrePromocion = "PROMOCIÓN: " + vImputNomPromo;

			var vHeaderP = this.getView().byId("idHeaderP");
			var vObjectNumPromo = this.getView().byId("idObjectNumPromo");
			vSeletTipoPromo = this.getView().byId("idSeletTipoPromo");
			vObservacion = this.getView().byId("idObservacion");

			vTipoPack = this.getView().byId("idTipoPack");
			vTipdoBene = this.getView().byId("idTipoBene");
			vTipoGrupo = this.getView().byId("idTipoGrupo");
			vCondicion1 = this.getView().byId("idCondicion1");
			vCondicion2 = this.getView().byId("idCondicion2");
			vCondicion3 = this.getView().byId("idCondicion3");
			vFormaPago1 = this.getView().byId("idFormaPago1");
			vFormaPago2 = this.getView().byId("idFormaPago2");
			vFormaPago3 = this.getView().byId("idFormaPago3");
			vPrecioPack1 = this.getView().byId("idPrecioPack1");
			vPrecioPack2 = this.getView().byId("idPrecioPack2");
			vPrecioPack3 = this.getView().byId("idPrecioPack3");
			vDescripcion = this.getView().byId("idDescripcion");
			vObservacion = this.getView().byId("idObservacion");

			vtxtUnidades = this.getView().byId("idtxtUnidades");
			vtxtUnidades2 = this.getView().byId("idtxtUnidades2");
			vtxtUnidades3 = this.getView().byId("idtxtUnidades3");

			vLleva = this.getView().byId("idLleva");
			vUnidades1 = this.getView().byId("idUnidades1");
			vUnidades2 = this.getView().byId("idUnidades2");
			vUnidades3 = this.getView().byId("idUnidades3");
			vDescuento1 = this.getView().byId("idDescuento1");
			vDescuento2 = this.getView().byId("idDescuento2");
			vDescuento3 = this.getView().byId("idDescuento3");
			vPaga = this.getView().byId("idPaga");
			
			vLleva2 = this.getView().byId("idLleva2");
			vPaga2 = this.getView().byId("idPaga2");
			vLleva3 = this.getView().byId("idLleva3");
			vPaga3 = this.getView().byId("idPaga3");
			

			vTotalG1 = this.getView().byId("idTotalG1");
			vTotalG2 = this.getView().byId("idTotalG2");
			vTotalG3 = this.getView().byId("idTotalG3");

			vHeaderP.setObjectTitle(NombrePromocion);
			vObjectNumPromo.setText(VNumPromo);

			this.crearModelo();

			this.getPromoPangui();

			//this.getCombosPangui();
			//
			//this.MostrarData();

			//this.onBuscarPangui();

		},
		iniciarCampos: function () {

			//inicializa los campos 
			vSeletTipoPromo.setSelectedKey("1");

			if (vTipoPack.getVisible() === true) {
				vTipoPack.setSelectedKey("1");
			}
			if (vTipdoBene.getVisible() === true) {
				vTipdoBene.setSelectedKey("1");
			}
			if (vTipoGrupo.getVisible() === true) {
				vTipoGrupo.setSelectedKey("1");
			}
			if (vCondicion1.getVisible() === true) {
				vCondicion1.setSelectedKey("1");
			}
			if (vCondicion2.getVisible() === true) {
				vCondicion2.setSelectedKey("1");
			}
			if (vCondicion3.getVisible() === true) {
				vCondicion3.setSelectedKey("1");
			}
			if (vFormaPago1.getVisible() === true) {
				vFormaPago1.setSelectedKey("1");
			}
			if (vFormaPago2.getVisible() === true) {
				vFormaPago2.setSelectedKey("1");
			}
			if (vFormaPago3.getVisible() === true) {
				vFormaPago3.setSelectedKey("1");
			}
			if (vPrecioPack1.getVisible() === true) {
				vPrecioPack1.setValue("");
			}
			if (vPrecioPack2.getVisible() === true) {
				vPrecioPack2.setValue("");
			}
			if (vPrecioPack3.getVisible() === true) {
				vPrecioPack3.setValue("");
			}
			if (vLleva.getVisible() === true) {
				vLleva.setValue("");
			}
			if (vUnidades1.getVisible() === true) {
				vUnidades1.setValue("");
			}
			if (vUnidades2.getVisible() === true) {
				vUnidades2.setValue("");
			}
			if (vUnidades3.getVisible() === true) {
				vUnidades3.setValue("");
			}
			if (vDescuento1.getVisible() === true) {
				vDescuento1.setValue("");
			}
			if (vDescuento2.getVisible() === true) {
				vDescuento2.setValue("");
			}
			if (vDescuento3.getVisible() === true) {
				vDescuento3.setValue("");
			}

			if (vPaga.getVisible() === true) {
				vPaga.setValue("");
			}
			
			
			if (vLleva2.getVisible() === true) {
				vLleva2.setValue("");
			}
			if (vPaga2.getVisible() === true) {
				vPaga2.setValue("");
			}
			if (vLleva3.getVisible() === true) {
				vLleva3.setValue("");
			}
			if (vPaga3.getVisible() === true) {
				vPaga3.setValue("");
			}
			
			
			if (vDescripcion.getVisible() === true) {
				vDescripcion.setValue("");
			}
			if (vObservacion.getVisible() === true) {
				vObservacion.setValue("");
			}

			if (vTotalG1.getVisible() === true) {
				vTotalG1.setValue("0");
			}
			if (vTotalG2.getVisible() === true) {
				vTotalG2.setValue("0");
			}
			if (vTotalG3.getVisible() === true) {
				vTotalG3.setValue("0");
			}

			//limpia tabla de sku Fragment
			TabDisplay = [];
			TabSku.setProperty("/DATA", TabDisplay);
			// asignar el modelo a la vista
			this.getView().setModel(TabSku, "TabSku");

			//

			var modelo = this._modelo;
			var promo = [];
			modelo.setProperty("/PromoPanguiSel", promo);

		},

		crearModelo: function () {
			var modelo = new JSONModel();

			// se asigna modelo al core global
			sap.ui.getCore().setModel(modelo, "modeloGlobal");

			// se asigna el modelo a variable global de vista
			this._modelo = modelo;

			// se asigna el modelo a la vista
			this.getView().setModel(modelo);

			// se inician estructuras
			modelo.setProperty("/PromoPangui", []); // lista promo pangui
			modelo.setProperty("/PromoPanguiSel", {}); // promo pangui seleccionada

		},

		getPromoPangui: function () {

			var modelo = this._modelo;
			var that = this;

			//var bDialog = new sap.m.BusyDialog();
			bDialog.open();

			// Se crea el modelo DEL SERVICIO
			//var serviceUrl = "/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV";
			//var modeloServicio = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			//modeloServicio.setUseBatch(false); // se desactiva el uso de batch

			// Función de éxito
			function fSuccess(oEvent) {
				bDialog.close();

				var promo = oEvent.results;
				vPromoG = oEvent.results;
				console.log(promo);
				modelo.setProperty("/PromoPangui", promo);

				//asigna el modelo dependiendo del tipo de promoccion seleccionada
				var num1 = 0;

				if (vResullPangui === undefined) {
					modelo.setProperty("/PromoPanguiSel", promo[0]);
				} else {

					if (vResullPangui.TipoPromoP !== null) {
						for (var i = 0; i < vPromoG.length; i++) {
							if (vResullPangui.TipoPromoP === promo[i].TipoPromoP) {
								num1 = i;
							}

						}
					}
					modelo.setProperty("/PromoPanguiSel", promo[num1]); // promo pangui seleccionada
				}

				that.getCombosPangui();

				//var pedidos = oEvent.results;
				//modelo.setProperty("/ListaPedidos", pedidos);	// Lista pedidos por procesar

			}
			// Función de error
			function fError() {
				bDialog.close();
			}

			modeloServicio.read("/ListadoPromoPanguiSet", {
				success: fSuccess,
				error: fError
			});
		},

		getCombosPangui: function () {

			var modelo = this._modelo;
			var that = this;

			var bDialog = new sap.m.BusyDialog();
			bDialog.open();

			// Se crea el modelo DEL SERVICIO
			var serviceUrl = "/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV";
			var modeloServicio = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			modeloServicio.setUseBatch(false); // se desactiva el uso de batch

			// Función de éxito
			function fSuccess(oEvent) {

				bDialog.close();

				var resp = oEvent.results[0];

				var combos = {};
				combos.BenefGrupo = resp.ExpandPanguiBgrSet.results;
				combos.TipoBenef = resp.ExpandPanguiBnfSet.results;
				combos.FormaPago = resp.ExpandPanguiFpgSet.results;
				combos.TipoPack = resp.ExpandPanguiPacSet.results;
				combos.GrupoDesc = resp.ExpandPanguiTdeSet.results;
				combos.TipoIngreso = resp.ExpandPanguiTinSet.results;
				combos.TipoCondicion = resp.ExpandPanguiTcnSet.results;

				console.log("combos pangui");
				console.log(combos);

				modelo.setProperty("/CombosPangui", combos);

				//Asigna información para , Consulta, Modicficación o visualizacion 
				if (vTipoAccionPangui !== "I") {
					//	if (vResullPangui !== null) {
					//that.onBuscarPangui();	
					that.MostrarData();

					//	}
				}

			}
			// Función de error
			function fError() {

				bDialog.close();

			}

			var expandParam = "ExpandPanguiBnfSet,ExpandPanguiFpgSet,ExpandPanguiBgrSet," +
				"ExpandPanguiPacSet,ExpandPanguiTinSet,ExpandPanguiTdeSet,ExpandPanguiTcnSet";

			modeloServicio.read("/ExpandPanguiSet", {
				success: fSuccess,
				error: fError,
				urlParameters: {
					"$expand": expandParam
				}
			});
		},

		onVerCodigos: function (evt) {
			if (!this._dialogCodigos) {
				this._dialogCodigos = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.IngresoCodigos", this);
				this.getView().addDependent(this._dialogCodigos);
			}
			this._dialogCodigos.open();

			//determina boton seleccionado 
			var vLengt = evt.getSource().getId().length - 8;
			var vBotonSelect = evt.getSource().getId().substr(vLengt);
			vSeletTipo = "";
			if (vBotonSelect === "idGeneT1") {
				vSeletTipo = "1";
			}
			if (vBotonSelect === "idGeneT2") {
				vSeletTipo = "2";
			}
			if (vBotonSelect === "idGeneT3") {
				vSeletTipo = "3";
			}

			//busca lista de Sku dependiendo del grupo seleccionado
			this.BuscarListSku(vSeletTipo);

		},

		BuscarListSku: function (vSeletTipo) {
			
			var that = this;
			var oEntrada = {
				"Check1": "C",
				"IdCatalogo": vNumCatalogo,
				"IdPromo": VNumPromo,
				"IdParte": vGParte,
				"PanguiDetpanSet": [],
				"PanguiDetsalSet": []
			};

			function fSuccess(oEvent) {
				
				TabDisplay = [];
				if (oEvent.PanguiDetsalSet !== null) {
					if (oEvent.PanguiDetsalSet.results.length > 0) {

						for (var i = 0; i < oEvent.PanguiDetsalSet.results.length; i++) {
							//selecciona los registros dependiendo del grupo seleccionado
							if (oEvent.PanguiDetsalSet.results[i].TipoTde === vSeletTipo) {
								var SKU = {
									Idposnr: oEvent.PanguiDetsalSet.results[i].IdPosnr,
									IdSku: oEvent.PanguiDetsalSet.results[i].IdCodigo,
									NomSku: oEvent.PanguiDetsalSet.results[i].IdDescrip
								};

								TabDisplay.push(SKU);
							}
						}

					}

				}
				// asignar el modelo a la vista
				TabSku.setProperty("/DATA", TabDisplay);
				that.getView().setModel(TabSku, "TabSku");
			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al buscar Data");

			}

			modeloServicio.create("/PanguiSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

		},

		cerrarDialogCodigos: function (evt) {
			//refresca los tipos de ingresos

			var vTotalRegSku = sap.ui.getCore().byId("idTableSku");
			var vTotalRegSkuString = vTotalRegSku.getModel("TabSku").getData().DATA.length.toString();
			if (vSeletTipo === "1") {
				vTotalG1.setValue(vTotalRegSkuString);
			}
			if (vSeletTipo === "2") {
				vTotalG2.setValue(vTotalRegSkuString);
			}
			if (vSeletTipo === "3") {
				vTotalG3.setValue(vTotalRegSkuString);
			}

			this._dialogCodigos.close();
			this._dialogCodigos.destroy();
			this._dialogCodigos = null;
		},

		handleAddCodigos: function () {

		},

		onCambiarPromo: function (e) {

			var item = e.getParameters().selectedItem;
			var promoSel = item.getBindingContext().getObject();

			var modelo = this._modelo;
			modelo.setProperty("/PromoPanguiSel", promoSel); // promo pangui seleccionada

		},
		onCambiarCondi: function (e) {
			var item = e.getParameters().selectedItem;
			var condiSel = item.getBindingContext().getObject();

			if (condiSel.TipoCond === "1") {
				vtxtUnidades.setText("Unidades de la Condición");
			}
			if (condiSel.TipoCond === "2") {
				vtxtUnidades.setText("Pesos de la Condición");
			}

			if (condiSel.TipoCond3 === "1") {
				vtxtUnidades3.setText("Unidades grupo 3");
			}
			if (condiSel.TipoCond3 === "2") {
				vtxtUnidades3.setText("Pesos grupo 3");
			}

		},
		onCambiarCondi2: function (e) {

			var item = e.getParameters().selectedItem;
			var condiSel = item.getBindingContext().getObject();

			if (condiSel.TipoCond === "1") {
				vtxtUnidades2.setText("Unidades grupo 2");
			}
			if (condiSel.TipoCond === "2") {
				vtxtUnidades2.setText("Pesos grupo 2");
			}

		},
		onCambiarCondi3: function (e) {

			var item = e.getParameters().selectedItem;
			var condiSel = item.getBindingContext().getObject();

			if (condiSel.TipoCond === "1") {
				vtxtUnidades3.setText("Unidades grupo 3");
			}
			if (condiSel.TipoCond === "2") {
				vtxtUnidades3.setText("Pesos grupo 3");
			}

		},

		onBack: function () {
			this.iniciarCampos();
			// asigno al core la accion para pangui
			sap.ui.getCore().setModel(vTipoAccionPangui, "vTipoAccionPangui");
			vResullPangui = "";
			sap.ui.getCore().setModel(vResullPangui, "vResullPangui");
			
			this.getOwnerComponent().getTargets().display("ZNuevaPromo");
			

		},

		onBuscarPangui: function () {

			var that = this;
			var oEntrada = {
				"Check1": "C",
				"IdCatalogo": vNumCatalogo,
				"IdPromo": VNumPromo,
				"IdParte": vGParte,
				"PanguiDetpanSet": [],
				"PanguiDetsalSet": []
			};

			function fSuccess(oEvent) {

				//vSeletTipoPromo.setSelectedKey(oEvent.TipoPromoP);
				that.MostrarData();

			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al buscar Data");

			}

			modeloServicio.create("/PanguiSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

			//aqui

		},

		MostrarData: function () {

			var Select = "";

			for (var i = 0; i < vPromoG.length; i++) {
				if (vResullPangui.TipoPromoP === vPromoG[i].TipoPromoP) {
					Select = vPromoG[i];
				}
			}
			//Muestra el total de registros Cargados
			var vTG1 = "0";
			var vTG2 = "0";
			var vTG3 = "0";
			//suma el tota l de registros de (ingreso de codigo)
			if (vResullPangui.PanguiDetsalSet !== null) {
				for (var j = 0; j < vResullPangui.PanguiDetsalSet.results.length; j++) {
					switch (vResullPangui.PanguiDetsalSet.results[j].TipoTde) {
					case "1":
						vTG1++;
						break;
					case "2":
						vTG2++;
						break;
					case "3":
						vTG3++;
						break;
					default:

					}

				}
			}

			var vGeneT1 = this.getView().byId("idGeneT1").getVisible();
			if (vGeneT1 === true) {
				var vTotalG1 = this.getView().byId("idTotalG1");
				vTotalG1.setValue(vTG1);
			}
			var vGeneT2 = this.getView().byId("idGeneT2").getVisible();
			if (vGeneT2 === true) {
				var vTotalG2 = this.getView().byId("idTotalG2");
				vTotalG2.setValue(vTG2);
			}
			var vGeneT3 = this.getView().byId("idGeneT3").getVisible();
			if (vGeneT3 === true) {
				var vTotalG3 = this.getView().byId("idTotalG3");
				vTotalG3.setValue(vTG3);
			}

			var modelo = this._modelo;
			modelo.setProperty("/PromoPanguiSel", Select); // promo pangui seleccionada

			vSeletTipoPromo.setSelectedKey(Select.TipoPromoP);

			//asigna valor a los campos 
			if (vTipoPack.getVisible() === true) {
				vTipoPack.setSelectedKey(vResullPangui.TipoPack);
			}
			if (vTipdoBene.getVisible() === true) {
				vTipdoBene.setSelectedKey(vResullPangui.TipoBenef);
			}
			if (vTipoGrupo.getVisible() === true) {
				vTipoGrupo.setSelectedKey(vResullPangui.TipoBgrupo);
			}
			if (vCondicion1.getVisible() === true) {
				vCondicion1.setSelectedKey(vResullPangui.TipoCond);

				// dependiendo de la condicion cambia el text del label unidades
				if (vResullPangui.TipoCond === "1") {
					vtxtUnidades.setText("Unidades de la Condición");
				}
				if (vResullPangui.TipoCond === "2") {
					vtxtUnidades.setText("Pesos de la Condición");
				}

			}
			if (vCondicion2.getVisible() === true) {
				vCondicion2.setSelectedKey(vResullPangui.TipoCond2);

				if (vResullPangui.TipoCond2 === "1") {
					vtxtUnidades2.setText("Unidades grupo 2");
				}
				if (vResullPangui.TipoCond2 === "2") {
					vtxtUnidades2.setText("Pesos grupo 2");
				}

			}
			if (vCondicion3.getVisible() === true) {
				vCondicion3.setSelectedKey(vResullPangui.TipoCond3);

				if (vResullPangui.TipoCond3 === "1") {
					vtxtUnidades3.setText("Unidades grupo 3");
				}
				if (vResullPangui.TipoCond3 === "2") {
					vtxtUnidades3.setText("Pesos grupo 3");
				}
			}
			if (vFormaPago1.getVisible() === true) {
				vFormaPago1.setSelectedKey(vResullPangui.Fpago1);
			}
			if (vFormaPago2.getVisible() === true) {
				vFormaPago2.setSelectedKey(vResullPangui.Fpago2);
			}
			if (vFormaPago3.getVisible() === true) {
				vFormaPago3.setSelectedKey(vResullPangui.Fpago3);
			}
			if (vPrecioPack1.getVisible() === true) {
				vPrecioPack1.setValue(vResullPangui.PrecioP1);
			}
			if (vPrecioPack2.getVisible() === true) {
				vPrecioPack2.setValue(vResullPangui.PrecioP2);
			}
			if (vPrecioPack3.getVisible() === true) {
				vPrecioPack3.setValue(vResullPangui.PrecioP3);
			}
			if (vLleva.getVisible() === true) {
				vLleva.setValue(vResullPangui.Lleva);
			}
			if (vUnidades1.getVisible() === true) {
				vUnidades1.setValue(vResullPangui.UnidCond);
			}
			if (vUnidades2.getVisible() === true) {
				vUnidades2.setValue(vResullPangui.UnidCond2);
			}
			if (vUnidades3.getVisible() === true) {
				vUnidades3.setValue(vResullPangui.UnidCond3);
			}
			if (vDescuento1.getVisible() === true) {
				vDescuento1.setValue(vResullPangui.Descto1);
			}
			if (vDescuento2.getVisible() === true) {
				vDescuento2.setValue(vResullPangui.Descto2);
			}
			if (vDescuento3.getVisible() === true) {
				vDescuento3.setValue(vResullPangui.Descto3);
			}

			if (vPaga.getVisible() === true) {
				vPaga.setValue(vResullPangui.Paga);
			}
			
			if (vLleva2.getVisible() === true) {
				vLleva2.setValue(vResullPangui.Lleva2);
			}
			if (vPaga2.getVisible() === true) {
				vPaga2.setValue(vResullPangui.Paga2);
			}
			if (vLleva3.getVisible() === true) {
				vLleva3.setValue(vResullPangui.Lleva3);
			}
			if (vPaga3.getVisible() === true) {
				vPaga3.setValue(vResullPangui.Paga3);
			}
			
			
			
			if (vDescripcion.getVisible() === true) {
				vDescripcion.setValue(vResullPangui.Descrip);
			}
			if (vObservacion.getVisible() === true) {
				vObservacion.setValue(vResullPangui.Observ);
			}

		},

		onGrabar: function () {
			//selecciona  los valores de la pantalla
			var valSeletTipoPromo = vSeletTipoPromo.getSelectedKey();

			var valTipoPack = "";
			var valTipdoBene = "";
			var valTipoGrupo = "";
			var valCondicion1 = "";
			var valCondicion2 = "";
			var valCondicion3 = "";
			var valFormaPago1 = "";
			var valFormaPago2 = "";
			var valFormaPago3 = "";
			var valPrecioPack1 = "";
			var valPrecioPack2 = "";
			var valPrecioPack3 = "";
			var valLleva = "";
			var valUnidades1 = "";
			var valUnidades2 = "";
			var valUnidades3 = "";
			var valDescuento1 = "";
			var valDescuento2 = "";
			var valDescuento3 = "";
			var valPaga = "";
			var valLleva2 = "";
			var valPaga2 = "";
			var valLleva3 = "";
			var valPaga3 = "";
			var valDescripcion = "";
			var valObservacion = "";

			if (vTipoPack.getVisible() === true) {
				valTipoPack = vTipoPack.getSelectedKey();
			}
			if (vTipdoBene.getVisible() === true) {
				valTipdoBene = vTipdoBene.getSelectedKey();
			}
			if (vTipoGrupo.getVisible() === true) {
				valTipoGrupo = vTipoGrupo.getSelectedKey();
			}
			if (vCondicion1.getVisible() === true) {
				valCondicion1 = vCondicion1.getSelectedKey();
			}
			if (vCondicion2.getVisible() === true) {
				valCondicion2 = vCondicion2.getSelectedKey();
			}
			if (vCondicion3.getVisible() === true) {
				valCondicion3 = vCondicion3.getSelectedKey();
			}
			if (vFormaPago1.getVisible() === true) {
				valFormaPago1 = vFormaPago1.getSelectedKey();
			}
			if (vFormaPago2.getVisible() === true) {
				valFormaPago2 = vFormaPago2.getSelectedKey();
			}
			if (vFormaPago3.getVisible() === true) {
				valFormaPago3 = vFormaPago3.getSelectedKey();
			}
			if (vPrecioPack1.getVisible() === true) {
				valPrecioPack1 = vPrecioPack1.getValue();
			}
			if (vPrecioPack2.getVisible() === true) {
				valPrecioPack2 = vPrecioPack2.getValue();
			}
			if (vPrecioPack3.getVisible() === true) {
				valPrecioPack3 = vPrecioPack3.getValue();
			}
			if (vLleva.getVisible() === true) {
				valLleva = vLleva.getValue();
			}

			if (vUnidades1.getVisible() === true) {
				valUnidades1 = vUnidades1.getValue();
			}
			if (vUnidades2.getVisible() === true) {
				valUnidades2 = vUnidades2.getValue();
			}
			if (vUnidades3.getVisible() === true) {
				valUnidades3 = vUnidades3.getValue();
			}
			if (vDescuento1.getVisible() === true) {
				valDescuento1 = vDescuento1.getValue();
			}
			if (vDescuento2.getVisible() === true) {
				valDescuento2 = vDescuento2.getValue();
			}
			if (vDescuento3.getVisible() === true) {
				valDescuento3 = vDescuento3.getValue();
			}
			if (vPaga.getVisible() === true) {
				valPaga = vPaga.getValue();
			}
			
			if (vLleva2.getVisible() === true) {
				valLleva2 = vLleva2.getValue();
			}
			if (vPaga2.getVisible() === true) {
				valPaga2 = vPaga2.getValue();
			}
			if (vLleva3.getVisible() === true) {
				valLleva3 = vLleva3.getValue();
			}
			if (vPaga2.getVisible() === true) {
				valPaga3 = vPaga3.getValue();
			}
			
			
			if (vDescripcion.getVisible() === true) {
				valDescripcion = vDescripcion.getValue();
			}
			if (vObservacion.getVisible() === true) {
				valObservacion = vObservacion.getValue();
			}

			var that = this;
			var oEntrada = {
				Check1: vTipoAccionPangui,
				IdCatalogo: vNumCatalogo,
				IdPromo: VNumPromo,
				IdParte: vGParte,
				TipoPromoP: valSeletTipoPromo,
				TipoPack: valTipoPack,
				TipoBenef: valTipdoBene,
				TipoBgrupo: valTipoGrupo,
				TipoCond: valCondicion1,
				UnidCond: valUnidades1,
				TipoCond2: valCondicion2,
				UnidCond2: valUnidades2,
				TipoCond3: valCondicion3,
				UnidCond3: valUnidades3,
				Fpago1: valFormaPago1,
				Descto1: valDescuento1,
				Fpago2: valFormaPago2,
				Descto2: valDescuento2,
				Fpago3: valFormaPago3,
				Descto3: valDescuento3,
				TipoIng: "",
				TipoIng2: "",
				TipoIng3: "",
				Lleva: valLleva,
				Paga: valPaga,
				Lleva2: valLleva2,
				Paga2: valPaga2,
				Lleva3: valLleva3,
				Paga3: valPaga3,
				PrecioP1: valPrecioPack1,
				PrecioP2: valPrecioPack2,
				PrecioP3: valPrecioPack3,
				Descrip: valDescripcion,
				Observ: valObservacion,
				PanguiDetpanSet: [],
				PanguiDetsalSet: []
			};

			//pasa listado de Sku si existe 

			if (vDetPan.length > 0) {
				oEntrada.PanguiDetpanSet = vDetPan;
			}

			function fSuccess(oEvent) {

				if (oEvent.Pmensaje1 === "0") {

					if (vTipoAccionPangui === "I") {
						// si ya ingreso el registro cambia estado a M= modificar
						vTipoAccionPangui = "M";
						sap.ui.getCore().setModel(vTipoAccionPangui, "vTipoAccionPangui");

					}
					sap.m.MessageToast.show("Registro grabado");

					//busca lista de Sku dependiendo del grupo seleccionado

					that.BuscarListSku(vSeletTipo);

				} else {
					sap.m.MessageToast.show(oEvent.Pmensaje2);
				}
				bDialog.close();

			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al Grabar Datos");
				bDialog.close();

			}
			bDialog.open();

			if (vGrbarButtonF === "") {
				oEntrada.PanguiDetpanSet = []; // elimina los registros de los codigos para evitar duplicidad
			} else {
				vGrbarButtonF = "";
			}
			debugger
			modeloServicio.create("/PanguiSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

		},

		/////////////////////funcion del fragment (carga de SKU)////////////////////////////////
		onValidarSku: function () {
			vGrbarButtonF = "X";
			var that = this;
			var vSkuFrag = sap.ui.getCore().byId("IdSkuFrag");

			if (vSkuFrag.getValue() !== "") {
				var oEntrada = {
					"Cata": vNumCatalogo,
					"Parte": vGParte,
					"Despl": "",
					"Check": "P",
					"Pmensaje1": "",
					"Pmensaje2": "",
					"CosulSkuTcvigSet": [],
					"CosulSkuTdcatSet": [],
					"CosulSkuTpvigSet": []
				};
				var VCosulSkuTdcat = {
					"Idcatalogo": vNumCatalogo,
					"Idparte": vGParte,
					"Idposnr": "",
					"Matnr": vSkuFrag.getValue(),
					"Maktx": "",
					"Matkl": "",
					"Mvgr4": "",
					"Vrkme": "",
					"Clustermkt": "",
					"Numpaginas": "",
					"Princrelac": "",
					"Normaldest": "",
					"Promocombo": "",
					"Nomprocom": "",
					"Idcombo": "",
					"Grilla": "",
					"Estado": ""
				};
				oEntrada.CosulSkuTdcatSet.push(VCosulSkuTdcat);

				function fSuccess(oEvent) {

					if (oEvent.Pmensaje1 !== "0") {
						
						sap.m.MessageToast.show("ERROR: " + oEvent.Pmensaje2);
					}
					if (oEvent.Pmensaje1 === "0") {
						vDetPan = [];
						//agrega SKU a la base de datos 
						var InsSku = {
							IdCatalogo: vNumCatalogo,
							IdPromo: VNumPromo,
							IdParte: vGParte,
							TipoTde: vSeletTipo,
							IdPosnr: "",
							IdCodigo: oEvent.CosulSkuTdcatSet.results[0].Matnr,
							IdDescrip: oEvent.CosulSkuTdcatSet.results[0].Maktx
						};
						vDetPan.push(InsSku);

						that.onGrabar();
						//that.GrabarSingle(vDetPan);

						// var SKU = {
						// 	Idposnr: "",
						// 	IdSku: oEvent.CosulSkuTdcatSet.results[0].Matnr,
						// 	NomSku: oEvent.CosulSkuTdcatSet.results[0].Maktx
						// };
						// TabDisplay.push(SKU);
						// TabSku.setProperty("/DATA", TabDisplay);
						// // asignar el modelo a la vista
						// that.getView().setModel(TabSku, "TabSku");

					}
				}

				function fError(oEvent) {

					sap.m.MessageToast.show("Error al Verificar SKU");

				}

				modeloServicio.create("/CosulSkuSet", oEntrada, {
					success: fSuccess,
					error: fError
				});

			}

		},
		onValidarSkuExcel: function (Entrada) {

			var that = this;

			function fSuccess(oEvent) {
				
				if (oEvent.Pmensaje1 !== "0") {
					sap.m.MessageToast.show("ERROR: " + oEvent.Pmensaje2);
					bDialog.close();
				}
				if (oEvent.Pmensaje1 === "0") {
					vDetPan = [];
					//agrega SKU a la base de datos 

					for (var j = 0; j < oEvent.CosulSkuTdcatSet.results.length; j++) {

						var InsSku = {
							IdCatalogo: vNumCatalogo,
							IdPromo: VNumPromo,
							IdParte: vGParte,
							TipoTde: vSeletTipo,
							IdPosnr: "",
							IdCodigo: oEvent.CosulSkuTdcatSet.results[j].Matnr,
							IdDescrip: oEvent.CosulSkuTdcatSet.results[j].Maktx
						};
						vDetPan.push(InsSku);
					}
					vGrbarButtonF = "X";
					that.onGrabar();
				}

				//Muestra listado de errores
				if (oEvent.Pmensaje1 === "4") {

					var TabErrores = [];
					if (oEvent.CosulSkuTdcatSet !== null) {
						for (var j = 0; j < oEvent.CosulSkuTdcatSet.results.length; j++) {
							var RegError = {
								Sku: oEvent.CosulSkuTdcatSet.results[j].Matnr,
								Mensaje: oEvent.CosulSkuTdcatSet.results[j].Mensaje
							};
							TabErrores.push(RegError);

						}
					} else {
						sap.m.MessageToast.show(oEvent.Pmensaje2);

					}

					if (TabErrores.length > 0) {
						that.MostrarLogError(TabErrores);
					}

				}

			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al Verificar SKU");
				bDialog.close();

			}

			modeloServicio.create("/CosulSkuSet", Entrada, {
				success: fSuccess,
				error: fError
			});

		},

		//Muestra log de error  de la validación de los SKU
		MostrarLogError: function (vTabError) {

			var ModelLog = new JSONModel({
				DATA: []
			});

			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.SkuError", this);
			this._Dialog.setModel(this.getView().getModel());
			// abre el fragment
			this._Dialog.open();

			//var vTableLogView = sap.ui.getCore().byId("tableSkuError")

			//asigna valores a la tabla del log

			ModelLog.setProperty("/DATA", vTabError);
			// asignar el modelo a la vista
			this._Dialog.setModel(ModelLog, "ModelLog");

			bDialog.close();

		},

		handleUploadPress: function (oEvent) {
			//Sube archivo excel

			var oEntrada = {
				"Cata": vNumCatalogo,
				"Parte": vGParte,
				"Despl": "",
				"Check": "P",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"CosulSkuTcvigSet": [],
				"CosulSkuTdcatSet": [],
				"CosulSkuTpvigSet": []
			};

			var vthis = this;

			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

			//var vIdFileUp = this.byId("fileUploader"); //id del objeto FileUpload
			var vIdFileUp = sap.ui.getCore().byId("fileUploader"); //id del objeto FileUpload

			if (file && window.FileReader) {
				var reader = new FileReader();
				bDialog.open();

				reader.onload = function (evn) {

					var strCSV = evn.target.result; //string in CSV 

					var datosCSV = strCSV.split("\n");

					var largo = datosCSV.length;
					var entrada = [];
					var SKU = {};

					// no toma la primera ni la última linea
					for (var i = 1; i < largo - 1; i++) {

						entrada = datosCSV[i].split(";");

						var VCosulSkuTdcat = {
							"Idcatalogo": vNumCatalogo,
							"Idparte": vGParte,
							"Idposnr": "",
							"Matnr": entrada[0].replace(/(\r\n|\n|\r)/gm, ""),
							"Maktx": "",
							"Matkl": "",
							"Mvgr4": "",
							"Vrkme": "",
							"Clustermkt": "",
							"Numpaginas": "",
							"Princrelac": "",
							"Normaldest": "",
							"Promocombo": "",
							"Nomprocom": "",
							"Idcombo": "",
							"Grilla": "",
							"Estado": ""
						};
						oEntrada.CosulSkuTdcatSet.push(VCosulSkuTdcat);
					}

					if (oEntrada.CosulSkuTdcatSet.length > 0)
						vthis.onValidarSkuExcel(oEntrada);

				}

			}

			reader.readAsText(file);

			vIdFileUp.setValue(""); //Blanque Objeto 
		},

		onEliminaSku: function (Event) {

			var that = this;

			var oEntrada = {
				"Check1": "D", //elimina detalle 
				"IdCatalogo": vNumCatalogo,
				"IdPromo": VNumPromo,
				"IdParte": vGParte,
				"PanguiDetpanSet": [],
				"PanguiDetsalSet": []
			};

			//// tomo valor de los registros seleccionados 
			var vTabSku = sap.ui.getCore().byId("idTableSku");

			var rowItems = vTabSku.getSelectedItems();

			if (rowItems.length > 0) {
				vDetPan = [];
				for (var j = 0; j < rowItems.length; j++) {
					var Cell = rowItems[j].getCells();

					//agrega SKU a ser borrados 
					var InsSku = {
						IdCatalogo: vNumCatalogo,
						IdPromo: VNumPromo,
						IdParte: vGParte,
						TipoTde: vSeletTipo,
						IdPosnr: Cell[2].getText(),
						IdCodigo: Cell[0].getText(),
						IdDescrip: ""
					};
					vDetPan.push(InsSku);
				}
				oEntrada.PanguiDetpanSet = vDetPan;

				function fSuccess(oEvent) {

					if (oEvent.Pmensaje1 === "0") {

						sap.m.MessageToast.show("Registro Eliminado");
						//busca lista de Sku dependiendo del grupo seleccionado
						that.BuscarListSku(vSeletTipo);
					} else {
						sap.m.MessageToast.show(oEvent.Pmensaje2);
					}

					bDialog.close();

				}

				function fError(oEvent) {

					sap.m.MessageToast.show("Error al Grabar Datos");
					bDialog.close();

				}
				bDialog.open();
				modeloServicio.create("/PanguiSet", oEntrada, {
					success: fSuccess,
					error: fError
				});

			} else {

				sap.m.MessageToast.show("Debe seleccionar un Registro");

			}

		},

		onCerrarFrag: function () {
			this._Dialog.destroy(true);
			this._Dialog.close();
		},

	});
});