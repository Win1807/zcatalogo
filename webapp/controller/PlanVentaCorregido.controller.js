jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.jszip");
jQuery.sap.require("ZCatalogoMesa.zcatalogo.controller.xlsx");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
	"ZCatalogoMesa/zcatalogo/model/formatter",
], function (Controller, Spreadsheet, formatter) {
	"use strict";
	var cNCatalogo = "";
	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.PlanVentaCorregido", {
		//objeto para formatear data
		formatter: formatter,
		//ciclo de vida de inicio
		onInit: function () {
			//Rutea para el evento initialRead
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("PlanVentaCorregido").attachDisplay(null, this.initialRead, this);
		},
		//funcion al navegar atras
		onBack: function () {
			this.destroyTable(); //limpia la tabla
			// var oHistory = sap.ui.core.routing.History.getInstance();
			// var sPreviousHash = oHistory.getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			this.getOwnerComponent().getTargets().display("CatalogoMain");
			// }
		},
		//funcion de inicio, se gatilla cada vez que se entra a la pantalla
		initialRead: function () {
			var that = this;
			sap.ui.core.BusyIndicator.show(0); //creo el busy global
			var oDataModel = this.getOwnerComponent().getModel("catalogAbast");
			var aFilters = [];
			cNCatalogo = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata");
			var lo_pickedDateFilter = new sap.ui.model.Filter({
				path: "Cata",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: cNCatalogo
			});
			aFilters.push(lo_pickedDateFilter);
			new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV").read(
				"/ExpanConsulSku1Set", {
					urlParameters: {
						"$expand": "ExpanConsulSku2Set,ExpanConsulSku3Set,ExpanConsulSku4Set,ExpanConsulSku5Set"
					},
					filters: aFilters,
					success: function (oEvent) {
						var vTotalReg = that.byId("idHeadAb");
						if (oEvent.results[0] !== undefined) {
							vTotalReg.setNumber(oEvent.results[0].ExpanConsulSku5Set.results.length);
						} else {
							vTotalReg.setNumber(0);
						}
						var aTiendas = oEvent.results[0].ExpanConsulSku3Set.results;
						var aData = oEvent.results[0].ExpanConsulSku4Set.results;
						var aMateriales = oEvent.results[0].ExpanConsulSku5Set.results;
						that.buildData(aTiendas, aData, aMateriales);
					},
					error: function (oEvent) {
						sap.ui.core.BusyIndicator.hide();
						console.log(oEvent);
						sap.m.MessageToast.show("ERROR");
					}
				}
			);
		},
		/**
		 * Inicio funciones de construcción de tabla
		 * */
		//construccion del objeto maestro
		buildData: function (aTiendas, aData, aMateriales) {
			var aNewData = [];
			var aFilter = [];
			//se crea objeto maestro
			aMateriales.forEach(function (oMaterial) {
				aNewData.push({
					IdCatalogo: oMaterial.IdCatalogo,
					IdParte: oMaterial.IdParte,
					Matnr: oMaterial.Matnr,
					Maktx: oMaterial.Maktx,
					Normaldest: oMaterial.Normaldest,
					NormaldestTxt: oMaterial.NormaldestTxt,
					Princrelac: oMaterial.Princrelac,
					PrincrelacTxt: oMaterial.PrincrelacTxt,
					Status: oMaterial.PrincrelacTxt === "Relacionado" ? "Warning" : "None"
				});
			});
			//añadir las tiendas al objeto maestro
			aNewData.forEach(function (oNew) {
				aTiendas.forEach(function (oTienda) {
					oNew[oTienda.Werks] = {};
				});
			});
			//volcado de datos
			aNewData.forEach(function (oNew) {
				aFilter = aData.filter(oData => oData.Matnr === oNew.Matnr); //se filtra el arreglo con la data
				aFilter.forEach(function (oFilter) {
					oNew[oFilter.Centro] = {
						"PlanSug": oFilter.PlanSug,
						"PlanCor": oFilter.PlanCor
					};
				});
			});
			this.buildTable(aTiendas, aNewData);
		},
		//construccion de la tabla
		buildTable: function (aColumns, aNewData) {
			var oTable = this.byId("tablaPlanVentaCorregido");
			// var oTable = new sap.m.Table();
			//arreglo de celdas con su primer valor de articulo
			var aCells = [
				new sap.m.Text({
					text: "{Matnr}"
				}),
				new sap.m.Text({
					text: "{Maktx}"
				}),
				new sap.m.Text({
					text: "{NormaldestTxt}"
				}),
				new sap.m.Text({
					text: "{PrincrelacTxt}"
				}),
			];
			//creo la primera columna
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Articulo"
				}),
				width: "4rem",
				hAlign: "Center"
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Descripción"
				}),
				width: "24rem",
				hAlign: "Center"
			}));
			oTable.addColumn(
				new sap.m.Column({
					header: new sap.m.Label({
						text: "Clase"
					}),
					width: "6rem",
					hAlign: "Center"
				}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Tipo"
				}),
				width: "6rem",
				hAlign: "Center"
			}));
			aColumns.forEach(function (oColumn) {
				//creo las columnas dinamicas
				oTable.addColumn(new sap.m.Column({
					header: new sap.m.Label({
						text: oColumn.Werks
					}),
					width: "12rem",
					hAlign: "Center"
				}));
				//arreglo de las celdas para crearlas dinamicamente
				aCells.push(
					new sap.m.HBox({
						items: [
							new sap.m.Input({
								// value: "{parts:[{ path:'" + oColumn.Werks + "/PlanSug' }, 'CLP' ], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
								value: {
									path: oColumn.Werks + "/PlanSug",
									formatter: formatter.formatoMonedaChilena
								},
								enabled: false
							}),
							new sap.m.Input({
								// value: "{parts:[{ path:'" + oColumn.Werks + "/PlanCor' }, 'CLP' ], type: 'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
								value: {
									path: oColumn.Werks + "/PlanCor",
									// formatter: formatter.formatoMonedaChilena
								},
								maxLength: 10,
								// liveChange: formatter.onFormat
							})
						]
					})
				);
			});
			oTable.setModel(new sap.ui.model.json.JSONModel(aNewData));
			//se carga las celdas
			oTable.bindItems("/", new sap.m.ColumnListItem({
				highlight: "{Status}",
				cells: aCells
			}));
			sap.ui.core.BusyIndicator.hide(); //busy hide
		},
		//destruccion de la tabla
		destroyTable: function () {
			var oTable = this.byId("tablaPlanVentaCorregido");
			oTable.destroyColumns();
			oTable.destroyItems();
		},
		/**
		 * Funciones de Descarga/Carga Excel
		 * */
		//Descarga el excel
		onPressDescargarExcel: function (oEvent) {
			var sCatalogo = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata");
			var aColumns = this.getColumnsExcel();
			var sName = "Plan de Venta Corregido_" + sCatalogo;
			sap.ui.core.BusyIndicator.show(0);
			var fnSuccess = function () {
				new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV").create("/DeepAbastVentasPSet", {
					Accion: "C",
					IIdcatalogo: sCatalogo,
					IUname: "",
					Tipo: "1",
					Pmensaje1: "",
					Pmensaje2: "",
					DeepAbastVentasTSet: []
				}, {
					success: function (oResponse) {
						var oSettings = {
							workbook: {
								columns: aColumns
							},
							dataSource: oResponse.DeepAbastVentasTSet.results, //oEvent.results,
							fileName: sName
						};
						var oSheet = new Spreadsheet(oSettings);
						oSheet.build().then(function () {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show("Descarga exitosa");
						});
					},
					error: function (oResponse) {
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageToast.show("Error al descargar");
						console.log(oResponse);
					}
				});
			};
			this.getSeguridad(sCatalogo, fnSuccess, "C");
		},
		//crea las columnas a utilizar para el excel
		getColumnsExcel: function () {
			var aVC = [{
				label: "N° Catalogo",
				property: "IdCatalogo"
			}, {
				label: "Parte",
				property: "IdParte",
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
			}, {
				label: "Cantidad Sugerido",
				property: "PlanSug",
				type: "Number"
			}, {
				label: "Cantidad Corregido",
				property: "PlanCor",
				type: "Number"
			}];
			return aVC;
		},
		//Carga del excel
		onChangefileUploaderPlanVentas: function (oEvent) {
			//-------------------------INICIA SUBIDA DE EXCEL
			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0];
			//se limpia el fileUploader para que pueda subir el mismo archivo denuevo
			this.byId("fileUploader").setValue("");
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
					//se recorre el arreglo para crear el objeto ROA (array del excel)
					wb.SheetNames.forEach(function (sheetName) {
						var roa = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
						if (roa.length > 0) {
							this.validacionExcelPlanVentas(roa);
						} else {
							this.getErrorLog([{
								Mensaje: "Error: Excel sin datos"
							}]);
						}
					}.bind(this));
				}.bind(this);
				reader.readAsBinaryString(file);
			}
		},
		//valida el excel
		validacionExcelPlanVentas: function (aData) {
			var aError = [];
			var bExit = false;
			aData.forEach(function (oData, i) {
				if (!oData["N° Catalogo"] || !oData["Parte"] || !oData["Tienda"] || !oData["Material"]) {
					if (!bExit) {
						aError.push({
							Mensaje: "Error: formato del Excel erroneo"
						});
						bExit = true; //salir del foreach para solo mostrar que el formato del excel es el incorrecto
					}

				} else {
					if (isNaN(oData["Cantidad Corregido"]) && oData["Cantidad Corregido"] !== undefined) {
						aError.push({
							Mensaje: "Error linea del Excel " + (i + 2) + ": Cantidad Corregido solo puede ser Numerico"
						});
					}
				}
			});
			if (aError.length) {
				this.getErrorLog(aError);
			} else {
				this.setPlanVentasCorregidoTabla(aData);
			}
		},
		//setea el modelo cargado del excel a la tabla
		setPlanVentasCorregidoTabla: function (aNewData) {
			var oModel = this.byId("tablaPlanVentaCorregido").getModel();
			var aData = oModel.getData();
			var aFilter;
			var aProperty;
			aData.forEach(function (oData) {
				aNewData.forEach(function (oNew) {
					//recupero el nombre de la tienda
					aProperty = Object.getOwnPropertyNames(oData).filter(sProperty => sProperty === oNew.Tienda);
					//filtro la fila nueva del excel
					aFilter = aNewData.filter(oNew => oNew.Material == oData.Matnr && oNew.Tienda === aProperty[0]);
					//cambio el valor del valor existente
					oData[aProperty[0]].PlanCor = aFilter[0]["Cantidad Corregido"] ? aFilter[0]["Cantidad Corregido"] : "";
				});
			});
			//se refresca el modelo de la tabla
			oModel.refresh();
			sap.m.MessageToast.show("Carga Completada");
		},
		//precionar guardar y tomar la info
		onGuardarVentaCorregido: function () {
			var that = this;
			var aData = this.byId("tablaPlanVentaCorregido").getModel().getData();
			debugger;
			var sCatalogo = this.getOwnerComponent().getModel("catalogaModel").getProperty("/idCata"); //recupero id catalogo
			sap.ui.core.BusyIndicator.show(0); //busy
			var fnSuccess = function(){
				var oCreate = {
				Accion: "M", // C = consulta, M = Modifica
				IIdcatalogo: sCatalogo,
				IUname: "",
				Tipo: "VC", // VS = Venta Sugerido, VC = Venta Corregido
				Pmensaje1: "",
				Pmensaje2: "",
				DeepAbastVentasTSet: []
			};
			aData.forEach(function (oData) {
				//recupero los centros del objeto oData
				Object.getOwnPropertyNames(oData).forEach(function (sProperty, i) {
					if (i > 8) {
						oCreate.DeepAbastVentasTSet.push({
							IdCatalogo: oData.IdCatalogo,
							IdParte: oData.IdParte,
							Matnr: oData.Matnr,
							Centro: sProperty,
							PlanCor: oData[sProperty].PlanCor
						});
					}
				});
			});
			new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV").create("/DeepAbastVentasPSet", oCreate, {
				success: function (oResponse) {
					sap.ui.core.BusyIndicator.hide(); //ocultar busy
					if (oResponse.Pmensaje1 === "0") {
						sap.m.MessageToast.show("Guardado completado");
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
			};
			this.getSeguridad(sCatalogo, fnSuccess, "M");
		},
		//levanta el fragmento de error
		getErrorLog: function (aError) {
			var ModelLog = new sap.ui.model.json.JSONModel({
				DATA: []
			});
			this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.ShowError", this);
			this._Dialog.setModel(this.getView().getModel());
			this._Dialog.open();
			ModelLog.setProperty("/DATA", aError);
			this._Dialog.setModel(ModelLog, "ModelLog");
		},
		//destruye el fragmento
		onCerrarFrag: function () {
			this._Dialog.close();
			this._Dialog.destroy();
		},
		/**
		 * Odata que trae la seguridad si el usuario puede o no puede descargar los excel de plan de ventas
		 * ID Actividad | Descripción
		 *     16   	| Ingreso Plan Vta. sugerido (VS)
		 *     17   	| Ingreso Plan Vta. corregido (VC)
		 */
		getSeguridad: function (sID, fnSuccess, sAccion) {
			sap.ui.core.BusyIndicator.show(0);
			var sTipo = "17";
			new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_ABASTECIMIENTO2_SRV").read(
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
	});
});