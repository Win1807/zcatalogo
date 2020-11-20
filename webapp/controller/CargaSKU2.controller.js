sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"

], function (Controller, JSONModel, jQuery, Spreadsheet, Filter, FilterOperator, MessageBox) {
	"use strict";
	var TabSku = new JSONModel({
		DATA: []
	});
	var TabEntrada = [];
	var vTable1 = "";
	var vAccionFr = ""; // I=Insertar/M=modificar
	var vindexTab = ""; // indice del registro seleccionado 
	var Modelo = "";
	var tabErro = []; //tabla de errores de carga de excel
	var vAccionB = ""; // C=Consulta, V=Valida
	var vValNumCatalogo = "";
	var vDescripcion = "";
	var vAtribSurtido = "";
	var vSurtido = "";
	var vSurtidoE = ""; //Grupo de articulo completo 
	var vVrkme = "";
	var vIdSkuOK = "";
	var vSkuOK = "";
	var vUltimaPosicion = "";
	var TabDisplay = [];
	var vPanelFrag = "";
	var vSubidoExcel = "";
	var vSubidoExcel2 = "";
	var vRefrescar = "";
	var vParte = "";
	var vPosicion = "";
	var vNomarchivo = "";
	var vNombreCat = "";
	var bDialog = new sap.m.BusyDialog();
	var vRelacionadoOn = ""; //NO/SI  Sku Relacionado 
	var vValidarRelaci = ""; //NO/SI  valida que exista el Sku relacionado 

	var vNueSku = "";
	var vModSku = "";
	var vEliSku = "";
	var vIdFileUp = "";
	var vPosnrSkuPrin = "";
	var vidTextTotal = "";

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.CargaSKU2", {

		onInit: function () {
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CargaSKU2").attachDisplay(null, this.onDisplay, this);

		},

		onDisplay: function () {

			if (vRefrescar === "") {
				TabDisplay = [];
				//Recupera N° de catalog
				vSubidoExcel = "";
				vSubidoExcel2 = "";
				vParte = "";
				vPosnrSkuPrin = "";
				vRelacionadoOn = "NO";
				vValidarRelaci = "NO";

				vNueSku = this.byId("NueSku");
				vModSku = this.byId("ModSku");
				vEliSku = this.byId("EliSku");
				vIdFileUp = this.byId("fileUploader"); //id del objeto FileUpload
				vidTextTotal = this.byId("idTextTotal"); //total registro

				var vtxtNcata = this.byId("idTextNcatalogo");

				vValNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");
				vNombreCat = sap.ui.getCore().getModel("vNombreCat"); //nombre catalogo

				vtxtNcata.setText("CATALOGO N°" + vValNumCatalogo + ">" + vNombreCat);

				vUltimaPosicion = "";

				vTable1 = this.getView().byId("table1");
				// mantiene la cabecera de la tabla fija 
				vTable1.setPopinLayout(sap.m.PopinLayout.Block);
				vTable1.setSticky(["ColumnHeaders"]);

				Modelo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
				vAccionB = "C";
				vTable1.setBusy(true);
				this.CargarData();
				vRefrescar = "X"; //variable para refrescar  infoemacion 
			}

		},

		onDesmarcarTab: function () {

			// desmarca registro de la tabla
			var vTab1 = this.byId("table1");
			var vList1 = vTab1.getModel("TabSku").getData().DATA;

			for (var j = 0; j < vList1.length; j++) {

				vTable1.setSelectedItem(vTable1.getItems()[j], false, false);
			}

		},

		CragarRegistos: function () {

		},

		onBack: function () {
			vRefrescar = "";
			this.getOwnerComponent().getTargets().display("CatalogoMain");

		},

		onNewSku: function () {

			// asignar el modelo a la vista al fragment
			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.CargaSkuIM", this);
			this._Dialog.setModel(this.getView().getModel());
			// abre el fragment
			this._Dialog.open();
			vPanelFrag = sap.ui.getCore().byId("IdPanelFragment");
			vAccionFr = "I";
		},

		onModSku: function (oEvent) {

			// modifica el iten seleccionado 
			// tomo valor de los registros seleccionados Norte

			var rowItems = vTable1.getSelectedItems();
			var vPaht = rowItems[0].getBindingInfo("highlight").binding.getContext().getPath();
			var vLineSelect = rowItems[0].getBindingInfo("highlight").binding.getContext().getModel().getObject(vPaht);

			vPosnrSkuPrin = vLineSelect.Posnrprin;

			if (rowItems.length === 1) {
				// asignar el modelo a la vista al fragment
				this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.CargaSkuIM", this);
				this._Dialog.setModel(this.getView().getModel());
				// abre el fragment
				this._Dialog.open();
				vPanelFrag = sap.ui.getCore().byId("IdPanelFragment");
				//asigno variables
				var vIdSkuFrag = sap.ui.getCore().byId("IdSkuFrag"); //SKU del Fragment
				var vIdSkuDescriFrag = sap.ui.getCore().byId("IdSkuDescriFrag"); //Nombre SKU
				var vIdNPaginaFrag = sap.ui.getCore().byId("IdNPaginaFrag"); //Numero de pagina
				var vidSelectPR = sap.ui.getCore().byId("idSelectPR"); //Principal/ relacionado
				var vidSelectND = sap.ui.getCore().byId("idSelectND"); //Normal/Destacado
				var vidSelectPC = sap.ui.getCore().byId("idSelectPC"); //Promo/combo
				var vIdComboFrag = sap.ui.getCore().byId("IdComboFrag"); //ID Combo
				var vIdNGrillaFrag = sap.ui.getCore().byId("IdNGrillaFrag"); //Grilla
				var vidIdNomPromo = sap.ui.getCore().byId("IdNomPromo"); // nombre promo 

				var vIdSkuPrinFrag = sap.ui.getCore().byId("IdSkuPrinFrag"); // SKU Principal (para relacionado)
				var vIdSkuDescriPrincFrag = sap.ui.getCore().byId("IdSkuDescriPrincFrag"); // SKU Principal (para relacionado)

				var vIdSkuRemFrag = sap.ui.getCore().byId("IdSkuRem"); // SKU de remplazo
				var vIdSkuDesRemFrag = sap.ui.getCore().byId("IdSkuRemDes"); // Descripción SKU de remplazo
				// busca e indice de del registro seleccionado en la tabla 
				var vIndice = rowItems[0].getBindingContextPath().slice(6, 7);

				//**********************************************************************************************
				// asigna los valores al fragment
				;
				var Cells = rowItems[0].getCells();
				vIdSkuFrag.setValue(Cells[0].getText()); //SKU
				vIdSkuDescriFrag.setValue(Cells[1].getText()); //SKU Descripcion
				vIdNPaginaFrag.setValue(Cells[4].getText()); //N° de pagina
				vIdSkuPrinFrag.setValue(Cells[16].getText()); //Sku Principal (para relacionado)
				vIdSkuRemFrag.setValue(Cells[18].getText()); //Sku de remplazo
				vIdSkuDesRemFrag.setValue(Cells[19].getText()); //Descripción Sku de remplazo

				if (Cells[16].getText() !== "") {
					vValidarRelaci = "SI";
				}

				vIdSkuDescriPrincFrag.setValue(Cells[17].getText()); //nombre Sku Principal (para relacionado)

				//vidSelectPR.setValue(Cells[5].getText()); //Principal/relacionado
				if (Cells[5].getText() === "Principal") {
					vidSelectPR.setSelectedItemId("item1");
					vIdSkuPrinFrag.setBlocked(true);
					vRelacionadoOn = "NO";
				} else {
					vidSelectPR.setSelectedItemId("item2");
					vIdSkuPrinFrag.setBlocked(false);
					vRelacionadoOn = "SI";
				}

				// vidSelectND.setValue(Cells[6].getText()); //Normal/Destacado
				if (Cells[6].getText() === "Normal") {
					vidSelectND.setSelectedItemId("item3");
				} else {
					vidSelectND.setSelectedItemId("item4");
				}

				//vidSelectPC.setValue(Cells[7].getText()); //Promo/Combo

				if (Cells[7].getText() === "") {
					vidSelectPC.setSelectedItemId("item7");
				}
				if (Cells[7].getText() === "Promo") {
					vidSelectPC.setSelectedItemId("item5");
				}
				if (Cells[7].getText() === "Combo") {
					vidSelectPC.setSelectedItemId("item6");
				}

				vidIdNomPromo.setValue(Cells[13].getText()); //Nombre Promo
				vIdComboFrag.setValue(Cells[8].getText()); //N°Combo
				vIdNGrillaFrag.setValue(Cells[9].getText()); //Grilla
				vUltimaPosicion = Cells[10].getText(); //Posicion del Sku en tabla de DB
				vVrkme = Cells[11].getText(); ////unida de medida
				vSurtido = Cells[3].getText(); // Seccion 		
				vAtribSurtido = Cells[2].getText(); // atributo de surtido
				vParte = Cells[12].getText(); // Id parte
				vSurtidoE = Cells[15].getText(); // seccion entera

				// vVrkme = Cells[11].getText(); //unida de medida

				vIdSkuOK = "X";
				vAccionFr = "M";

			} else {

				sap.m.MessageToast.show("Debe seleccionar un Registro");

			}

		},

		onValidatePrincipal: function (aItems) {
			if (aItems.length > 0) {
				for (var i = 0; i < aItems.length; i++) {
					var oContext = aItems[i].getBindingInfo("highlight").binding.getContext().getModel().getObject(aItems[i].getBindingInfo(
						"highlight").binding.getContext().getPath());
					if (oContext.PrinRela === "Principal") {
						return this.onValidateRela(oContext.IdSku);
						//return true;
					}
				}
			}
		},

		onValidateRela: function (sSku) {
			var aItems = vTable1.getItems();
			if (aItems.length > 0) {
				for (var i = 0; i < aItems.length; i++) {
					var oContext = aItems[i].getBindingInfo("highlight").binding.getContext().getModel().getObject(aItems[i].getBindingInfo(
						"highlight").binding.getContext().getPath());
					if (oContext.PrinRela === "Relacionado") {
						if (oContext.Matnrprin === sSku) {
							return true;
						}
					}
				}
			}
		},

		onElim: function () {
			var Tab = vTable1.getSelectedItems();

			if (this.onValidatePrincipal(Tab)) {
				new sap.m.MessageBox.show("Se va  eliminar SKU que contiene Itens Relacionados", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "CONFIRMAR",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (sAnswer) {
						if (sAnswer === MessageBox.Action.YES) {
							this.onEliSku();
						}
					}.bind(this)
				});
			} else {
				this.onEliSku();
			}
		},

		onEliSku: function (oEvent) {

			var that = this;
			var oEntrada1 = {
				"Cata": vValNumCatalogo,
				"Parte": "1",
				"Check1": "E",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"GrabarSkuTecatSet": [],
				"GrabarSkuTscatSet": []
			};

			vTable1.setBusy(true);
			//var sPath = oEvent.getSource().getBindingContext('TabSku').getPath();
			// elimina los registros seleccionados

			//// tomo valor de los registros seleccionados 
			var Tab = vTable1.getSelectedItems();
			var oTable = this.getView().byId("table1");
			var model = oTable.getModel("TabSku");
			var data = model.getProperty("/DATA");
			// se invierte los registros seleccionados, para poder efectuar 
			//la eliminacion de los registros 
			var reverse = [].concat(Tab).reverse();

			// elimina registro en DB

			for (var i = 0; i < reverse.length; i++) {
				var vIndex = oTable.indexOfItem(reverse[i]);

				//verifica que el registro borrado no contenga Sku relacionados

				// if (data[vIndex].PrinRela === "Principal") {
				// 	var vIndexRela = vIndex + 1;
				// 	if (data[vIndexRela].PrinRela === "Relacionado") {
				// 		sap.m.MessageToast.show("No puede Borrar SKU Principal con Sku Relacionado");
				// 		vTable1.setBusy(false);
				// 		return;

				// 	}

				// }

				var VCosulSkuTdcat = {
					"Idcatalogo": vValNumCatalogo,
					"Idparte": data[vIndex].Idparte,
					"Idposnr": data[vIndex].Idposnr,
					"Matnr": data[vIndex].IdSku,
					"Maktx": "",
					"Matkl": "",
					"Mvgr4": "",
					"Vrkme": "",
					"Clustermkt": "",
					"Numpaginas": "",
					"Princrelac": data[vIndex].PrinRela.substring(0, 1).toUpperCase(),
					"Posnrprin": data[vIndex].Posnrprin,
					"Matnrprin": data[vIndex].Matnrprin,
					"Normaldest": "",
					"Promocombo": "",
					"Nomprocom": "",
					"Idcombo": "",
					"Grilla": ""
				};

				oEntrada1.GrabarSkuTecatSet.push(VCosulSkuTdcat);

			}

			function fSuccess(oEvent3) {

				if (oEvent3.Pmensaje1 !== "0") {
					sap.m.MessageToast.show(oEvent3.Pmensaje2);
					vTable1.setBusy(false);
					return;
				}
				// Recorro los itens seleccionado en tabla 
				// for (var k = 0; k < reverse.length; k++) {
				// 	var vIndex2 = oTable.indexOfItem(reverse[k]);
				// 	data.splice(vIndex2, 1);
				// }
				// model.refresh();
				// vTable1.setBusy(false);
				// sap.m.MessageToast.show("Registro Eliminado");
				vRefrescar = "";
				that.onDisplay();
				sap.m.MessageToast.show("Registro Eliminado");

			}

			function fError(oEvent3) {

				vTable1.setBusy(false);
				sap.m.MessageToast.show("Error al Borrar Registro");

			}

			Modelo.create("/GrabarSkuSet", oEntrada1, {
				success: fSuccess,
				error: fError
			});

		},

		handleUploadPress: function (oEvent) {

			//Sube archivo excel
			//var TabEntrada = [];
			var vthis = this;

			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

			if (file && window.FileReader) {
				// valida formato del archivo 
				if (file.name.indexOf(".csv") === -1) {
					sap.m.MessageToast.show("Archivo a Cargar debe ser de formato .CSV");
					return;
				}

				var reader = new FileReader();
				var that = this;

				reader.onload = function (evn) {
					vTable1.setBusy(true);
					var strCSV = evn.target.result; //string in CSV 

					var datosCSV = strCSV.split("\n");

					var largo = datosCSV.length;
					var entrada = [];
					var SKU = {};
					TabEntrada = [];;
					// no toma la primera ni la última linea
					for (var i = 1; i < largo - 1; i++) {

						entrada = datosCSV[i].split(";");
						// console.log(entrada);
						SKU = {
							IdSku: entrada[0],
							NomSku: "",
							AtributoSur: "",
							Seccion: "",
							NPagina: entrada[1],
							PrinRela: entrada[2],
							NormDest: entrada[3],
							PromComb: entrada[4],
							Nomprocom: entrada[5],
							IdCombo: entrada[6],
							Grilla: entrada[7],
							Matnrprin: entrada[8].replace(/(\r\n|\n|\r)/gm, ""),
							Matnrrem: entrada[9].replace(/(\r\n|\n|\r)/gm, ""),
							Accion: ""

						};
						//valida que el primer registro debe ser Principal 
						if (i === 1) {
							if (SKU.PrinRela === "Relacionado" || SKU.PrinRela === "") {
								sap.m.MessageToast.show("El primer registro del Archivo debe ser Principal");
								vTable1.setBusy(false);
								return;
							}

						}

						if (entrada[5].length > 50) {
							sap.m.MessageToast.show("ERROR: linea:" + i + "Descripción mas de 50 Caracteres");
							vTable1.setBusy(false);
							return;
						}

						//valida longitud de Nombre promo 
						if (entrada[5].length > 50) {
							sap.m.MessageToast.show("ERROR: linea:" + i + "Descripción mas de 50 Caracteres");
							vTable1.setBusy(false);
							return;
						}
						// Valida que no este vacio el campo Matnrprin si es un sku relacional

						if (SKU.PrinRela === "Relacionado" && SKU.Matnrprin === "") {
							sap.m.MessageToast.show("ERROR: linea: " + i + " SKU relacionado sin SKU Principal");
							vTable1.setBusy(false);
							return;
						}

						TabEntrada.push(SKU);
					}

					// valida archivo Excel subido
					vAccionB = "V";
					// subido mediante plantilla excel 
					vSubidoExcel = "X";
					// para salida del pop up 
					vSubidoExcel2 = "X";

					vthis.CargarData();

				};

			}
			reader.readAsText(file);
			vIdFileUp.setValue(""); //Blanque Objeto 

		},

		CargarData: function () {

			var that = this;
			//llama al sevicio de validacion de archivo Excel
			var oEntrada = {
				"Cata": vValNumCatalogo,
				"Parte": "",
				"Despl": "",
				"Check": vAccionB,
				"Pmensaje1": "",
				"Pmensaje2": "",
				"CosulSkuTcvigSet": [],
				"CosulSkuTdcatSet": [],
				"CosulSkuTpvigSet": []
			};

			var VCosulSkuTcvig = {
				"Idcatalogo": "",
				"Idparte": "",
				"Idposnr": "",
				"Matnr": "",
				"Zona": "",
				"Centro": "",
				"Preciovig": "",
				"Moneda": ""
			};
			var VCosulSkuTpvig = {
				"Idcatalogo": "",
				"Idparte": "",
				"Idposnr": "",
				"Matnr": "",
				"Zona": "",
				"Preciovig": "",
				"Moneda": "",
				"Precvigpro": "",
				"Precpropro": "",
				"Promoprecio": "",
				"Promotarjet": ""

			};
			var vPrincrelac = "",
				vNormaldest = "",
				vPromocombo = "";

			//llena tabla 
			if (vAccionB === "V") {
				if (TabEntrada.length > 1) {
					for (var i = 0; i < TabEntrada.length; i++) {
						vPromocombo = "";

						//Principal/relacionado
						if (TabEntrada[i].PrinRela === "Relacionado") {
							vPrincrelac = "R";
						} else {
							vPrincrelac = "P";
						}
						//Normal/destacado
						if (TabEntrada[i].NormDest === "Destacado") {
							vNormaldest = "D";
						} else {
							vNormaldest = "N";
						}
						//Promo/combo
						if (TabEntrada[i].PromComb === "Combo") {
							vPromocombo = "C";
						}
						if (TabEntrada[i].PromComb === "Promo") {
							vPromocombo = "P";
						}

						var VCosulSkuTdcat = {
							"Idcatalogo": vValNumCatalogo,
							"Idparte": "1",
							"Idposnr": "",
							"Matnr": TabEntrada[i].IdSku,
							"Maktx": "",
							"Matkl": "",
							"Mvgr4": "",
							"Vrkme": "",
							"Clustermkt": "",
							"Numpaginas": TabEntrada[i].NPagina,
							"Princrelac": vPrincrelac,
							"Posnrprin": TabEntrada[i].Posnrprin,
							"Normaldest": vNormaldest,
							"Promocombo": vPromocombo,
							"Nomprocom": TabEntrada[i].Nomprocom,
							"Idcombo": TabEntrada[i].IdCombo,
							"Grilla": TabEntrada[i].Grilla,
							"Matnrprin": TabEntrada[i].Matnrprin,
							"Matnrrem": TabEntrada[i].Matnrrem,
							"Estado": ""
						};

						//VCosulSkuTdcat.Matnr = TabEntrada[i].IdSku;
						oEntrada.CosulSkuTdcatSet.push(VCosulSkuTdcat);
					}
					oEntrada.CosulSkuTcvigSet.push(VCosulSkuTcvig);
					oEntrada.CosulSkuTpvigSet.push(VCosulSkuTpvig);

				}
			}

			//evento llamado exitoso 
			function fSuccess(oEvent) {;

				//verifica resultados
				//Error
				if (oEvent.Pmensaje1 === "2") {
					sap.m.MessageToast.show("ERROR: " + oEvent.Pmensaje2);
					vTable1.setBusy(false);
					//that.getOwnerComponent().getTargets().display("CatalogoMain");

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
						vTable1.setBusy(false);

					}

					if (TabErrores.length > 0) {
						that.MostrarLogError(TabErrores);
					}

				}

				//succeful
				if (oEvent.Pmensaje1 === "0") {

					if (oEvent.Pprovenc === "X") {
						// habilita o no botones de accion 
						vNueSku.setBlocked(true);
						vModSku.setBlocked(true);
						vEliSku.setBlocked(true);
						vIdFileUp.setBlocked(true);
						sap.m.MessageToast.show("Catalogo Cerrado");
					} else {
						vNueSku.setBlocked(false);
						vModSku.setBlocked(false);
						vEliSku.setBlocked(false);
						vIdFileUp.setBlocked(false);

					}

					// optiene el numero de la parte 

					if (oEvent.CosulSkuTdcatSet !== null) {

						vParte = oEvent.CosulSkuTdcatSet.results[0].Idparte;
					}

					//Muestra en pantalla 
					var SKU = {};
					var vPrinRelaTxt = "",
						vNormDestTxt = "",
						vPromCombTxt = "";
					//var TabDisplay = [];

					if (oEvent.CosulSkuTdcatSet !== null) {

						// optiene al ultima posicion del listado de Sku 
						vUltimaPosicion = oEvent.CosulSkuTdcatSet.results[oEvent.CosulSkuTdcatSet.results.length - 1].Idposnr;

						for (var j = 0; j < oEvent.CosulSkuTdcatSet.results.length; j++) {
							vPromCombTxt = "";

							if (oEvent.CosulSkuTdcatSet.results[j].Princrelac === "R") {
								vPrinRelaTxt = "Relacionado";
							} else {
								vPrinRelaTxt = "Principal";
							}

							if (oEvent.CosulSkuTdcatSet.results[j].Normaldest === "D") {
								vNormDestTxt = "Destacado";
							} else {
								vNormDestTxt = "Normal";
							}

							if (oEvent.CosulSkuTdcatSet.results[j].Promocombo === "C") {
								vPromCombTxt = "Combo";
							}
							if (oEvent.CosulSkuTdcatSet.results[j].Promocombo === "P") {
								vPromCombTxt = "Promo";
							}

							SKU = {
								IdSku: oEvent.CosulSkuTdcatSet.results[j].Matnr,
								NomSku: oEvent.CosulSkuTdcatSet.results[j].Maktx,
								AtributoSur: oEvent.CosulSkuTdcatSet.results[j].Mvgr4,
								Seccion: oEvent.CosulSkuTdcatSet.results[j].Matkl.substr(0, 2),
								NPagina: oEvent.CosulSkuTdcatSet.results[j].Numpaginas,
								PrinRela: vPrinRelaTxt,
								NormDest: vNormDestTxt,
								PromComb: vPromCombTxt,
								IdCombo: oEvent.CosulSkuTdcatSet.results[j].Idcombo,
								Grilla: oEvent.CosulSkuTdcatSet.results[j].Grilla,
								Accion: "",
								Idposnr: oEvent.CosulSkuTdcatSet.results[j].Idposnr,
								Vrkme: oEvent.CosulSkuTdcatSet.results[j].Vrkme,
								Idparte: oEvent.CosulSkuTdcatSet.results[j].Idparte,
								Excel: vSubidoExcel,
								SeccionE: oEvent.CosulSkuTdcatSet.results[j].Matkl, //Grupo de articulo entero
								Nomprocom: oEvent.CosulSkuTdcatSet.results[j].Nomprocom,
								Matnrprin: oEvent.CosulSkuTdcatSet.results[j].Matnrprin,
								Maktxprin: oEvent.CosulSkuTdcatSet.results[j].Maktxprin,
								Posnrprin: oEvent.CosulSkuTdcatSet.results[j].Posnrprin,
								Matnrrem: oEvent.CosulSkuTdcatSet.results[j].Matnrrem,
								Maktxrem: oEvent.CosulSkuTdcatSet.results[j].Maktxrem,
								Estado: ""
							};

							if (SKU.Matnrprin !== "") {
								SKU.Estado = "Warning";
							} else {
								SKU.Estado = "None";
							}

							TabDisplay.push(SKU);
						}

					}
					if (vSubidoExcel === "X") {
						//setea valor de variable de excel cuando esta es "X"
						vSubidoExcel = "";
					}

					var vtota = "Total Registros: " + TabDisplay.length;
					vidTextTotal.setText(vtota);

					TabSku.setProperty("/DATA", TabDisplay);
					// asignar el modelo a la vista
					that.getView().setModel(TabSku, "TabSku");

					if (vSubidoExcel2 === "X") {
						var vNomTotalReg = "";
						vNomTotalReg = "Total registros Subidos:" + j;
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.information(
							vNomTotalReg, {
								//actions: ["Manage Products", MessageBox.Action.CLOSE],
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								onClose: function (sAction) {

									that.onGuardar();
								}
							}
						);
						vSubidoExcel2 = "";
					}

				}

				that.onDesmarcarTab();
				vTable1.setBusy(false);

			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al grabar Data");
				vTable1.setBusy(false);

			};
			Modelo.create("/CosulSkuSet", oEntrada, {
				success: fSuccess,
				error: fError
			});

			// } else {
			// 	vTable1.setBusy(false);
			// }

		},
		//Buestra log de error  de la validación de los SKU
		MostrarLogError: function (vTabError) {

			var ModelLog = new JSONModel({
				DATA: []
			});

			vTable1.setBusy(false);
			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.SkuError", this);
			this._Dialog.setModel(this.getView().getModel());
			// abre el fragment
			this._Dialog.open();

			//var vTableLogView = sap.ui.getCore().byId("tableSkuError")

			//asigna valores a la tabla del log

			ModelLog.setProperty("/DATA", vTabError);
			// asignar el modelo a la vista
			this._Dialog.setModel(ModelLog, "ModelLog");

		},

		onGuardar: function (oEvent) {

			var that = this;
			var vAuxiUltima = "";
			vUltimaPosicion = "";
			var oEntrada1 = {
				"Cata": vValNumCatalogo,
				"Parte": "1",
				"Check1": "I",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"GrabarSkuTecatSet": [],
				"GrabarSkuTscatSet": []
			};

			vTable1.setBusy(true);

			//optiene los valores de la tabla  de la tabla
			var vTab1 = this.byId("table1");
			var vList1 = vTab1.getModel("TabSku").getData().DATA;

			for (var j = 0; j < vList1.length; j++) {

				// procesa los subidos en excel 
				if (vList1[j].Excel === "X") {

					vUltimaPosicion = (parseInt(vUltimaPosicion) + 1).toString(); //agrera nueva posicion al nuevo registro 
					if (vUltimaPosicion === "NaN") {
						vUltimaPosicion = "1";
					}

					var SkuTecatSet = {
						"Idcatalogo": vValNumCatalogo,
						"Idparte": "1",
						"Idposnr": vUltimaPosicion,
						"Matnr": vList1[j].IdSku,
						"Maktx": vList1[j].NomSku,
						"Matkl": vList1[j].SeccionE,
						"Mvgr4": vList1[j].AtributoSur,
						"Vrkme": vList1[j].Vrkme,
						"Clustermkt": "",
						"Numpaginas": vList1[j].NPagina,
						"Princrelac": "",
						"Matnrprin": vList1[j].Matnrprin,
						"Maktxprin": vList1[j].Maktxprin,
						"Normaldest": "",
						"Promocombo": "",
						"Nomprocom": vList1[j].Nomprocom,
						"Idcombo": vList1[j].IdCombo,
						"Grilla": vList1[j].Grilla,
						"Matnrrem": vList1[j].Matnrrem

					};

					//Principal/relacionado
					if (vList1[j].PrinRela === "Relacionado") {
						SkuTecatSet.Princrelac = "R";
					} else {
						SkuTecatSet.Princrelac = "P";
					}

					//Normal/destacado
					if (vList1[j].NormDest === "Destacado") {
						SkuTecatSet.Normaldest = "D";
					} else {
						SkuTecatSet.Normaldest = "N";
					}

					//Promo/combo
					if (vList1[j].PromComb === "Combo") {
						SkuTecatSet.Promocombo = "C";
					}
					if (vList1[j].PromComb === "Promo") {
						SkuTecatSet.Promocombo = "P";
					}

					oEntrada1.GrabarSkuTecatSet.push(SkuTecatSet);

				} else {
					vUltimaPosicion = vList1[j].Idposnr;

				}

			}

			function fSuccess(oEvent2) {

				vTable1.setBusy(false);
				if (oEvent2.Pmensaje1 !== "0") {

					sap.m.MessageToast.show("Error al grabar Data");
				} else {

					vRefrescar = "";
					that.onDisplay();
					sap.m.MessageToast.show("Registros guardados");

				}

			}

			function fError(oEvent2) {

				vTable1.setBusy(false);

				sap.m.MessageToast.show("Error al grabar Data");

			}

			if (oEntrada1.GrabarSkuTecatSet.length > 0) { //Graba solo los subido por excel 
				Modelo.create("/GrabarSkuSet", oEntrada1, {
					success: fSuccess,
					error: fError
				});
			} else {
				vTable1.setBusy(false);

				sap.m.MessageToast.show("Debe cargar un Archivo");
			}

			// if (vList1.length !== 0) {

			// 	this.onInserModfSku("I", vList1); //Inserta SKU
			// }

		},

		onInserModfSku: function (vCheck, voEntrada, vTabEntrada) {

			var that = this;
			var vAuxiUltima = "";

			var oEntrada1 = {
				"Cata": vValNumCatalogo,
				"Parte": vParte,
				"Check1": vCheck,
				"Pmensaje1": "",
				"Pmensaje2": "",
				"GrabarSkuTecatSet": [],
				"GrabarSkuTscatSet": []
			};
			vAuxiUltima = vUltimaPosicion;
			if (vCheck === "I") {

				vUltimaPosicion = (parseInt(vUltimaPosicion) + 1).toString(); //agrera nueva posicion al nuevo registro 

				if (vUltimaPosicion === "NaN") {
					vUltimaPosicion = "1";
				}

			}

			var SkuTecatSet = {
				"Idcatalogo": vValNumCatalogo,
				"Idparte": vParte,
				"Idposnr": vUltimaPosicion,
				"Matnr": voEntrada.IdSku,
				"Maktx": voEntrada.NomSku,
				"Matkl": voEntrada.SeccionE,
				"Mvgr4": voEntrada.AtributoSur,
				"Vrkme": voEntrada.Vrkme,
				"Clustermkt": "",
				"Numpaginas": voEntrada.NPagina,
				"Princrelac": "",
				"Posnrprin": vPosnrSkuPrin,
				"Matnrprin": voEntrada.Matnrprin,
				"Maktxprin": voEntrada.Maktxprin,
				"Normaldest": "",
				"Promocombo": "",
				"Nomprocom": voEntrada.Nomprocom,
				"Idcombo": voEntrada.IdCombo,
				"Grilla": voEntrada.Grilla,
				"Matnrrem": voEntrada.Matnrrem

			};

			//Principal/relacionado
			if (voEntrada.PrinRela === "Relacionado") {
				SkuTecatSet.Princrelac = "R";
			} else {
				SkuTecatSet.Princrelac = "P";
			}

			//Normal/destacado
			if (voEntrada.NormDest === "Destacado") {
				SkuTecatSet.Normaldest = "D";
			} else {
				SkuTecatSet.Normaldest = "N";
			}

			//Promo/combo
			if (voEntrada.PromComb === "Combo") {
				SkuTecatSet.Promocombo = "C";
			}
			if (voEntrada.PromComb === "Promo") {
				SkuTecatSet.Promocombo = "P";
			}

			oEntrada1.GrabarSkuTecatSet.push(SkuTecatSet);

			function fSuccess(oEvent) {

				if (oEvent.Pmensaje1 === "0") {

					sap.m.MessageToast.show("Registro Guardado");

					//***************************************************
					//		Pinta informacion en pantalla		
					//*****************************************************

					// TabSku.setProperty("/DATA", vTabEntrada);
					// // asignar el modelo a la vista
					// that.getView().setModel(TabSku, "TabSku");

					// //that.CargarData();
					// //vRefrescar = "X"; //variable para refrescar  infoemacion 

					// // Cuando es un registro nuevo desmarca el Chek de seleccion 
					// if (vAccionFr === "I") {
					// 	for (var j = 0; j < vTabEntrada.length; j++) {

					// 		vTable1.setSelectedItem(vTable1.getItems()[j], false, false);
					// 	}

					// }

					vRefrescar = "";
					that.onDisplay();

				} else {
					sap.m.MessageToast.show(oEvent.Pmensaje2);
				}

				vIdSkuOK = "";
				vAtribSurtido = "";
				vSurtido = "";
				vSurtidoE = "";
				vPanelFrag.setBusy(false);
				that._Dialog.destroy(true);
				that._Dialog.close();

				that.onDesmarcarTab();

			}

			function fError(oEvent) {

				vPanelFrag.setBusy(false);
				vUltimaPosicion = vAuxiUltima;
				sap.m.MessageToast.show("Error al grabar Data");

			}

			Modelo.create("/GrabarSkuSet", oEntrada1, {
				success: fSuccess,
				error: fError
			});

		},

		onPrecios: function () {

			this.getOwnerComponent().getTargets().display("CargaPrecios");
		},

		onBajarArchivos: function () {

			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ListPrecioEvent", this);
			this._Dialog.setModel(this.getView().getModel());
			// abre el fragment
			this._Dialog.open();

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
			var list = this.byId("table1");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

		},

		//////////////////// funciones del Fragment NuevaAccionPro//////////////////////////////
		onAceptarFrag: function () {

			var that = this;

			if (vIdSkuOK !== "X") {
				sap.m.MessageToast.show("Error al Verificar SKU");
				return;
			}

			if (sap.ui.getCore().byId("IdNPaginaFrag").getValue() === "") {
				sap.m.MessageToast.show("Debe asignar un N° de Pagina");
				return;
			}
			//Valida los Sku relacionados
			if (vRelacionadoOn === "SI") {

				if (sap.ui.getCore().byId("IdSkuPrinFrag").getValue() === "") {
					sap.m.MessageToast.show("Debe asignar un SKU Principal");
					return;
				}

				if (vValidarRelaci === "NO") {
					sap.m.MessageToast.show("Sku no Existe en Listado como principal");
					return;
				}

			}

			var oEntrada = {
				"IdSku": "",
				"NomSku": "",
				"AtributoSur": "",
				"Seccion": "",
				"SeccionE": "",
				"NPagina": "",
				"PrinRela": "",
				"Posnrprin": "",
				"Matnrprin": "",
				"Maktxprin": "",
				"NormDest": "",
				"PromComb": "",
				"Nomprocom": "",
				"IdCombo": "",
				"Grilla": "",
				"Accion": "",
				"Vrkme": "",
				"Idparte": "",
				"Idposnr": "",
				"Matnrrem": ""

			};

			vPanelFrag.setBusy(true);
			//N°SKU
			oEntrada.IdSku = sap.ui.getCore().byId("IdSkuFrag").getAccessibilityInfo().description;
			//Descripcion Sku 
			oEntrada.NomSku = sap.ui.getCore().byId("IdSkuDescriFrag").getAccessibilityInfo().description;
			// Atributo surtido
			oEntrada.AtributoSur = vAtribSurtido;
			// seccion
			oEntrada.Seccion = vSurtido;
			// seccion Entera
			oEntrada.SeccionE = vSurtidoE;
			//N°Pagina
			oEntrada.NPagina = sap.ui.getCore().byId("IdNPaginaFrag").getAccessibilityInfo().description;
			//Principal/Relacionado 

			oEntrada.Posnrprin = vPosnrSkuPrin;
			//oEntrada.PrinRela = sap.ui.getCore().byId("idSelectPR").getAccessibilityInfo().description;
			oEntrada.PrinRela = sap.ui.getCore().byId("idSelectPR")._getSelectedItemText();
			//Sku principal para asignar al relacionado 
			oEntrada.Matnrprin = sap.ui.getCore().byId("IdSkuPrinFrag").getValue();
			oEntrada.Maktxprin = sap.ui.getCore().byId("IdSkuDescriPrincFrag").getValue();

			//Normal/Destacado
			//oEntrada.NormDest = sap.ui.getCore().byId("idSelectND").getAccessibilityInfo().description;
			oEntrada.NormDest = sap.ui.getCore().byId("idSelectND")._getSelectedItemText();

			//Promo Combo
			oEntrada.PromComb = sap.ui.getCore().byId("idSelectPC").getAccessibilityInfo().description;
			oEntrada.PromComb = sap.ui.getCore().byId("idSelectPC")._getSelectedItemText();

			// Nombre Promo 
			oEntrada.Nomprocom = sap.ui.getCore().byId("IdNomPromo").getAccessibilityInfo().description;
			if (oEntrada.Nomprocom.length > 40) {
				sap.m.MessageToast.show("Nombre de la Promo solo permite 40 caracteres");
				vPanelFrag.setBusy(false);
				return;
			}

			//ID Combo
			oEntrada.IdCombo = sap.ui.getCore().byId("IdComboFrag").getAccessibilityInfo().description;
			//Grilla
			oEntrada.Grilla = sap.ui.getCore().byId("IdNGrillaFrag").getAccessibilityInfo().description;
			//Unida de medida
			oEntrada.Vrkme = vVrkme;
			//Acción
			oEntrada.Accion = vAccionFr;
			// Parte 
			oEntrada.Idparte = vParte;
			// Posicion 
			oEntrada.Idposnr = vUltimaPosicion;

			// SKU de remplazo 
			;
			oEntrada.Matnrrem = sap.ui.getCore().byId("IdSkuRem").getValue();

			if (vAccionFr === "I") {
				//agrega informacion a la tabla 
				TabDisplay.push(oEntrada);
				vTable1.setSelectedItem(vTable1.getItems()[0], false, false);

			}
			// busca el indice seleccionado
			if (vAccionFr === "M") {

				// var pp = this.byId("idSearch");
				// pp.setValue("");
				// this.onSearch();

				var rowItems2 = vTable1.getSelectedItem();
				vindexTab = vTable1.indexOfItem(rowItems2);
				TabDisplay[vindexTab] = oEntrada;
			}

			//***************************************************
			//		graba informacion en DB		
			//*****************************************************	

			this.onInserModfSku(vAccionFr, oEntrada, TabDisplay); //Inserta SKU

		},

		onCancelarFrag: function () {
			vPosnrSkuPrin = "";
			this._Dialog.destroy(true);
			this._Dialog.close();

		},

		onValidarSku: function (oEvent) {
			var vRemplazo = "";

			if (oEvent.getSource().getValue() !== "") {

				if (oEvent.getSource().getId() === "IdSkuFrag") {
					var vDescriSkuFrag = sap.ui.getCore().byId("IdSkuDescriFrag");
				}
				//Consulta del SKU de Remplazo
				if (oEvent.getSource().getId() === "IdSkuRem") {
					var vDescriSkuFrag = sap.ui.getCore().byId("IdSkuRemDes");
					vRemplazo = "X";
				}

				vPanelFrag.setBusy(true);
				//valida Sku
				//valida Sku
				var that = this;
				//llama al sevicio de validacion de archivo Excel
				var oEntrada = {
					"Cata": vValNumCatalogo,
					"Parte": "1",
					"Despl": "",
					"Check": "V",
					"Pmensaje1": "",
					"Pmensaje2": "",
					"CosulSkuTcvigSet": [],
					"CosulSkuTdcatSet": [],
					"CosulSkuTpvigSet": []
				};

				var VCosulSkuTdcat = {
					"Idcatalogo": vValNumCatalogo,
					"Idparte": "1",
					"Idposnr": "",
					"Matnr": oEvent.getSource().getValue(),
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
					"Estado": "",
					"Matnrrem": vRemplazo
				};

				oEntrada.CosulSkuTdcatSet.push(VCosulSkuTdcat);

				//evento llamado exitoso 
				function fSuccess(oEvent3) {

					vPanelFrag.setBusy(false);

					if (oEvent3.Pmensaje1 !== "0") {
						sap.m.MessageToast.show("ERROR: " + oEvent3.Pmensaje2);
						vIdSkuOK = ""; // Sku Erroneo
					}
					if (oEvent3.Pmensaje1 === "0") {
						vDescriSkuFrag.setValue(oEvent3.CosulSkuTdcatSet.results[0].Maktx);
						if (oEvent3.CosulSkuTdcatSet.results[0].Matnrrem !== "X") {
							// salta estos pasos si es un SKU de remplazo
							// llena variable para llenar datos faltante de la grilla
							vAtribSurtido = oEvent3.CosulSkuTdcatSet.results[0].Mvgr4; //atributo de surtido
							vSurtido = oEvent3.CosulSkuTdcatSet.results[0].Matkl.substr(0, 2); //surtido
							vSurtidoE = oEvent3.CosulSkuTdcatSet.results[0].Matkl; //surtido completo
							vVrkme = oEvent3.CosulSkuTdcatSet.results[0].Vrkme; //unida de medida de venta 
						}
						vIdSkuOK = "X"; // Sku OK

					}

				}

				function fError(oEvent3) {
					vPanelFrag.setBusy(false);
					sap.m.MessageToast.show("Error al Verificar SKU");

				}

				Modelo.create("/CosulSkuSet", oEntrada, {
					success: fSuccess,
					error: fError
				});

			}

		},

		createColumnConfig: function () {
			return [{
					label: "Centro",
					property: "Centro",
					type: "string",
					width: "25"
				}, {
					label: "Material",
					property: "Matnr",
					type: "string",
					width: "25"
				}, {
					label: "Space",
					property: "Dspace",
					type: "string",
					width: "25"
				}, {
					label: "Precio",
					property: "Precio",
					type: "string",
					width: "25"
				},
				//*****************__TRVL SE AGREGAN NUEVAS COLUMNAS A EXCEL
				{
					label: "Org Venta",
					property: "OrgVta",
					type: "string",
					width: "25"
				}, {
					label: "Canal",
					property: "Canal",
					type: "string",
					width: "25"
				}, {
					label: "Moneda",
					property: "Moneda",
					type: "string",
					width: "25"
				}, {
					label: "Fecha Vig. Inicio",
					property: "FechaVigIni",
					type: "string",
					width: "25"
				}, {
					label: "Fecha Vig. Fin",
					property: "FechaVigFin",
					type: "string",
					width: "25"
				}, {
					label: "Glosa",
					property: "Glosa",
					type: "string",
					width: "25"
				}, {
					label: "Clase Condición",
					property: "ClCond",
					type: "string",
					width: "25"
				},
				//*****************__TRVL SE AGREGAN NUEVAS COLUMNAS A EXCEL ---- FIN
				// CAMBIOS SECCION - INICIO
				{
					label: "Tipo Cambio",
					property: "TipoCambio",
					type: "string"
				}, {
					label: "Cambio Fecha",
					property: "CamFec",
					type: "string"
				}, {
					label: "Cambio Prod",
					property: "CamPro",
					type: "string"
				}, {
					label: "Cambio Precio",
					property: "CamCen",
					type: "string"
				}, {
					label: "Sección",
					property: "Matkl",
					type: "string"
				}
				// CAMBIOS SECCION - FIN
			];

		},

		createColumnConfig2: function () {
			return [{
					label: "Catalogo",
					property: "Idcatalog",
					type: "string",
					width: "25"
				}, {
					label: "Centro",
					property: "Centro",
					type: "string",
					width: "25"
				}, {
					label: "Material",
					property: "Matnr",
					type: "string",
					width: "25"
				}, {
					label: "Precio",
					property: "Precio",
					type: "string",
					width: "25"
				}, {
					label: "Ambito",
					property: "Ambito",
					type: "string",
					width: "25"
				}, {
					label: "Fecha de Caducidad",
					property: "Datbi",
					type: "string",
					width: "25"
				}, {
					label: "Fecha Inicio Validez",
					property: "Datab",
					type: "string",
					width: "25"
				}, {
					label: "Prioridad",
					property: "Prioridad",
					type: "string",
					width: "25"
				}

			];

		},

		createColumnConfig3: function () {
			return [{
					label: "RESPONSABLE",
					property: "Responsable",
					type: "string",
					width: "25"
				}, {
					label: "SECCIÓN",
					property: "Seccion",
					type: "string",
					width: "25"
				}, {
					label: "SAP",
					property: "Matnr",
					type: "string",
					width: "25"
				}, {
					label: "DESCRIPTOR",
					property: "Maktx",
					type: "string",
					width: "35"
				}, {
					label: "FOTO REFERENCIAL",
					property: "Foto",
					type: "string",
					width: "15"
				}, {
					label: "Nº PAG CATÁLOGO",
					property: "Numpaginas",
					type: "string",
					width: "15"
				}, {
					label: "ACCIÓN TIENDA",
					property: "Acciontien",
					type: "string",
					width: "15"
				}, {
					label: "CLUSTER MKT",
					property: "Clustermkt",
					type: "string",
					width: "15"
				}, {
					label: "AVISO PRENSA",
					property: "Aviso",
					type: "string",
					width: "15"
				}, {
					label: "TV",
					property: "Tv",
					type: "string",
					width: "15"
				}, {
					label: "PRINCIPAL/RELACIONADO",
					property: "Princrelac",
					type: "string",
					width: "25"
				}, {
					label: "NORMAL/DESTACADO",
					property: "Normaldest",
					type: "string",
					width: "25"
				}, {
					label: "GRILLA",
					property: "Grilla",
					type: "string",
					width: "15"
				}, {
					label: "EXCEPCIONES",
					property: "Excepcion",
					type: "string",
					width: "15"
				}, {
					label: "PROMO/COMBO",
					property: "Promocombo",
					type: "string",
					width: "15"
				}, {
					label: "STOCK A PUBLICAR",
					property: "Stockapub",
					type: "string",
					width: "16"
				}, {
					//label: "PRECIO NORMAL/ANTES (ZONA1)",
					label: "ZONA1",
					property: "Prnor1",
					type: "string",
					width: "26"
				}, {
					label: "ZONA2",
					property: "Prnor2",
					type: "string",
					width: "5"
				}, {
					label: "ZONA3",
					property: "Prnor3",
					type: "string",
					width: "5"
				}, {
					label: "ZONA4",
					property: "Prnor4",
					type: "string",
					width: "5"
				}, {
					label: "ZONA5",
					property: "Prnor5",
					type: "string",
					width: "5"
				}, {
					label: "ZONA6",
					property: "Prnor6",
					type: "string",
					width: "5"
				}, {
					label: "ZONA7",
					property: "Prnor7",
					type: "string",
					width: "5"
				}, {
					label: "ZONA8",
					property: "Prnor8",
					type: "string",
					width: "5"
				}, {
					label: "ZONA9",
					property: "Prnor9",
					type: "string",
					width: "5"
				}, {
					label: "ZONA10",
					property: "Prnor10",
					type: "string",
					width: "5"
				}, {
					label: "ZONA11",
					property: "Prnor11",
					type: "string",
					width: "5"
				}, {
					label: "ZONA12",
					property: "Prnor12",
					type: "string",
					width: "5"
				}, {
					label: "ZONA113",
					property: "Prnor13",
					type: "string",
					width: "5"
				}, {
					label: "ZONA14",
					property: "Prnor14",
					type: "string",
					width: "5"
				}, {
					label: "ZONA15",
					property: "Prnor15",
					type: "string",
					width: "5"
				}, {
					label: "ZONA16",
					property: "Prnor16",
					type: "string",
					width: "5"
				}, {
					//label: "PRECIO OFERTA/AHORA (ZONA1)",
					label: "ZONA1",
					property: "Profr1",
					type: "string",
					width: "27"
				}, {
					label: "ZONA2",
					property: "Profr2",
					type: "string",
					width: "5"
				}, {
					label: "ZONA3",
					property: "Profr3",
					type: "string",
					width: "5"
				}, {
					label: "ZONA4",
					property: "Profr4",
					type: "string",
					width: "5"
				}, {
					label: "ZONA5",
					property: "Profr5",
					type: "string",
					width: "5"
				}, {
					label: "ZONA6",
					property: "Profr6",
					type: "string",
					width: "5"
				}, {
					label: "ZONA7",
					property: "Profr7",
					type: "string",
					width: "5"
				}, {
					label: "ZONA8",
					property: "Profr8",
					type: "string",
					width: "5"
				}, {
					label: "ZONA9",
					property: "Profr9",
					type: "string",
					width: "5"
				}, {
					label: "ZONA10",
					property: "Profr10",
					type: "string",
					width: "5"
				}, {
					label: "ZONA11",
					property: "Profr11",
					type: "string",
					width: "5"
				}, {
					label: "ZONA12",
					property: "Profr12",
					type: "string",
					width: "5"
				}, {
					label: "ZONA13",
					property: "Profr13",
					type: "string",
					width: "5"
				}, {
					label: "ZONA14",
					property: "Profr14",
					type: "string",
					width: "5"
				}, {
					label: "ZONA15",
					property: "Profr15",
					type: "string",
					width: "5"
				}, {
					label: "ZONA16",
					property: "Profr16",
					type: "string",
					width: "5"
				}, {
					//label: "MUNDO EXPERTO (ZONA1)",
					label: "ZONA1",
					property: "Prmex1",
					type: "string",
					width: "25"
				}, {
					label: "ZONA2",
					property: "Prmex2",
					type: "string",
					width: "5"
				}, {
					label: "ZONA3",
					property: "Prmex3",
					type: "string",
					width: "5"
				}, {
					label: "ZONA4",
					property: "Prmex4",
					type: "string",
					width: "5"
				}, {
					label: "ZONA5",
					property: "Prmex5",
					type: "string",
					width: "5"
				}, {
					label: "ZONA6",
					property: "Prmex6",
					type: "string",
					width: "5"
				}, {
					label: "ZONA7",
					property: "Prmex7",
					type: "string",
					width: "5"
				}, {
					label: "ZONA8",
					property: "Prmex8",
					type: "string",
					width: "5"
				}, {
					label: "ZONA9",
					property: "Prmex9",
					type: "string",
					width: "5"
				}, {
					label: "ZONA10",
					property: "Prmex10",
					type: "string",
					width: "5"
				}, {
					label: "ZONA11",
					property: "Prmex11",
					type: "string",
					width: "5"
				}, {
					label: "ZONA12",
					property: "Prmex12",
					type: "string",
					width: "5"
				}, {
					label: "ZONA13",
					property: "Prmex13",
					type: "string",
					width: "5"
				}, {
					label: "ZONA14",
					property: "Prmex14",
					type: "string",
					width: "5"
				}, {
					label: "ZONA15",
					property: "Prmex15",
					type: "string",
					width: "5"
				}, {
					label: "ZONA16",
					property: "Prmex16",
					type: "string",
					width: "5"
				}, {
					//label: "TARJETA CENCOSUD (PRECIO)",
					label: "PRECIO",
					property: "Prtarj",
					type: "string",
					width: "25"
				}, {
					label: "N°CUOTAS",
					property: "Ncuota",
					type: "string",
					width: "10"
				}, {
					label: "$ CUOTA",
					property: "Vcuota",
					type: "string",
					width: "10"
				}, {
					label: "CTC",
					property: "Ctc",
					type: "string",
					width: "10"
				}, {
					label: "CAE",
					property: "Cae",
					type: "string",
					width: "10"
				}, {
					label: "PUNTOS",
					property: "Puntos",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 2 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj2",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 2",
					label: "N°CUOTAS",
					property: "Ncuota2",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 2",
					label: "$ CUOTA",
					property: "Vcuota2",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 2",
					label: "CTC",
					property: "Ctc2",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 2",
					label: "CAE",
					property: "Cae 2",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 2",
					label: "PUNTOS",
					property: "Puntos2",
					type: "string",
					width: "10"
				}, {
					//	label: "TARJETA CENCOSUD 3 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj3",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 3",
					label: "N°CUOTAS",
					property: "Ncuota3",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 3",
					label: "$ CUOTA",
					property: "Vcuota3",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 3",
					label: "CTC",
					property: "Ctc3",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 3",
					label: "CAE",
					property: "Cae3",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 3",
					label: "PUNTOS",
					property: "Puntos3",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 4 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj4",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 4",
					label: "N°CUOTAS",
					property: "Ncuota4",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 4",
					label: "$ CUOTA",
					property: "Vcuota4",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 4",
					label: "CTC",
					property: "Ctc4",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 4",
					label: "CAE",
					property: "Cae4",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 4",
					label: "PUNTOS",
					property: "Puntos4",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 5 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj5",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 5",
					label: "N°CUOTAS",
					property: "Ncuota5",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 5",
					label: "$ CUOTA",
					property: "Vcuota5",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 5",
					label: "CTC",
					property: "Ctc5",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 5",
					label: "CAE",
					property: "Cae5",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 5",
					label: "PUNTOS",
					property: "Puntos5",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 6 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj6",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 6",
					label: "N°CUOTAS",
					property: "Ncuota6",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 6",
					label: "$ CUOTA",
					property: "Vcuota6",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 6",
					label: "CTC",
					property: "Ctc6",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 6",
					label: "CAE",
					property: "Cae6",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 6",
					label: "PUNTOS",
					property: "Puntos6",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 7 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj7",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 7",
					label: "N°CUOTAS",
					property: "Ncuota7",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 7",
					label: "$ CUOTA",
					property: "Vcuota",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 7",
					label: "CTC",
					property: "Ctc7",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 7",
					label: "CAE",
					property: "Cae7",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 7",
					label: "PUNTOS",
					property: "Puntos7",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 8 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj8",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 8",
					label: "N°CUOTAS",
					property: "Ncuota8",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 8",
					label: "$ CUOTA",
					property: "Vcuota8",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 8",
					label: "CTC",
					property: "Ctc8",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 8",
					label: "CAE",
					property: "Cae8",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 8",
					label: "PUNTOS",
					property: "Puntos8",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 9 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj9",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 9",
					label: "N°CUOTAS",
					property: "Ncuota9",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 9",
					label: "$ CUOTA",
					property: "Vcuota9",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 9",
					label: "CTC",
					property: "Ctc9",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 9",
					label: "CAE",
					property: "Cae9",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 9",
					label: "PUNTOS",
					property: "Puntos9",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 10 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj10",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 10",
					label: "N°CUOTAS",
					property: "Ncuota10",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 10",
					label: "$ CUOTA",
					property: "Vcuota10",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 10",
					label: "CTC",
					property: "Ctc10",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 10",
					label: "CAE",
					property: "Cae10",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 10",
					label: "PUNTOS",
					property: "Puntos10",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 11 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj11",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 11",
					label: "N°CUOTAS",
					property: "Ncuota11",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 11",
					label: "$ CUOTA",
					property: "Vcuota11",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 11",
					label: "CTC",
					property: "Ctc11",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 11",
					label: "CAE",
					property: "Cae11",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 11",
					label: "PUNTOS",
					property: "Puntos11",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 12 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj12",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 12",
					label: "N°CUOTAS",
					property: "Ncuota12",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 12",
					label: "$ CUOTA",
					property: "Vcuota12",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 12",
					label: "CTC",
					property: "Ctc12",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 12",
					label: "CAE",
					property: "Cae12",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 12",
					label: "PUNTOS",
					property: "Puntos12",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 13 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj13",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 13",
					label: "N°CUOTAS",
					property: "Ncuota13",
					type: "string",
					width: "10"
				}, {
					label: "$ CUOTA 13",
					// label: "$ CUOTA",
					property: "Vcuota13",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 13",
					label: "CTC",
					property: "Ctc13",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 13",
					label: "CAE",
					property: "Cae13",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 13",
					label: "PUNTOS",
					property: "Puntos13",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 14 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj14",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 14",
					label: "N°CUOTAS",
					property: "Ncuota14",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 14",
					label: "$ CUOTA",
					property: "Vcuota14",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 14",
					label: "CTC",
					property: "Ctc14",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 14",
					label: "CAE",
					property: "Cae14",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 14",
					label: "PUNTOS",
					property: "Puntos14",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 15 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj15",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 15",
					label: "N°CUOTAS",
					property: "Ncuota15",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 15",
					label: "$ CUOTA",
					property: "Vcuota15",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 15",
					label: "CTC",
					property: "Ctc15",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 15",
					label: "CAE",
					property: "Cae15",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 15",
					label: "PUNTOS",
					property: "Puntos 15",
					type: "string",
					width: "10"
				}, {
					//label: "TARJETA CENCOSUD 16 (PRECIO)",
					label: "PRECIO",
					property: "Prtarj16",
					type: "string",
					width: "25"
				}, {
					//label: "N°CUOTAS 16",
					label: "N°CUOTAS",
					property: "Ncuota16",
					type: "string",
					width: "10"
				}, {
					//label: "$ CUOTA 16",
					label: "$ CUOTA",
					property: "Vcuota16",
					type: "string",
					width: "10"
				}, {
					//label: "CTC 16",
					label: "CTC",
					property: "Ctc16",
					type: "string",
					width: "10"
				}, {
					//label: "CAE 16",
					label: "CAE",
					property: "Cae16",
					type: "string",
					width: "10"
				}, {
					//label: "PUNTOS 16",
					label: "PUNTOS",
					property: "Puntos16",
					type: "string",
					width: "10"
				}

			];

		},

		DescargarArEvento: function (vTipo) {

			var that = this;
			//var worksheet = workbook.getWorksheet(1);
			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;
			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Idcatalog",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vValNumCatalogo
			});
			oFilters.push(filter);

			//Check
			filter = new sap.ui.model.Filter({
				path: "Checkp",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vTipo
			});
			oFilters.push(filter);

			//Origen
			filter = new sap.ui.model.Filter({
				path: "Origen",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "C"
			});
			oFilters.push(filter);

			//var vLine = "/ConsulPrecioEventSet?$filter=Idcatalog eq '" + vValNumCatalogo + "' and Checkp eq '"+ vTipo +"'";

			function fSuccess(oEvent) {

				if (oEvent.results.length > 0) {
					if (oEvent.results[0].Pmensaje1 !== 0) {
						sap.m.MessageToast.show(oEvent.results[0].Pmensaje2);
						bDialog.close();
					} else {
						var vTab1 = [];
						for (var i = 0; i < oEvent.results.length; i++) {
							var vLine1 = {
								Centro: oEvent.results[i].Centro,
								Matnr: oEvent.results[i].Matnr,
								Dspace: "",
								Precio: oEvent.results[i].Precio,
								//*****__TRVL
								OrgVta: oEvent.results[i].OrgVta,
								Canal: oEvent.results[i].Canal,
								Moneda: oEvent.results[i].Moneda,
								FechaVigIni: oEvent.results[i].FechaVigIni,
								FechaVigFin: oEvent.results[i].FechaVigFin,
								Glosa: oEvent.results[i].Glosa,
								ClCond: oEvent.results[i].ClCond,
								//*****__TRVL
								// CAMBIOS SECCION - INICIO
								TipoCambio: oEvent.results[i].TipoCambio,
								CamFec: oEvent.results[i].CamFec,
								CamPro: oEvent.results[i].CamPro,
								CamCen: oEvent.results[i].CamCen,
								Matkl: oEvent.results[i].Matkl
									// CAMBIOS SECCION - FIN
							};
							vTab1.push(vLine1);

						}

						// descarga archivo
						if (vTab1.length > 0) {

							var aCols, oSettings, oSheet;

							var NomFile = vNomarchivo + ".xlsx";

							aCols = that.createColumnConfig();

							oSettings = {
								workbook: {
									columns: aCols

								},
								dataSource: vTab1,
								fileName: NomFile
							};
							bDialog.close();
							oSheet = new Spreadsheet(oSettings);

							oSheet.build()
								.then(function () {
									sap.m.MessageToast.show("Archivo Descargado");
								})
								.finally(function () {
									oSheet.destroy();
								});

						}

					}

				} else {

					sap.m.MessageToast.show("Archivo para descarga Vacio ");
					bDialog.close();
				}

			}

			function fError(oEvent) {
				bDialog.close();
				sap.m.MessageToast.show("Error al Buscar Data");

			}
			bDialog.open();
			Modelo.read("/ConsulPrecioEventSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

			this._Dialog.destroy(true);
			this._Dialog.close();

		},

		DescargarArCaducado: function (vTipo) {
			var that = this;
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: " dd/MM/YYYY"
			});

			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;
			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Idcata",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vValNumCatalogo
			});
			oFilters.push(filter);

			//Check
			filter = new sap.ui.model.Filter({
				path: "Check",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vTipo
			});
			oFilters.push(filter);

			function fSuccess(oEvent) {

				if (oEvent.results[0].Pmensaje1 !== "0") {
					sap.m.MessageToast.show(oEvent.results[0].Pmensaje2);
					bDialog.close();
				} else {
					var vTab1 = [];

					for (var i = 0; i < oEvent.results.length; i++) {
						var vLine1 = {
							Idcatalog: oEvent.results[i].Idcatalog,
							Centro: oEvent.results[i].Centro,
							Matnr: oEvent.results[i].Matnr,
							Precio: oEvent.results[i].Precio,
							Ambito: oEvent.results[i].Ambito,
							// Datbi: dateFormat.format(oEvent.results[i].Datbi), //da formato de salida a fecha,
							Datbi: dateFormat.format(new Date(oEvent.results[i].Datbi), true),
							// Datab: dateFormat.format(oEvent.results[i].Datab), // da formato de salide a fecha ,
							Datab: dateFormat.format(new Date(oEvent.results[i].Datab), true),
							Prioridad: oEvent.results[i].Prioridad
						};
						vTab1.push(vLine1);

					}

					// descarga archivo
					if (vTab1.length > 0) {
						var aCols, oSettings, oSheet;
						var NomFile = vNomarchivo + ".xlsx";

						aCols = that.createColumnConfig2();

						oSettings = {
							workbook: {
								columns: aCols
							},
							dataSource: vTab1,
							fileName: NomFile
						};
						bDialog.close();
						oSheet = new Spreadsheet(oSettings);

						oSheet.build()
							.then(function () {
								sap.m.MessageToast.show("Archivo Descargado");
							})
							.finally(function () {
								oSheet.destroy();
							});

					}

				}

			}

			function fError(oEvent) {

				bDialog.close();
				sap.m.MessageToast.show("Error al Buscar Data");

			}
			bDialog.open();

			Modelo.read("/ConsulPrecioCaducSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

			this._Dialog.destroy(true);
			this._Dialog.close();

		},

		DescargarMarketing: function (vTipo) {
			var that = this;
			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;

			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Idcatalog",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vValNumCatalogo
			});
			oFilters.push(filter);
			//Tipo catalogo
			filter = new sap.ui.model.Filter({
				path: "Tipocat",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vTipo
			});
			oFilters.push(filter);

			function fSuccess(oEvent) {

				if (oEvent.results[0].Pmensaje1 !== 0) {
					sap.m.MessageToast.show(oEvent.results[0].Pmensaje2);
					bDialog.close();
				} else {

					var vTab1 = [];

					for (var i = 0; i < oEvent.results.length; i++) {
						var vLine1 = {
							Fechafin: oEvent.results[i].Fechafin,
							Fechaini: oEvent.results[i].Fechaini,
							Idcatalog: oEvent.results[i].Idcatalog,
							Tipocat: oEvent.results[i].Tipocat,
							Pmensaje1: oEvent.results[i].Pmensaje1,
							Pmensaje2: oEvent.results[i].Pmensaje2,
							Idcatalogo: oEvent.results[i].Idcatalogo,
							Responsable: oEvent.results[i].Responsable,
							Seccion: oEvent.results[i].Seccion,
							Matnr: oEvent.results[i].Matnr,
							Maktx: oEvent.results[i].Maktx,
							Foto: oEvent.results[i].Foto,
							Numpaginas: oEvent.results[i].Numpaginas,
							Acciontien: oEvent.results[i].Acciontien,
							Clustermkt: oEvent.results[i].Clustermkt,
							Aviso: oEvent.results[i].Aviso,
							Tv: oEvent.results[i].Tv,
							Princrelac: oEvent.results[i].Princrelac,
							Normaldest: oEvent.results[i].Normaldest,
							Grilla: oEvent.results[i].Grilla,
							Excepcion: oEvent.results[i].Excepcion,
							Promocombo: oEvent.results[i].Promocombo,
							Stockapub: oEvent.results[i].Stockapub,
							Prnor1: oEvent.results[i].Prnor1,
							Prnor2: oEvent.results[i].Prnor2,
							Prnor3: oEvent.results[i].Prnor3,
							Prnor4: oEvent.results[i].Prnor4,
							Prnor5: oEvent.results[i].Prnor5,
							Prnor6: oEvent.results[i].Prnor6,
							Prnor7: oEvent.results[i].Prnor7,
							Prnor8: oEvent.results[i].Prnor8,
							Prnor9: oEvent.results[i].Prnor9,
							Prnor10: oEvent.results[i].Prnor10,
							Prnor11: oEvent.results[i].Prnor11,
							Prnor12: oEvent.results[i].Prnor12,
							Prnor13: oEvent.results[i].Prnor13,
							Prnor14: oEvent.results[i].Prnor14,
							Prnor15: oEvent.results[i].Prnor15,
							Prnor16: oEvent.results[i].Prnor16,
							Profr1: oEvent.results[i].Profr1,
							Profr2: oEvent.results[i].Profr2,
							Profr3: oEvent.results[i].Profr3,
							Profr4: oEvent.results[i].Profr4,
							Profr5: oEvent.results[i].Profr5,
							Profr6: oEvent.results[i].Profr6,
							Profr7: oEvent.results[i].Profr7,
							Profr8: oEvent.results[i].Profr8,
							Profr9: oEvent.results[i].Profr9,
							Profr10: oEvent.results[i].Profr10,
							Profr11: oEvent.results[i].Profr11,
							Profr12: oEvent.results[i].Profr12,
							Profr13: oEvent.results[i].Profr13,
							Profr14: oEvent.results[i].Profr14,
							Profr15: oEvent.results[i].Profr15,
							Profr16: oEvent.results[i].Profr16,
							Prmex1: oEvent.results[i].Prmex1,
							Prmex2: oEvent.results[i].Prmex2,
							Prmex3: oEvent.results[i].Prmex3,
							Prmex4: oEvent.results[i].Prmex4,
							Prmex5: oEvent.results[i].Prmex5,
							Prmex6: oEvent.results[i].Prmex6,
							Prmex7: oEvent.results[i].Prmex7,
							Prmex8: oEvent.results[i].Prmex8,
							Prmex9: oEvent.results[i].Prmex9,
							Prmex10: oEvent.results[i].Prmex10,
							Prmex11: oEvent.results[i].Prmex11,
							Prmex12: oEvent.results[i].Prmex12,
							Prmex13: oEvent.results[i].Prmex13,
							Prmex14: oEvent.results[i].Prmex14,
							Prmex15: oEvent.results[i].Prmex15,
							Prmex16: oEvent.results[i].Prmex16,
							Prtarj: oEvent.results[i].Prtarj,
							Ncuota: oEvent.results[i].Ncuota,
							Vcuota: oEvent.results[i].Vcuota,
							Ctc: oEvent.results[i].Ctc,
							Cae: oEvent.results[i].Cae,
							Puntos: oEvent.results[i].Puntos,
							Prtarj2: oEvent.results[i].Prtarj2,
							Ncuota2: oEvent.results[i].Ncuota2,
							Vcuota2: oEvent.results[i].Vcuota2,
							Ctc2: oEvent.results[i].Ctc2,
							Cae2: oEvent.results[i].Cae2,
							Puntos2: oEvent.results[i].Puntos2,
							Prtarj3: oEvent.results[i].Prtarj3,
							Ncuota3: oEvent.results[i].Ncuota3,
							Vcuota3: oEvent.results[i].Vcuota3,
							Ctc3: oEvent.results[i].Ctc3,
							Cae3: oEvent.results[i].Cae3,
							Puntos3: oEvent.results[i].Puntos3,
							Prtarj4: oEvent.results[i].Prtarj4,
							Ncuota4: oEvent.results[i].Ncuota4,
							Vcuota4: oEvent.results[i].Vcuota4,
							Ctc4: oEvent.results[i].Ctc4,
							Cae4: oEvent.results[i].Cae4,
							Puntos4: oEvent.results[i].Puntos4,
							Prtarj5: oEvent.results[i].Prtarj5,
							Ncuota5: oEvent.results[i].Ncuota5,
							Vcuota5: oEvent.results[i].Vcuota5,
							Ctc5: oEvent.results[i].Ctc5,
							Cae5: oEvent.results[i].Cae5,
							Puntos5: oEvent.results[i].Puntos5,
							Prtarj6: oEvent.results[i].Prtarj6,
							Ncuota6: oEvent.results[i].Ncuota6,
							Vcuota6: oEvent.results[i].Vcuota6,
							Ctc6: oEvent.results[i].Ctc6,
							Cae6: oEvent.results[i].Cae6,
							Puntos6: oEvent.results[i].Puntos6,
							Prtarj7: oEvent.results[i].Prtarj7,
							Ncuota7: oEvent.results[i].Ncuota7,
							Vcuota7: oEvent.results[i].Vcuota7,
							Ctc7: oEvent.results[i].Ctc7,
							Cae7: oEvent.results[i].Cae7,
							Puntos7: oEvent.results[i].Puntos7,
							Prtarj8: oEvent.results[i].Prtarj8,
							Ncuota8: oEvent.results[i].Ncuota8,
							Vcuota8: oEvent.results[i].Vcuota8,
							Ctc8: oEvent.results[i].Ctc8,
							Cae8: oEvent.results[i].Cae8,
							Puntos8: oEvent.results[i].Puntos8,
							Prtarj9: oEvent.results[i].Prtarj9,
							Ncuota9: oEvent.results[i].Ncuota9,
							Vcuota9: oEvent.results[i].Vcuota9,
							Ctc9: oEvent.results[i].Ctc9,
							Cae9: oEvent.results[i].Cae9,
							Puntos9: oEvent.results[i].Puntos9,
							Prtarj10: oEvent.results[i].Prtarj10,
							Ncuota10: oEvent.results[i].Ncuota10,
							Vcuota10: oEvent.results[i].Vcuota10,
							Ctc10: oEvent.results[i].Ctc10,
							Cae10: oEvent.results[i].Cae10,
							Puntos10: oEvent.results[i].Puntos10,
							Prtarj11: oEvent.results[i].Prtarj11,
							Ncuota11: oEvent.results[i].Ncuota11,
							Vcuota11: oEvent.results[i].Vcuota11,
							Ctc11: oEvent.results[i].Ctc11,
							Cae11: oEvent.results[i].Cae11,
							Puntos11: oEvent.results[i].Puntos11,
							Prtarj12: oEvent.results[i].Prtarj12,
							Ncuota12: oEvent.results[i].Ncuota12,
							Vcuota12: oEvent.results[i].Vcuota12,
							Ctc12: oEvent.results[i].Ctc12,
							Cae12: oEvent.results[i].Cae12,
							Puntos12: oEvent.results[i].Puntos12,
							Prtarj13: oEvent.results[i].Prtarj13,
							Ncuota13: oEvent.results[i].Ncuota13,
							Vcuota13: oEvent.results[i].Vcuota13,
							Ctc13: oEvent.results[i].Ctc13,
							Cae13: oEvent.results[i].Cae13,
							Puntos13: oEvent.results[i].Puntos13,
							Prtarj14: oEvent.results[i].Prtarj14,
							Ncuota14: oEvent.results[i].Ncuota14,
							Vcuota14: oEvent.results[i].Vcuota14,
							Ctc14: oEvent.results[i].Ctc14,
							Cae14: oEvent.results[i].Cae14,
							Puntos14: oEvent.results[i].Puntos14,
							Prtarj15: oEvent.results[i].Prtarj15,
							Ncuota15: oEvent.results[i].Ncuota15,
							Vcuota15: oEvent.results[i].Vcuota15,
							Ctc15: oEvent.results[i].Ctc15,
							Cae15: oEvent.results[i].Cae15,
							Puntos15: oEvent.results[i].Puntos15,
							Prtarj16: oEvent.results[i].Prtarj16,
							Ncuota16: oEvent.results[i].Ncuota16,
							Vcuota16: oEvent.results[i].Vcuota16,
							Ctc16: oEvent.results[i].Ctc16,
							Cae16: oEvent.results[i].Cae16,
							Puntos16: oEvent.results[i].Puntos16

						};

						that.eliminaCeros(vLine1);
						vTab1.push(vLine1);
					}

					// descarga archivo
					if (vTab1.length > 0) {

						var aCols, oSettings, oSheet;
						var NomFile = vNomarchivo + ".xlsx";
						aCols = that.createColumnConfig3();

						oSettings = {

							workbook: {
								columns: aCols
							},

							dataSource: vTab1,
							fileName: NomFile
						};
						bDialog.close();
						oSheet = new Spreadsheet(oSettings);

						// oSheet.mergeCells("C1", "J2");
						// oSheet.getCell("C1").value = "Client List";

						oSheet.build()
							.then(function () {
								sap.m.MessageToast.show("Archivo Descargado");
							})
							.finally(function () {
								oSheet.destroy();
							});

					}

				}

			}

			function fError(oEvent) {
				bDialog.close();
				sap.m.MessageToast.show("Error al Buscar Data");

			}
			bDialog.open();
			Modelo.read("/ConsulMarketingSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});
			this._Dialog.destroy(true);
			this._Dialog.close();

		},

		eliminaCeros: function (vLine) {

			if (vLine.Prnor1 === "0") {
				vLine.Prnor1 = "";
			}
			if (vLine.Prnor2 === "0") {
				vLine.Prnor2 = "";
			}
			if (vLine.Prnor3 === "0") {
				vLine.Prnor3 = "";
			}
			if (vLine.Prnor4 === "0") {
				vLine.Prnor4 = "";
			}
			if (vLine.Prnor5 === "0") {
				vLine.Prnor5 = "";
			}
			if (vLine.Prnor6 === "0") {
				vLine.Prnor6 = "";
			}
			if (vLine.Prnor7 === "0") {
				vLine.Prnor7 = "";
			}
			if (vLine.Prnor8 === "0") {
				vLine.Prnor8 = "";
			}
			if (vLine.Prnor9 === "0") {
				vLine.Prnor9 = "";
			}
			if (vLine.Prnor10 === "0") {
				vLine.Prnor10 = "";
			}
			if (vLine.Prnor11 === "0") {
				vLine.Prnor11 = "";
			}
			if (vLine.Prnor12 === "0") {
				vLine.Prnor12 = "";
			}
			if (vLine.Prnor13 === "0") {
				vLine.Prnor13 = "";
			}
			if (vLine.Prnor14 === "0") {
				vLine.Prnor14 = "";
			}
			if (vLine.Prnor15 === "0") {
				vLine.Prnor15 = "";
			}
			if (vLine.Prnor16 === "0") {
				vLine.Prnor16 = "";
			}

			if (vLine.Profr1 === "0") {
				vLine.Profr1 = "";
			}
			if (vLine.Profr2 === "0") {
				vLine.Profr2 = "";
			}
			if (vLine.Profr3 === "0") {
				vLine.Profr3 = "";
			}
			if (vLine.Profr4 === "0") {
				vLine.Profr4 = "";
			}
			if (vLine.Profr5 === "0") {
				vLine.Profr5 = "";
			}
			if (vLine.Profr6 === "0") {
				vLine.Profr6 = "";
			}
			if (vLine.Profr7 === "0") {
				vLine.Profr7 = "";
			}
			if (vLine.Profr8 === "0") {
				vLine.Profr8 = "";
			}
			if (vLine.Profr9 === "0") {
				vLine.Profr9 = "";
			}
			if (vLine.Profr10 === "0") {
				vLine.Profr10 = "";
			}
			if (vLine.Profr11 === "0") {
				vLine.Profr11 = "";
			}
			if (vLine.Profr12 === "0") {
				vLine.Profr12 = "";
			}
			if (vLine.Profr13 === "0") {
				vLine.Profr13 = "";
			}
			if (vLine.Profr14 === "0") {
				vLine.Profr14 = "";
			}
			if (vLine.Profr15 === "0") {
				vLine.Profr15 = "";
			}
			if (vLine.Profr16 === "0") {
				vLine.Profr16 = "";
			}
			//
			if (vLine.Prmex1 === "0") {
				vLine.Prmex1 = "";
			}
			if (vLine.Prmex2 === "0") {
				vLine.Prmex2 = "";
			}
			if (vLine.Prmex3 === "0") {
				vLine.Prmex3 = "";
			}
			if (vLine.Prmex4 === "0") {
				vLine.Prmex4 = "";
			}
			if (vLine.Prmex5 === "0") {
				vLine.Prmex5 = "";
			}
			if (vLine.Prmex6 === "0") {
				vLine.Prmex6 = "";
			}
			if (vLine.Prmex7 === "0") {
				vLine.Prmex7 = "";
			}
			if (vLine.Prmex8 === "0") {
				vLine.Prmex8 = "";
			}
			if (vLine.Prmex9 === "0") {
				vLine.Prmex9 = "";
			}
			if (vLine.Prmex10 === "0") {
				vLine.Prmex10 = "";
			}
			if (vLine.Prmex11 === "0") {
				vLine.Prmex11 = "";
			}
			if (vLine.Prmex12 === "0") {
				vLine.Prmex12 = "";
			}
			if (vLine.Prmex13 === "0") {
				vLine.Prmex13 = "";
			}
			if (vLine.Prmex14 === "0") {
				vLine.Prmex14 = "";
			}
			if (vLine.Prmex15 === "0") {
				vLine.Prmex15 = "";
			}
			if (vLine.Prmex16 === "0") {
				vLine.Prmex16 = "";
			}
			if (vLine.Prtarj === "0") {
				vLine.Prtarj = "";
			}
			if (vLine.Prtarj2 === "0") {
				vLine.Prtarj2 = "";
			}
			if (vLine.Prtarj3 === "0") {
				vLine.Prtarj3 = "";
			}
			if (vLine.Prtarj4 === "0") {
				vLine.Prtarj4 = "";
			}
			if (vLine.Prtarj5 === "0") {
				vLine.Prtarj5 = "";
			}
			if (vLine.Prtarj6 === "0") {
				vLine.Prtarj6 = "";
			}
			if (vLine.Prtarj7 === "0") {
				vLine.Prtarj7 = "";
			}
			if (vLine.Prtarj8 === "0") {
				vLine.Prtarj8 = "";
			}
			if (vLine.Prtarj9 === "0") {
				vLine.Prtarj9 = "";
			}
			if (vLine.Prtarj10 === "0") {
				vLine.Prtarj10 = "";
			}
			if (vLine.Prtarj11 === "0") {
				vLine.Prtarj11 = "";
			}
			if (vLine.Prtarj12 === "0") {
				vLine.Prtarj12 = "";
			}
			if (vLine.Prtarj13 === "0") {
				vLine.Prtarj13 = "";
			}
			if (vLine.Prtarj14 === "0") {
				vLine.Prtarj14 = "";
			}
			if (vLine.Prtarj15 === "0") {
				vLine.Prtarj15 = "";
			}
			if (vLine.Prtarj16 === "0") {
				vLine.Prtarj16 = "";
			}
			if (vLine.Ncuota === "0") {
				vLine.Ncuota = "";
			}
			if (vLine.Ncuota2 === "0") {
				vLine.Ncuota2 = "";
			}
			if (vLine.Ncuota3 === "0") {
				vLine.Ncuota3 = "";
			}
			if (vLine.Ncuota4 === "0") {
				vLine.Ncuota4 = "";
			}
			if (vLine.Ncuota5 === "0") {
				vLine.Ncuota5 = "";
			}
			if (vLine.Ncuota6 === "0") {
				vLine.Ncuota6 = "";
			}
			if (vLine.Ncuota7 === "0") {
				vLine.Ncuota7 = "";
			}
			if (vLine.Ncuota8 === "0") {
				vLine.Ncuota8 = "";
			}
			if (vLine.Ncuota9 === "0") {
				vLine.Ncuota9 = "";
			}
			if (vLine.Ncuota10 === "0") {
				vLine.Ncuota10 = "";
			}
			if (vLine.Ncuota11 === "0") {
				vLine.Ncuota11 = "";
			}
			if (vLine.Ncuota12 === "0") {
				vLine.Ncuota12 = "";
			}
			if (vLine.Ncuota13 === "0") {
				vLine.Ncuota13 = "";
			}
			if (vLine.Ncuota14 === "0") {
				vLine.Ncuota14 = "";
			}
			if (vLine.Ncuota15 === "0") {
				vLine.Ncuota15 = "";
			}
			if (vLine.Ncuota16 === "0") {
				vLine.Ncuota16 = "";
			}
			if (vLine.Vcuota === "0") {
				vLine.Vcuota = "";
			}
			if (vLine.Vcuota2 === "0") {
				vLine.Vcuota2 = "";
			}
			if (vLine.Vcuota3 === "0") {
				vLine.Vcuota3 = "";
			}
			if (vLine.Vcuota4 === "0") {
				vLine.Vcuota4 = "";
			}
			if (vLine.Vcuota5 === "0") {
				vLine.Vcuota5 = "";
			}
			if (vLine.Vcuota6 === "0") {
				vLine.Vcuota6 = "";
			}
			if (vLine.Vcuota7 === "0") {
				vLine.Vcuota7 = "";
			}
			if (vLine.Vcuota8 === "0") {
				vLine.Vcuota8 = "";
			}
			if (vLine.Vcuota9 === "0") {
				vLine.Vcuota9 = "";
			}
			if (vLine.Vcuota10 === "0") {
				vLine.Vcuota10 = "";
			}
			if (vLine.Vcuota11 === "0") {
				vLine.Vcuota11 = "";
			}
			if (vLine.Vcuota12 === "0") {
				vLine.Vcuota12 = "";
			}
			if (vLine.Vcuota13 === "0") {
				vLine.Vcuota13 = "";
			}
			if (vLine.Vcuota14 === "0") {
				vLine.Vcuota14 = "";
			}
			if (vLine.Vcuota15 === "0") {
				vLine.Vcuota15 = "";
			}
			if (vLine.Vcuota16 === "0") {
				vLine.Vcuota16 = "";
			}
			if (vLine.Ctc === "0") {
				vLine.Ctc = "";
			}
			if (vLine.Ctc2 === "0") {
				vLine.Ctc2 = "";
			}
			if (vLine.Ctc3 === "0") {
				vLine.Ctc3 = "";
			}
			if (vLine.Ctc4 === "0") {
				vLine.Ctc4 = "";
			}
			if (vLine.Ctc5 === "0") {
				vLine.Ctc5 = "";
			}
			if (vLine.Ctc6 === "0") {
				vLine.Ctc6 = "";
			}
			if (vLine.Ctc7 === "0") {
				vLine.Ctc7 = "";
			}
			if (vLine.Ctc8 === "0") {
				vLine.Ctc8 = "";
			}
			if (vLine.Ctc9 === "0") {
				vLine.Ctc9 = "";
			}
			if (vLine.Ctc10 === "0") {
				vLine.Ctc10 = "";
			}
			if (vLine.Ctc11 === "0") {
				vLine.Ctc11 = "";
			}
			if (vLine.Ctc12 === "0") {
				vLine.Ctc12 = "";
			}
			if (vLine.Ctc13 === "0") {
				vLine.Ctc13 = "";
			}
			if (vLine.Ctc14 === "0") {
				vLine.Ctc14 = "";
			}
			if (vLine.Ctc15 === "0") {
				vLine.Ctc15 = "";
			}
			if (vLine.Ctc16 === "0") {
				vLine.Ctc16 = "";
			}
			if (vLine.Cae === "0") {
				vLine.Cae = "";
			}
			if (vLine.Cae2 === "0") {
				vLine.Cae2 = "";
			}
			if (vLine.Cae3 === "0") {
				vLine.Cae3 = "";
			}
			if (vLine.Cae4 === "0") {
				vLine.Cae4 = "";
			}
			if (vLine.Cae5 === "0") {
				vLine.Cae5 = "";
			}
			if (vLine.Cae6 === "0") {
				vLine.Cae6 = "";
			}
			if (vLine.Cae7 === "0") {
				vLine.Cae7 = "";
			}
			if (vLine.Cae8 === "0") {
				vLine.Cae8 = "";
			}
			if (vLine.Cae9 === "0") {
				vLine.Cae9 = "";
			}
			if (vLine.Cae10 === "0") {
				vLine.Cae10 = "";
			}
			if (vLine.Cae11 === "0") {
				vLine.Cae11 = "";
			}
			if (vLine.Cae12 === "0") {
				vLine.Cae12 = "";
			}
			if (vLine.Cae13 === "0") {
				vLine.Cae13 = "";
			}
			if (vLine.Cae14 === "0") {
				vLine.Cae14 = "";
			}
			if (vLine.Cae15 === "0") {
				vLine.Cae15 = "";
			}
			if (vLine.Cae16 === "0") {
				vLine.Cae16 = "";
			}
			if (vLine.Puntos === "0") {
				vLine.Puntos = "";
			}
			if (vLine.Puntos2 === "0") {
				vLine.Puntos2 = "";
			}
			if (vLine.Puntos3 === "0") {
				vLine.Puntos3 = "";
			}
			if (vLine.Puntos4 === "0") {
				vLine.Puntos4 = "";
			}
			if (vLine.Puntos5 === "0") {
				vLine.Puntos5 = "";
			}
			if (vLine.Puntos6 === "0") {
				vLine.Puntos6 = "";
			}
			if (vLine.Puntos7 === "0") {
				vLine.Puntos7 = "";
			}
			if (vLine.Puntos8 === "0") {
				vLine.Puntos8 = "";
			}
			if (vLine.Puntos9 === "0") {
				vLine.Puntos9 = "";
			}
			if (vLine.Puntos10 === "0") {
				vLine.Puntos10 = "";
			}
			if (vLine.Puntos11 === "0") {
				vLine.Puntos11 = "";
			}
			if (vLine.Puntos12 === "0") {
				vLine.Puntos12 = "";
			}
			if (vLine.Puntos13 === "0") {
				vLine.Puntos13 = "";
			}
			if (vLine.Puntos14 === "0") {
				vLine.Puntos14 = "";
			}
			if (vLine.Puntos15 === "0") {
				vLine.Puntos15 = "";
			}
			if (vLine.Puntos16 === "0") {
				vLine.Puntos16 = "";
			}

		},

		onDescargarAr: function () {

			var that = this;

			//tomo lo seleccionado archivo a descargar
			var vSelec = sap.ui.getCore().byId("idSelectEvento");
			var vSelecIten = vSelec.getSelectedItemId();

			var vTipo = "";

			if (vSelecIten === "item1") {
				// descarga archivo Precio Evento Promocional
				vTipo = "V";
				vNomarchivo = "Precios Normales Propuestos";
				this.DescargarArEvento(vTipo);

			}

			if (vSelecIten === "item2") {
				// descarga archivo Precio Evento vigente 
				vTipo = "P";
				vNomarchivo = "Precios Promocionales Propuestos";
				this.DescargarArEvento(vTipo);

			}
			if (vSelecIten === "item3") {
				// descarga archivo Precio promocionales  a caducar 
				vTipo = "C";
				vNomarchivo = "Precios Promocionales a Caducar";
				this.DescargarArCaducado(vTipo);

			}
			if (vSelecIten === "item4") {
				// Normalizacion de precios
				vTipo = "N";
				vNomarchivo = "Precios Antes de Catalogo";
				this.DescargarArCaducado(vTipo);

			}
			if (vSelecIten === "item5") {
				// Normalizacion de precios
				vTipo = "1";
				vNomarchivo = "Planilla de SKU’s para Marketing";
				this.DescargarMarketing(vTipo);

			}

		},

		onCerrarFrag: function () {
			this._Dialog.destroy(true);
			this._Dialog.close();
		},

		onCambiarPrincRela: function (e) {

			var item = e.getParameters().selectedItem;
			var promoSel = item.getKey();
			//habilita/desabiita la entrada del campo material Principal, para los registros relacionados
			var vInputMatRelac = sap.ui.getCore().byId("IdSkuPrinFrag");
			if (promoSel === "02") {

				vInputMatRelac.setBlocked(false);
				vRelacionadoOn = "SI";

			} else {
				vInputMatRelac.setBlocked(true);
				vInputMatRelac.setValue("");
				vRelacionadoOn = "NO";

			}

		},

		onValidarSkuPrinc: function (oEvent) {

			vValidarRelaci = "NO";
			var vSkuRela = oEvent.getSource().getValue();
			var vInputMatRelac = sap.ui.getCore().byId("IdSkuDescriPrincFrag");
			//valida Sku que exista en los ya ingresado y que sea principal
			if (vRelacionadoOn === "SI") {

				if (vSkuRela !== "") {
					var vTab = this.getView().getModel("TabSku").getData();
					if (vTab !== undefined) {

						if (vTab.DATA.length > 0) {

							for (var j = 0; j < vTab.DATA.length; j++) {
								// busca el SKU el los principales
								if (vTab.DATA[j].IdSku === vSkuRela) {

									if (vTab.DATA[j].PrinRela === "Principal") {

										vInputMatRelac.setValue(vTab.DATA[j].NomSku);
										//posicion del Sku padre para ser grabado en Sku hijo

										vPosnrSkuPrin = vTab.DATA[j].Idposnr;
										vValidarRelaci = "SI";
										break;

									}

								}

							}
							if (vValidarRelaci === "NO") {
								sap.m.MessageToast.show("Sku no Existe en Listado como principal");
								vInputMatRelac.setValue("");
							}

						}

					}
				}
			}

		}

	});

});