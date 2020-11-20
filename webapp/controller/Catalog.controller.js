jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.jszip");
jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.xlsx");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"../model/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/Filter"
], function (Controller, JSONModel, ODataModel, formatter, Spreadsheet, Filter) {
	"use strict";
	var cNCatalogo = "";
	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.Catalog", {

		formatter: formatter,

		onInit: function () {
			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Catalog").attachDisplay(null, this.initialRead, this);

			//this.initialRead();
		},

		onBack: function () {
			var tab = this.byId("TabCata");

			for (var i = tab.getColumns().length; i > 4; i--) {
				tab.removeColumn(i);
			}
			this.getOwnerComponent().getTargets().display("CatalogoMain");

		},

		initialRead: function () {

			//var oDataModel = this.getOwnerComponent().getModel("catalogAbast");  
			var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV");
			
			var aFilters = [];

			cNCatalogo = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata");
			var lo_pickedDateFilter = new sap.ui.model.Filter({
				path: "Cata",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: cNCatalogo
			});
			aFilters.push(lo_pickedDateFilter);
			oDataModel.read(
				"/ExpanConsulSku1Set", {
					urlParameters: {
						"$expand": "ExpanConsulSku2Set,ExpanConsulSku3Set,ExpanConsulSku4Set,ExpanConsulSku5Set"
					},
					success: function (oEvent) {

						var vTotalReg = this.byId("idHeadAb");

						if (oEvent.results[0] !== undefined) {
							debugger
							vTotalReg.setNumber(oEvent.results[0].ExpanConsulSku5Set.results.length);

						} else {
							vTotalReg.setNumber(0);
						}

						this.buildTable(oEvent.results[0].ExpanConsulSku3Set.results);
						this.buildData(oEvent.results[0].ExpanConsulSku4Set.results, oEvent.results[0].ExpanConsulSku5Set.results);
					}.bind(this),
					error: function (oEvent) {
						debugger

					},
					filters: aFilters
				}
			);
		},

		buildData: function (oEvent, oEvent1) {
			debugger
			var aData = [];
			oEvent1.map(data1 => this.dataBuilder(data1, aData)); // eslint-disable-line
			oEvent.map(data => this.dataBuilder1(data, aData)); // eslint-disable-line
			this.dataUnion(aData);

		},

		buildTable: function (oEvent) {
			debugger
			oEvent.map(centros => this.columnBuilder(centros.Werks));
		},

		dataBuilder: function (data, aData) {
			var oData = {
				Matnr: data.Matnr,
				Maktx: data.Maktx,
				Mvgr4: data.Mvgr4,
				Mvgr4New: data.Mvgr4New,
				Normaldest: data.Normaldest,
				NormaldestTxt: data.NormaldestTxt,
				Princrelac: data.Princrelac,
				PrincrelacTxt: data.PrincrelacTxt,
				Status: data.PrincrelacTxt === "Relacionado" ? "Warning" : "None",
				Selected: false
					//[data.Centro]: "Test " + data.Matnr
			};
			//aData[data.Matnr].push(oData);
			if (!aData[data.Matnr]) {
				aData[data.Matnr] = [];
				aData[data.Matnr] = oData;
			}
			/* else {
							aData[data.Matnr][data.Centro] = "Test " + data.Matnr;
						}*/
		},

		dataBuilder1: function (data, aData) {
			if (aData[data.Matnr][data.Centro]) {
				aData[data.Matnr][data.Centro] = [];
			} else {
				aData[data.Matnr][data.Centro] = {
					Asur: data.Asur,
					AsurNew: data.AsurNew,
					CatV: data.CatV
				}
			}
		},

		dataUnion: function (aData) {
			var aDataIndex = Object.keys(aData);
			var LvData = aData;
			var aDataLv = [];
			var oJsonMod = new JSONModel();
			for (var i = 0; i < aDataIndex.length; i++) {
				if (LvData[aDataIndex[i]]) {
					aDataLv.push(LvData[aDataIndex[i]]);
					LvData[aDataIndex[i]] = undefined;
				}
			}
			debugger
			oJsonMod.setData(aDataLv);
			this.getView().setModel(oJsonMod);
		},

		onGuardarAbast: function () {
			var oModifData = this.getView().getModel("modifCentro").getData();
			var aModifData = Object.values(oModifData);
			var aArray = [];
			var aArrayCanal = [];
			var oDataToSave;
			var oModelAbast = this.getOwnerComponent().getModel("catalogAbast");
			debugger
			for (var i = 0; aModifData.length > i; i++) {
				aModifData[i] = Object.values(aModifData[i]);
			}

			for (var i = 0; aModifData.length > i; i++) {
				for (var b = 0; aModifData[i].length > b; b++) {
					aArray.push(aModifData[i][b]);
				}
			};

			aArrayCanal = Object.values(this.getOwnerComponent().getModel("canalModif").getData());

			/////////mod IH 12072020
			var tab = this.byId("TabCata");
			var oSelData = tab.getModel().getData();
			var vcanal = [];
			var vcentro = [];

			for (var i = 0; i < oSelData.length; i++) {
				// arma cambio de canal 
				var oCanalModModel = {
					IdCatalogo: this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata"),
					IdParte: '1',
					Matnr: oSelData[i].Matnr,
					Mvgr4New: oSelData[i].Mvgr4New,
					EstadoCat: ""
				};
				vcanal.push(oCanalModModel);

				//Arma cambio de centros
				var vLine = oSelData[i];

				for (var clave in vLine) {
					if (vLine[clave].AsurNew !== undefined) {

						var oDataModif = {
							IdCatalogo: this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata"),
							IdParte: '1',
							Centro: clave,
							Matnr: oSelData[i].Matnr,
							AsurNew: vLine[clave].AsurNew
						};
						vcentro.push(oDataModif);
					}

				}

			}

			/////////end mod IH 12072020
			oDataToSave = {
				Idcatalogo: this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata"),
				Idparte: "1",
				Tipoacc: "C",
				DeepActuAbastCSet: vcanal,
				DeepActuAbastSSet: vcentro
			};

			debugger
			var that = this;
			oModelAbast.create("/DeepActuAbastMSet", oDataToSave, {
				success: function (oEvent) {
					if (oEvent.Pmensaje1 !== "0") {
						// sap.m.MessageToast.show(oEvent.Pmensaje2);
						that.mostrarMensajeError(oEvent);
					} else {
						debugger;
						sap.m.MessageBox.show("Se han guardado con éxito las modificaciones.", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Operación Exitosa",
							actions: sap.m.MessageBox.Action.CLOSE
						});
					}
				},
				error: function (oEvent) {
					debugger;
				}
			});
		},

		setStyle: function (sValue) {
			debugger;
			if (sValue === "") {
				return "yellow";
			}
		},

		onChangeCanal: function (canal) {
			var oObjectCan = canal.getSource().getBindingContext().getModel().getObject(canal.getSource().getBindingContext().getPath());
			var oCanalModModel = this.getOwnerComponent().getModel("canalModif").getData();
			var oCatalogaModel = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata");

			if (!oCanalModModel[oObjectCan.Matnr]) {
				oCanalModModel[oObjectCan.Matnr] = [];
			}

			oCanalModModel[oObjectCan.Matnr] = {
				IdCatalogo: oCatalogaModel,
				IdParte: '1',
				Matnr: oObjectCan.Matnr,
				Mvgr4New: oObjectCan.Mvgr4New,
				EstadoCat: ""
			};

			this.getOwnerComponent().getModel("canalModif").setData(oCanalModModel);
		},

		columnBuilder: function (werk) {
			var oColumn = new sap.ui.table.Column({
				width: '6rem',
				label: new sap.m.Label({
					text: werk
				}),
				template: [
					new sap.m.HBox({
						items: [
							new sap.m.Input({
								value: "{" + werk + "/Asur}",
								enabled: false
							}),
							new sap.m.Input({
								value: "{" + werk + "/AsurNew}",
								maxLength: 1,
								change: function (oEvent) {
									var oModifCentro = this.getOwnerComponent().getModel("modifCentro");
									var oDataModif = oModifCentro.getData();
									var oCatalogaModel = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata");

									var sCentro = oEvent.getSource().getBindingInfo("value").binding.getPath();
									sCentro = sCentro.split("/")[0];

									var sNewVal = oEvent.getParameters().newValue;
									var oObject = oEvent.getSource().getBindingContext().getModel().getObject(oEvent.getSource().getBindingContext().getPath());
									var sMatnr = oObject.Matnr;

									if (!oDataModif[sCentro]) {
										oDataModif[sCentro] = [];
										if (!oDataModif[sCentro][sMatnr]) {
											oDataModif[sCentro][sMatnr] = [];
											oDataModif[sCentro][sMatnr] = {
												IdCatalogo: oCatalogaModel,
												IdParte: '1',
												Centro: sCentro,
												Matnr: sMatnr,
												AsurNew: sNewVal
											};
										}
									} else {
										oDataModif[sCentro][sMatnr] = {
											IdCatalogo: oCatalogaModel,
											IdParte: '1',
											Centro: sCentro,
											Matnr: sMatnr,
											AsurNew: sNewVal
										};
									}
									debugger
									oModifCentro.setData(oDataModif);
								}.bind(this)
							}).attachBrowserEvent("keypress", function (e) {
								var keyCode = [88, 120];
								if (!($.inArray(e.which, keyCode) >= 0)) {
									e.preventDefault();
								}
							})
							/*,
														new sap.ui.core.Icon({
															src: "sap-icon://flag"
															visible: {
																path: 'E528/CatV',
																formatter: function (sValue) {
																	if (sValue === "") {
																		return true;
																	} else {
																		return false;
																	}
																}
															}
														})*/
						]
					})
				]
			});
			this.getView().getContent()[0].getContent()[1].addColumn(oColumn);
			sap.ui.core.BusyIndicator.hide(0);
		},

		excelManagement: function (oEvent) {
			debugger;
			var aColumns = this.byId("TabCata").getColumns();
			var aColumnsFilt = aColumns.filter(col => col.getVisible() === true);
			var aCols = this.getColumnsToExcel(aColumnsFilt, this);
			debugger;
			var oDataSource = this.getDataSourcetoExcel(aCols);

			var oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: oDataSource, //oEvent.results,
				fileName: "Catalogacion_" + this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata")
			};

			var oSheet = new Spreadsheet(oSettings);

			oSheet.build();

		},

		getColumnsToExcel: function (aCols, context) {
			var aArray = [],
				sBind, sLenght;
			var bDinamico = false;
			debugger;

			aCols.forEach(function (col) {
				if (col.getAggregation("template").getBindingInfo("text")) {
					sBind = col.getAggregation("template").getBindingInfo("text").parts[0].path;
				} else {
					sBind = col.getAggregation("label").getText(); //col.getAggregation("template").getBindingInfo("selected").parts[0].path;
					if (col.getAggregation("label").getText() === "AS Canal") {
						sBind = "Mvgr4New";
					}
				}
				//sBind = context.titleSpaceRem(sBind);
				//console.log(sBind);
				if (sBind === "Mvgr4New") {
					aArray.push({
						label: "AS Canal",
						property: "Mvgr4",
						width: "15"
					});
					bDinamico = true;
				}
				if (bDinamico && sBind !== "Mvgr4New") {
					aArray.push({
						label: col.getLabel().getText() + " Actual",
						property: sBind + "Old",
						width: "13"
					});
					aArray.push({
						label: col.getLabel().getText(),
						property: sBind,
						width: "10"
					});
				} else {
					if (!bDinamico) {
						aArray.push({
							label: col.getLabel().getText(),
							property: sBind,
							width: sBind === "Maktx" ? "50" : "12"
						});
					}
				}
			});

			return aArray;
		},

		titleSpaceRem: function (sValue) {

		},

		getDataSourcetoExcel: function (col) {
			debugger;
			var aDataSource = [];

			if (col) {
				var tab = this.byId("TabCata");
				var oSelData = tab.getModel().getData();
				var aSkuTabLength = oSelData.length;
				var oDataSource;
				var sProp;

				for (var a = 0; a < aSkuTabLength; a++) {
					oDataSource = {};
					for (var i = 0; i < col.length; i++) {

						sProp = col[i].property;

						if (oSelData[a][sProp]) {
							oDataSource[sProp] = oSelData[a][sProp];
							// cambia el valor si son valores de centros 
							if (oSelData[a][sProp].AsurNew !== undefined) {
								//oDataSource[sProp]
								oDataSource[sProp] = oSelData[a][sProp].AsurNew;
								oDataSource[sProp + "Old"] = oSelData[a][sProp].Asur;
							}

						}

					}
					aDataSource.push(oDataSource);

				}
				return aDataSource;

			}

		},

		onSubirArchivo: function (oEvent) {
			//-------------------------INICIA SUBIDA DE EXCEL
			var oThis = this,
				file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
			oThis.byId("fileUploader").setValue("");
			if (file && window.FileReader) {
				var reader = new FileReader(),
					result = {},
					data;
				reader.onload = function (e) {
					data = e.target.result;
					var wb = XLS.read(data, {
						type: "binary",
						cellDates: true,
						cellStyles: true
					});
					wb.SheetNames.forEach(function (sheetName) {
						var roa = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
						if (roa.length > 0) {
							// result[sheetName] = roa;
							// var oSelModel = this.getOwnerComponent().getModel("selectedValues"),
							// 	data = {
							// 		nombre: wb.SheetNames[0]
							// 	};
							// oSelModel.setProperty("/dataFromExcel", roa);
							// this.validSkuMasiva(roa);

							// ejecuta Mach entre Excel y modelo de la tabla 
							this.matchExcel(roa);
						}
					}.bind(this));
				}.bind(this);
				reader.readAsBinaryString(file);
			}

		},

		matchExcel: function (sku) {
			var tab = this.byId("TabCata");
			var oSelData = tab.getModel().getData();
			var vLine;
			var aError = this.validarExcel(sku, oSelData);
			// realiza el match por N° de material
			if (!aError.length) {
				for (var i = 0; i < oSelData.length; i++) {
					vLine = sku.filter(col => col["Articulo"] === oSelData[i]["Matnr"]);
					if (vLine.length > 0) {
						//Busca concidencia de los centros 
						for (var clave in vLine[0]) {
							if (oSelData[i][clave]) {
								oSelData[i][clave].AsurNew = vLine[0][clave];
							}
						}
						// oSelData[i].Mvgr4New = vLine[0]["AS Canal"] ? vLine[0]["AS Canal"] : "";
					}
				}
				tab.getModel().setData(oSelData);
			} else {
				this.MostrarLogError(aError);
			}
		},
		validarExcel: function (sku, oSelData) {
			var aError = [];
			var vLine;
			var sMensaje;
			for (var i = 0; i < oSelData.length; i++) {
				vLine = sku.filter(col => col["Articulo"] === oSelData[i]["Matnr"]);
				if (vLine.length > 0) {
					//Busca concidencia de los centros 
					for (var clave in vLine[0]) {
						if (oSelData[i][clave]) {
							sMensaje = "";
							debugger;
							if (vLine[0][clave].length) {
								if (vLine[0][clave].length > 1) {
									sMensaje = " Solo puede ser X.";
								} else if (vLine[0][clave].toUpperCase() !== "X") {
									sMensaje = " Solo puede ser X.";
								}
							}
							if (sMensaje) {
								aError.push({
									Mensaje: "Error linea del Excel " + (i + 2) + ": AS " + clave + sMensaje
								});
							}
						}
					}
				}
			}
			if (sku.length > oSelData.length) {
				aError.push({
					Mensaje: "No puede agregar SKU que no esten asociados al catalogo, linea del Excel " + (oSelData.length + 1) + " en adelante"
				});
			}
			return aError;
		},
		//Buestra log de error  de la validación de los SKU
		MostrarLogError: function (oDataError) {
			var ModelLog = new JSONModel({
				DATA: []
			});

			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ShowError", this);
			this._Dialog.setModel(this.getView().getModel());
			this._Dialog.open();

			ModelLog.setProperty("/DATA", oDataError);
			this._Dialog.setModel(ModelLog, "ModelLog");
		},

		onCerrarFrag: function () {
			this._Dialog.close();
			this._Dialog.destroy();
		},

		mostrarMensajeError: function (oSuccess) {
			var aError = [];
			oSuccess.DeepActuAbastCSet.results.forEach(function (oData) {
				aError.push({
					Mensaje: "Material " + oData.Matnr + ": " + oData.Mensaje
				});
			});
			this.MostrarLogError(aError);
		},

		onSelectionChange: function (oEvent) {
			var aIndices = oEvent.getParameter("rowIndices");
			var oTable = oEvent.getSource();
			aIndices.forEach(function (nIndice) {
				var bSelected = oTable.getModel().getData()[nIndice].Selected ? false : true;
				oTable.getModel().getData()[nIndice].Selected = bSelected;
				var sValue = bSelected ? "X" : "";
				var aCells = oTable.getRows()[nIndice].getCells();
				aCells = aCells.slice(5, aCells.length);
				aCells.forEach(function (oCell) {
					oCell.getItems()[1].setValue(sValue);
				});

			});
		}
	});
});