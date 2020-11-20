sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageBox",
	"sap/m/MessageToast"

], function (Controller, JSONModel, Spreadsheet, MessageBox, MessageToast) {
	"use strict";
	var vNumCatalogo = "";
	var vValNumPromo = "";
	var vTipoAccion = "";
	var vValOrigen = "";
	var vpanel0 = null;
	var Modelo = null;
	var vColIdCatalogo = "";
	var vColIdNomCat = "";
	var vColBotonNew = "";
	var vColBotonMod = "";
	var vTitulo = "";
	var vVpanelTitulo = "";
	var vNuevaPromo = "";
	var vTable1 = "";
	var vGParte = "";
	var vNombreCat = "";
	var vFechaDesde = "";
	var vFechaHasta = "";
	var vValorTipoLista = "";
	var bDialog = new sap.m.BusyDialog();
	var vidHeadre1 = "";
	var vidHeadAtri = "";
	var vGCatCerrado = "";
	var vGFechaPublicI = "";
	var vGFechaPublicF = "";
	var vUserType = "";
	var vExtenderPro = "";
	var _TabPromo = new JSONModel({
		DATA: []
	});
	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.ListadoPromoMain", {

		onInit: function () {

			//Rutea para el evento onDisplay
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("ListadoPromoMain").attachDisplay(null, this.onDisplay, this);

		},

		onDisplay: function () {

			var vthis = this;

			vGParte = "";

			var TabPromo = new JSONModel({
				DATA: []
			});

			// accedo a las variables  del core (N° catalogo)
			vNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");
			vNombreCat = sap.ui.getCore().getModel("vNombreCat");
			vValOrigen = sap.ui.getCore().getModel("vValOrigen");
			vUserType = sap.ui.getCore().getModel("vUserType");

			vGCatCerrado = sap.ui.getCore().getModel("vGCatCerrado"); //catalogo cerrado o no 
			vUserType = sap.ui.getCore().getModel("vUserType"); //Tipo de usuario 

			vColIdCatalogo = this.byId("column1");
			vColIdNomCat = this.byId("column2");
			vColBotonNew = this.byId("column12");
			vColBotonMod = this.byId("button1");
			vpanel0 = this.byId("panel0");
			vTitulo = this.byId("idTitulo");
			// vVpanelTitulo = this.byId("tTitulo");
			vNuevaPromo = this.byId("NuevaPromo");
			vTable1 = this.byId("table1");

			vTable1.setBusy(true);
			// mantiene la cabecera de la tabla fija 
			vTable1.setPopinLayout(sap.m.PopinLayout.Block);
			vTable1.setSticky(["ColumnHeaders"]);

			vidHeadre1 = this.byId("idHeadre1");
			vidHeadAtri = this.byId("idHeadAtri");

			//activa las columnas Id Catalogo, Nombre de Catalago y boton Nuevo
			//Cuando es accion promocional 

			if (vValOrigen === "Cata") {
				vColIdCatalogo.setVisible(false);
				vColIdNomCat.setVisible(false);
				vColBotonNew.setVisible(false);
				vValorTipoLista = "1";
				//vTitulo.setTitle("LISTADO DE PROMOCIONES > N° CATALOGO: " + vNumCatalogo + ">" + vNombreCat);
				vTitulo.setTitle("LISTADO DE PROMOCIONES");
				// vVpanelTitulo.setText("N° CATALOGO: " + vNumCatalogo);
				vNuevaPromo.setText("Nueva Promo");
				//cambia el header de la pantalla
				var vTxtNCata = "N° Catalogo: " + vNumCatalogo;
				vidHeadre1.setTitle(vNombreCat);
				vidHeadAtri.setText(vTxtNCata);

				if (vValOrigen === "Cata") {
					if (vGCatCerrado === "X") {
						sap.m.MessageToast.show("Catalogo Cerrado");
						vColBotonMod.setBlocked(true);
					} else {
						vColBotonMod.setBlocked(false);
					}

				}

			} else {
				if (vValOrigen === "Promo") {
					vColIdCatalogo.setVisible(true);
					vColIdNomCat.setVisible(true);
					vColBotonNew.setVisible(true);
					vValorTipoLista = "2";
					vNumCatalogo = "";
					vTitulo.setTitle("LISTADO ACCIÓN PROMOCIONAL");
					// vVpanelTitulo.setText("ACCIÓN PROMOCIONAL");
					vNuevaPromo.setText("Nueva Acción Promo");
					//cambia el header de la pantalla
					vidHeadre1.setTitle("Acciones Promocionales");
					vidHeadAtri.setText("");

				}

			}

			// agrega titulo a la tabla 

			//var Vtitulo = "N° CATALOGO: " + vNumCatalogo;
			//vVpanelTitulo.setText(Vtitulo);

			//vpanel0.setBusy(true);

			// busca Listado de promociones 
			// creo el modelo 
			var oFilters = [];
			var filter = null;
			Modelo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			Modelo.setUseBatch(false); // se puede desactivar el uso de batch
			// Agrega filtros a la consulta
			//Fecha desde
			filter = new sap.ui.model.Filter({
				path: "Fdesde",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "20000101"
			});
			oFilters.push(filter);
			//Fecha Hasta
			filter = new sap.ui.model.Filter({
				path: "Fhasta",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "99991231"
			});
			oFilters.push(filter);
			//N° Catalogo
			filter = new sap.ui.model.Filter({
				path: "Idcatalogo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vNumCatalogo
			});
			oFilters.push(filter);
			//tipo de catalogo/accion promocional
			filter = new sap.ui.model.Filter({
				path: "Tipocat",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vValorTipoLista
			});
			oFilters.push(filter);

			// Función de existo
			function fSuccess(oEvent) {
				// asigno datos a la estructura Eventos del modelo
				TabPromo.setProperty("/DATA", oEvent.results);
				// asigna a variable global 
				_TabPromo = TabPromo;
				// asignar el modelo a la vista
				vthis.getView().setModel(TabPromo, "TabPromo");
				vTable1.setBusy(false);

				vidHeadre1.setNumber(oEvent.results.length);

				//verifica si el catalogo esta cerrado o no 

				if (vValOrigen === "Cata") {
					if (vGCatCerrado === "X") {
						vNuevaPromo.setBlocked(true);
					} else {
						vNuevaPromo.setBlocked(false);
					}
				}

				//vpanel0.setBusy(false);
			}

			// Función de error
			function fError(oEvent) {
				sap.m.MessageToast.show("Error al cargar datos");
				vTable1.setBusy(false);
				//vpanel0.setBusy(false);
			}

			// consulta Listado de promociones 
			debugger
			Modelo.read("/ListaPromoMainSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

		},

		formatterBorrarBtn: function (sValue) {
			if (sValue) {
				if (vUserType === "01" || (vUserType !== "01" && parseInt(sValue) < 3)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		onModificar: function (oEvent) {
			var vthis = this;

			var row = oEvent.getSource().oPropagatedProperties.oBindingContexts.TabPromo.sPath;
			var vPos = row.substr(6);
			//Selecciona el registro de la tabla 
			vValNumPromo = _TabPromo.oData.DATA[vPos].Idpromo;
			// Optiene N° de la parte 
			vGParte = _TabPromo.oData.DATA[vPos].Idparte;
			// va a la siguiente vista si solo contiene N° de promo
			if (vValNumPromo !== "0") {
				//asigno a variable al core
				sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo"); //Numero de la promo
				vTipoAccion = "M"; //Modifica data
				sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion"); //Numero de la promo
				if (vValOrigen === "Promo") {
					// si es una acción promocional asigna el N° de la acción al catalogo  dummy
					vNumCatalogo = _TabPromo.oData.DATA[vPos].Idcatalogo;
					sap.ui.getCore().setModel(vNumCatalogo, "vValNumCatalogo");
				}

				// si no es administrador y ya la promoción fue aprobada no puede modificarla 
				// solo se puede pedir la solicitud para  Extender o Caducar la fecha de vigencia de la promo

				// if (_TabPromo.oData.DATA[vPos].Estado > 2 && vUserType !== "01" && _TabPromo.oData.DATA[vPos].Estado < 8) {
				// 	// sap.m.MessageToast.show("Solo puede ser Modificado en los estado EN CREACION o POR APROBAR");

				// 	sap.m.MessageBox.confirm("Solo es posible Expandir/caducar Promo");
				// 	debugger
				// 	return;

				// }
				
				debugger
				//si es Administrador
				if (vUserType === "01") {
					if (_TabPromo.oData.DATA[vPos].Estado > 2 && _TabPromo.oData.DATA[vPos].Estado < 8) {
						vExtenderPro = "X"; // si 
						//asigno a variable al core
						sap.ui.getCore().setModel(vExtenderPro, "vExtenderPro");
					}
					this.onModificarCab(row);
				}
				//si es	PM

				if (vUserType === "02") {

					//if (_TabPromo.oData.DATA[vPos].EstSolExt !== "" && _TabPromo.oData.DATA[vPos].EstSolExt !== "0") {

						if (_TabPromo.oData.DATA[vPos].Estado > 7 && _TabPromo.oData.DATA[vPos].Estado < 11) {
							sap.m.MessageToast.show("Solo puede ser Modificado en los estado EN CREACION o POR APROBAR");

							// 	debugger
								return;
						}
					//}

					// si esta entre los estados aprobado e istalado 
					if (_TabPromo.oData.DATA[vPos].Estado > 2 && _TabPromo.oData.DATA[vPos].Estado < 10) {
						// solo puede modificar fecha de Extención/Caducacion de la Promo 

						MessageBox.information("Solo es posible Exterder/Caducar la Promo.", {
							actions: ["Aceptar", MessageBox.Action.CLOSE],
							emphasizedAction: "Manage Products",
							onClose: function (sAction) {

								if (sAction === "Aceptar") {
									vExtenderPro = "X"; // si 
									//asigno a variable al core
									sap.ui.getCore().setModel(vExtenderPro, "vExtenderPro");
									vTipoAccion = "C";
									sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion");
									vthis.onModificarCab(row);
								}

							}
						});

					} else {
						this.onModificarCab(row);
					}
				}

				//// inicio comentario IH 
				// if (vValOrigen === "Promo") {
				// 	var varConsulta = "/ConsultaAccionProSet(IdCatalogo='" + vNumCatalogo + "',IdTipoCat='2',Check1='C')";

				// 	// Función de existo
				// 	function fSuccess(oEvent2) {

				// 		bDialog.close();
				// 		vGFechaPublicI = oEvent2.FechaDesde.substr(6, 2) + "." + oEvent2.FechaDesde.substr(4, 2) + "." + oEvent2.FechaDesde.substr(0, 4);
				// 		vGFechaPublicF = oEvent2.FechaHasta.substr(6, 2) + "." + oEvent2.FechaHasta.substr(4, 2) + "." + oEvent2.FechaHasta.substr(0, 4);

				// 		sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
				// 		sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");

				// 		// asigna N° de parte al core
				// 		sap.ui.getCore().setModel(vGParte, "vGParte");
				// 		//navega a la Vista Nueva promo

				// 		vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

				// 	}

				// 	// Función de error
				// 	function fError(oEvent2) {

				// 		bDialog.close();
				// 		sap.m.MessageToast.show("Error al consultar Acción Promocional");
				// 	}

				// 	// consulta Listado de promociones 

				// 	bDialog.open();
				// 	Modelo.read(varConsulta, {
				// 		success: fSuccess,
				// 		error: fError

				// 	});

				// }

				// if (vValOrigen === "Cata") {

				// 	// var vFp1 = sap.ui.getCore().getModel("vGFechaPublicI");
				// 	// var vFp2 = sap.ui.getCore().getModel("vGFechaPublicF");
				// 	// 

				// 	// vGFechaPublicI = vFp1;
				// 	// vGFechaPublicF = vFp2;

				// 	// sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
				// 	// sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");

				// 	// asigna N° de parte al core
				// 	sap.ui.getCore().setModel(vGParte, "vGParte");
				// 	//navega a la Vista Nueva promo

				// 	vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

				// }

				//// fin comentario IH 

			} else {
				sap.m.MessageToast.show("No Existe Promo a Modificar");
			}
		},

		onModificarCab: function (vrow) {

			var vthis = this;

			var vPos = vrow.substr(6);
			//Selecciona el registro de la tabla 
			vValNumPromo = _TabPromo.oData.DATA[vPos].Idpromo;
			// Optiene N° de la parte 
			vGParte = _TabPromo.oData.DATA[vPos].Idparte;

			if (vValOrigen === "Promo") {
				var varConsulta = "/ConsultaAccionProSet(IdCatalogo='" + vNumCatalogo + "',IdTipoCat='2',Check1='C')";

				// Función de existo
				function fSuccess(oEvent2) {

					bDialog.close();
					vGFechaPublicI = oEvent2.FechaDesde.substr(6, 2) + "." + oEvent2.FechaDesde.substr(4, 2) + "." + oEvent2.FechaDesde.substr(0, 4);
					vGFechaPublicF = oEvent2.FechaHasta.substr(6, 2) + "." + oEvent2.FechaHasta.substr(4, 2) + "." + oEvent2.FechaHasta.substr(0, 4);

					sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
					sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");

					// asigna N° de parte al core
					sap.ui.getCore().setModel(vGParte, "vGParte");
					//navega a la Vista Nueva promo

					vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

				}

				// Función de error
				function fError(oEvent2) {

					bDialog.close();
					sap.m.MessageToast.show("Error al consultar Acción Promocional");
				}

				// consulta Listado de promociones 

				bDialog.open();
				Modelo.read(varConsulta, {
					success: fSuccess,
					error: fError

				});

			}

			if (vValOrigen === "Cata") {

				// var vFp1 = sap.ui.getCore().getModel("vGFechaPublicI");
				// var vFp2 = sap.ui.getCore().getModel("vGFechaPublicF");
				// 

				// vGFechaPublicI = vFp1;
				// vGFechaPublicF = vFp2;

				// sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
				// sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");

				// asigna N° de parte al core
				sap.ui.getCore().setModel(vGParte, "vGParte");
				//navega a la Vista Nueva promo

				vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

			}

		},

		onVisual: function (oEvent) {

			var vthis = this;
			//var codigo = vthis.getView().getModel();

			//ubica el registro que se ha marcado 
			// var row = oEvent.getSource().getParent().getId();

			// var vValString = row.indexOf("table1");

			// var vPos = row.substr(vValString + 7);

			var row = oEvent.getSource().oPropagatedProperties.oBindingContexts.TabPromo.sPath;
			var vPos = row.substr(6);

			//Selecciona el registro de la tabla 

			vValNumPromo = _TabPromo.oData.DATA[vPos].Idpromo;
			// Optiene N° de la parte 
			vGParte = _TabPromo.oData.DATA[vPos].Idparte;
			// va a la siguiente vista si solo contiene N° de promo
			if (vValNumPromo !== "0") {
				//asigno a variable al core
				sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo"); //Numero de la promo
				vTipoAccion = "C"; //consulta data
				sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion"); //Numero de la promo
				if (vValOrigen === "Promo") {
					// si es una acción promocional asigna el N° de la acción al catalogo  dummy
					vNumCatalogo = _TabPromo.oData.DATA[vPos].Idcatalogo;
					sap.ui.getCore().setModel(vNumCatalogo, "vValNumCatalogo");
				}
				//navega a la Vista Nueva promo

				// asigna N° de parte al core
				sap.ui.getCore().setModel(vGParte, "vGParte");

				vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

			} else {
				sap.m.MessageToast.show("No Existe Promo a Visualizar");
			}

		},

		onBorrarPromo: function (oEvent) {
			//__PORDES

			var oDataMod = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			var row = oEvent.getSource().oPropagatedProperties.oBindingContexts.TabPromo.sPath;
			var vPos = row.substr(6);

			var aTabPro = {
				IdCatalogo: _TabPromo.oData.DATA[vPos].Idcatalogo,
				IdPromo: _TabPromo.oData.DATA[vPos].Idpromo,
				IdParte: _TabPromo.oData.DATA[vPos].Idparte
			};

			sap.m.MessageBox.confirm("Está seguro que desea borrar la promoción " + aTabPro.IdPromo + "?", {
				onClose: function (e) {
					if (e === "OK") {
						this.getView().setBusy(true);
						oDataMod.create("/EliminaPromoSet", aTabPro, {
							success: function (oEvent) {
								var oDataMod = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
								var oFilters = [];
								var filter = null;
								filter = new sap.ui.model.Filter({
									path: "Fdesde",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: "20000101"
								});
								oFilters.push(filter);
								//Fecha Hasta
								filter = new sap.ui.model.Filter({
									path: "Fhasta",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: "99991231"
								});
								oFilters.push(filter);
								//N° Catalogo
								filter = new sap.ui.model.Filter({
									path: "Idcatalogo",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: vNumCatalogo
								});
								oFilters.push(filter);
								//tipo de catalogo/accion promocional
								filter = new sap.ui.model.Filter({
									path: "Tipocat",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: vValorTipoLista
								});
								oFilters.push(filter);
								oDataMod.read("/ListaPromoMainSet", {
									success: function (oEvent) {
										this.getView().setBusy(false);
										var TabPromo1 = new JSONModel({
											DATA: []
										});
										TabPromo1.setProperty("/DATA", oEvent.results);
										// asigna a variable global 
										_TabPromo = TabPromo1;
										// asignar el modelo a la vista
										this.getView().setModel(TabPromo1, "TabPromo");
										vTable1.setBusy(false);
										vidHeadre1.setNumber(oEvent.results.length);
										//verifica si el catalogo esta cerrado o no 
										if (vValOrigen === "Cata") {
											if (vGCatCerrado === "X") {
												vNuevaPromo.setBlocked(true);
											} else {
												vNuevaPromo.setBlocked(false);
											}
										}
										sap.m.MessageBox.show("Promoción eliminada correctamente!", {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Operación exitosa",
											actions: sap.m.MessageBox.Action.CLOSE
										});
									}.bind(this),
									error: function (oEvent) {
										this.getView().setBusy(false);
									},
									filters: oFilters
								});
							}.bind(this),
							error: function (oEvent) {}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		onNuevoPromo: function (oEvent) {
			//ubica el registro que se ha marcado 

			var row = oEvent.getSource().oPropagatedProperties.oBindingContexts.TabPromo.sPath;
			var vPos = row.substr(6);

			//Selecciona el registro de la tabla 
			vNumCatalogo = _TabPromo.oData.DATA[vPos].Idcatalogo; //Id Catalogo
			//vValNumPromo = _TabPromo.oData.DATA[vPos].Idpromo; //Id Promo
			// Optiene N° de la parte 
			vGParte = _TabPromo.oData.DATA[vPos].Idparte;

			//Busca acción promocional
			var vthis = this;

			var varConsulta = "/ConsultaAccionProSet(IdCatalogo='" + vNumCatalogo + "',IdTipoCat='2',Check1='C')";

			// Función de existo
			function fSuccess(oEvent2) {

				bDialog.close();

				var vModelAccionP = {
					"IdCatalogo": oEvent2.IdCatalogo,
					"NomCatalogo": oEvent2.NomCatalogo,
					"FechaDesde": oEvent2.FechaDesde,
					"FechaHasta": oEvent2.FechaHasta
				};
				if (vValOrigen === "Promo") {
					vGFechaPublicI = oEvent2.FechaDesde.substr(6, 2) + "." + oEvent2.FechaDesde.substr(4, 2) + "." + oEvent2.FechaDesde.substr(0, 4);
					vGFechaPublicF = oEvent2.FechaHasta.substr(6, 2) + "." + oEvent2.FechaHasta.substr(4, 2) + "." + oEvent2.FechaHasta.substr(0, 4);

					sap.ui.getCore().setModel(vGFechaPublicI, "vGFechaPublicI");
					sap.ui.getCore().setModel(vGFechaPublicF, "vGFechaPublicF");
				}

				vValNumPromo = "";
				sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");
				//navega a la Vista Nueva promo
				var vValLimpiarNP = "X";
				sap.ui.getCore().setModel(vValLimpiarNP, "vValLimpiarNP");
				vTipoAccion = "I"; //Insertar data
				sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion"); //Numero de la promo
				sap.ui.getCore().setModel(vNumCatalogo, "vValNumCatalogo"); // Numero de catalogo

				// asigna N° de parte al core
				sap.ui.getCore().setModel(vGParte, "vGParte");
				vthis.getOwnerComponent().getTargets().display("ZNuevaPromo");

			}

			// Función de error
			function fError(oEvent2) {

				bDialog.close();
				sap.m.MessageToast.show("Error al consultar Acción Promocional");
			}

			// consulta Listado de promociones 

			bDialog.open();
			Modelo.read(varConsulta, {
				success: fSuccess,
				error: fError

			});

		},

		// onNuevo: function (oEvent) {

		// 	//ubica el registro que se ha marcado 
		// 	//var row = oEvent.getSource().getParent().getId();
		// 	var row = oEvent.getSource().oPropagatedProperties.oBindingContexts.TabPromo.sPath;
		// 	var vPos = row.substr(6);
		// 	//var vValString = row.indexOf("table1");

		// 	//var vPos = row.substr(vValString + 7);

		// 	//Selecciona el registro de la tabla 
		// 	vNumCatalogo = _TabPromo.oData.DATA[vPos].Idcatalogo; //Id Catalogo
		// 	vValNumPromo = _TabPromo.oData.DATA[vPos].Idpromo; //Id Promo
		// 	// Optiene N° de la parte 
		// 	vGParte = _TabPromo.oData.DATA[vPos].Idparte;

		// 	// if (vValNumPromo === "0000000000") {

		// 	vValNumPromo = "";
		// 	sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");
		// 	//navega a la Vista Nueva promo
		// 	var vValLimpiarNP = "X";
		// 	sap.ui.getCore().setModel(vValLimpiarNP, "vValLimpiarNP");
		// 	vTipoAccion = "I"; //Insertar data
		// 	sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion"); //Numero de la promo
		// 	sap.ui.getCore().setModel(vNumCatalogo, "vValNumCatalogo"); // Numero de catalogo

		// 	// asigna N° de parte al core
		// 	sap.ui.getCore().setModel(vGParte, "vGParte");
		// 	this.getOwnerComponent().getTargets().display("ZNuevaPromo");

		// 	// }

		// },

		onLinkAccion: function (oEvent) {
			//**Modifica el Nombre y fecha de la acción promocional**//
			//Busca acción promocional
			var vthis = this;

			var vIdAccioPromo = oEvent.getSource().getAccessibilityInfo().description;
			var varConsulta = "/ConsultaAccionProSet(IdCatalogo='" + vIdAccioPromo + "',IdTipoCat='2',Check1='C')";

			// Función de existo
			function fSuccess(oEvent2) {

				var vModelAccionP = {
					"IdCatalogo": oEvent2.IdCatalogo,
					"NomCatalogo": oEvent2.NomCatalogo,
					"FechaDesde": oEvent2.FechaDesde,
					"FechaHasta": oEvent2.FechaHasta
				};

				// exporta el modelo en el core 
				sap.ui.getCore().setModel(vModelAccionP, "vModelAccionP");

				vthis.getOwnerComponent().getTargets().display("CatalogoMain");
			}

			// Función de error
			function fError(oEvent2) {
				sap.m.MessageToast.show("Error al cargar datos");
			}

			// consulta Listado de promociones 
			Modelo.read(varConsulta, {
				success: fSuccess,
				error: fError

			});

		},

		onBack: function () {
			// blanque el numero de Catalogo
			vNumCatalogo = "";
			sap.ui.getCore().setModel(vNumCatalogo, "vValNumCatalogo");
			// blanqueael numero de promo 
			vValNumPromo = "";
			sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");

			if (vValOrigen === "Cata") {
				this.getOwnerComponent().getTargets().display("CatalogoMain");

			} else {
				if (vValOrigen === "Promo") {

					this.getOwnerComponent().getTargets().display("TipoAccionMain");
				}

			}

		},
		createColumnConfig: function () {
			return [{
					label: "N° Catalogo",
					property: "IdCatalogo",
					type: "number",
					scale: 0
				}, {
					label: "Nombre Catalogo",
					property: "NomCatalogo",
					width: "25"
				}, {
					label: "N° Promoción",
					property: "IdPromo",
					width: "25"
				}, {
					label: "Nombre Promo",
					property: "NomPromo",
					width: "25"
				}, {
					label: "Promoción CyP",
					property: "DenomPromoC",
					width: "25"
				}, {
					label: "Fecha Desde",
					property: "FechaDesde",
					type: "string"
				}, {
					label: "Fecha Hasta",
					property: "FechaHasta",
					type: "string"
				}, {
					label: "Parte",
					property: "IdParte",
					type: "string"
				}, {
					label: "Cluster",
					property: "IdCluster",
					type: "string"
				}, {
					label: "Cluster",
					property: "IdCluster",
					type: "string"
				}, {
					label: "SKU",
					property: "Sku",
					type: "string"
				}, {
					label: "Descripción SKU",
					property: "Descrip",
					type: "string"
				}, {
					label: "Precio",
					property: "Precio",
					type: "string"
				}, {
					label: "Precio Antes",
					property: "PrecioAntes",
					type: "string"
				}, {
					label: "Precio Referencia",
					property: "PrecioRef",
					type: "string"
				}, {
					label: "% Dcto",
					property: "PorcDcto",
					type: "string"
				}, {
					label: "Cantida X",
					property: "CantX",
					type: "string"
				}, {
					label: "Cantida Cuota",
					property: "CantCuot",
					type: "string"
				}, {
					label: "Valor Cuota",
					property: "ValorCuota",
					type: "string"
				}, {
					label: "CAE",
					property: "Ccae",
					type: "string"
				}, {
					label: "CTC",
					property: "Cctc",
					type: "string"
				}, {
					label: "Centros",
					property: "Centro",
					type: "string",
					width: "45"
				}

			];
		},

		createColumnConfig2: function () {
			return [{
				label: "N° Catalogo",
				property: "IdCatalogo",
				type: "number",
				scale: 0
			}, {
				label: "Nombre Catalogo",
				property: "NomCatalogo",
				width: "25"
			}, {
				label: "N°Promo",
				property: "IdPromo",
				width: "25"
			}, {
				label: "Denominación Promo",
				property: "DenomPromo",
				width: "25"
			}, {
				label: "Fecha Desde",
				property: "FechaDesde",
				width: "15"
			}, {
				label: "Fecha Hasta",
				property: "FechaHasta",
				width: "15"
			}, {
				label: "Parte",
				property: "IdParte",
				width: "10"
			}, {
				label: "Tipo Pack",
				property: "TipoPack",
				width: "25"
			}, {
				label: "TipoBenef",
				property: "Tipo Beneficio",
				width: "25"
			}, {
				label: "Tipo Beneficio Grupo",
				property: "TipoBgrupo",
				width: "25"
			}, {
				label: "Tipo Condición 1",
				property: "TipoCond",
				width: "25"
			}, {
				label: "Unida de la Condición 1",
				property: "UnidCond",
				width: "25"
			}, {
				label: "Tipo Condición 2",
				property: "TipoCond2",
				width: "25"
			}, {
				label: "Unida de la Condición 2",
				property: "UnidCond2",
				width: "25"
			}, {
				label: "Tipo Condición 3",
				property: "TipoCond3",
				width: "25"
			}, {
				label: "Unida de la Condición 3",
				property: "UnidCond3",
				width: "25"
			}, {
				label: "Forma de Pago 1",
				property: "Fpago1",
				width: "25"
			}, {
				label: "Descuento 1",
				property: "Descto1",
				width: "25"
			}, {
				label: "Forma de Pago 2",
				property: "Fpago2",
				width: "25"
			}, {
				label: "Descuento 2",
				property: "Descto2",
				width: "25"
			}, {
				label: "Forma de Pago 3",
				property: "Fpago3",
				width: "25"
			}, {
				label: "Descuento 3",
				property: "Descto3",
				width: "25"
			}, {
				label: "Tipo de Ingreso 1",
				property: "TipoIng",
				width: "25"
			}, {
				label: "Articulos 1",
				property: "Artic1",
				width: "25"
			}, {
				label: "Tipo de Ingreso 2",
				property: "TipoIng2",
				width: "25"
			}, {
				label: "Articulos 2",
				property: "Artic2",
				width: "25"
			}, {
				label: "Tipo de Ingreso 3",
				property: "TipoIng3",
				width: "25"
			}, {
				label: "Articulos 3",
				property: "Artic3",
				width: "25"
			}, {
				label: "Lleva",
				property: "Lleva",
				width: "25"
			}, {
				label: "Paga",
				property: "Paga",
				width: "25"
			}, {
				label: "Lleva 2",
				property: "Lleva2",
				width: "25"
			}, {
				label: "Paga 2",
				property: "Paga2",
				width: "25"
			}, {
				label: "Lleva 3",
				property: "Lleva3",
				width: "25"
			}, {
				label: "Paga 3",
				property: "Paga3",
				width: "25"
			}, {
				label: "Precio Pack1",
				property: "PrecioP1",
				width: "25"
			}, {
				label: "Precio Pack2",
				property: "PrecioP2",
				width: "25"
			}, {
				label: "Precio Pack3",
				property: "PrecioP3",
				width: "25"
			}, {
				label: "Descripción",
				property: "Descrip",
				width: "25"
			}, {
				label: "Observación",
				property: "Observ",
				width: "25"
			}, {
				label: "Centros",
				property: "Centro",
				width: "25"
			}]
		},

		onClick: function () {
			var vthis = this;

			var vTipoPromo1 = "";

			if (vValOrigen === "Cata") {
				vTipoPromo1 = "1";
			} else {
				vTipoPromo1 = "2";
			}

			// Parámetros (Agrega filtros a la consulta)****** 
			var oFilters = [];
			var filter = null;
			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Idcatalog",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vNumCatalogo
			});
			// Fecha de vigencia 
			oFilters.push(filter);
			//Fecha desde
			filter = new sap.ui.model.Filter({
				path: "Fechaini",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "20000101"
			});
			oFilters.push(filter);
			//Fecha Hasta
			filter = new sap.ui.model.Filter({
				path: "Fechafin",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "99991231"
			});
			oFilters.push(filter);

			//Tipo catalogo (1= catalogo/ 2=Accion promocional)
			filter = new sap.ui.model.Filter({
				path: "Tipocat",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vTipoPromo1
			});
			oFilters.push(filter);

			// Función de existo
			function fSuccess(oEvent) {
				var row = {};
				var Tab = [];
				bDialog.close();
				//llena el Json para descarga
				for (var i = 0; i < oEvent.results.length; i++) {
					row = oEvent.results[i];
					Tab.push(row);
				}
				// descarga archivo en excel 

				if (Tab.length > 0) {
					vthis.bajarExcel(Tab);
				} else {
					sap.m.MessageToast.show("No existen datos para descargar");
				}

			}

			// Función de error
			function fError(oEvent) {
				bDialog.close();
				sap.m.MessageToast.show("Error al extraer datos");
			}

			// consulta centros

			bDialog.open();
			Modelo.read("/ConsultaCYPExcelSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

			///////////

		},
		bajarExcel: function (Tab1) {
			// baja archivo en excel
			var aCols, oSettings, oSheet;

			aCols = this.createColumnConfig();
			//aProducts = this.getView().getModel().getProperty("/");

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: Tab1,
				fileName: "Campaña y Promociones.xlsx"
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show("Archivo descargado");
				})
				.finally(function () {
					oSheet.destroy();
				});

		},
		bajarExcelPangui: function (Tab1) {
			// baja archivo en excel
			var aCols, oSettings, oSheet;

			aCols = this.createColumnConfig2();

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: Tab1,
				fileName: "Pangui.xlsx"
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show("Archivo descargado");
				})
				.finally(function () {
					oSheet.destroy();
				});

		},

		onNewPro: function () {
			// Crea nueva Promocion  para un catalogo 

			if (vValOrigen === "Cata") {
				vValNumPromo = "";
				sap.ui.getCore().setModel(vValNumPromo, "vValNumPromo");
				//navega a la Vista Nueva promo
				var vValLimpiarNP = "X";
				sap.ui.getCore().setModel(vValLimpiarNP, "vValLimpiarNP");

				vTipoAccion = "I"; //Insertar data
				sap.ui.getCore().setModel(vTipoAccion, "vTipoAccion"); //Numero de la promo

				this.getOwnerComponent().getTargets().display("ZNuevaPromo");

			} else {
				if (vValOrigen === "Promo") {

					// asignar el modelo a la vista al fragment
					this._Dialog = sap.ui.xmlfragment("ZCatalogoMesa.zcatalogo.fragmentViews.NuevaAccionPro", this);
					this._Dialog.setModel(this.getView().getModel());
					// abre el fragment
					this._Dialog.open();

					this.listCentros();

				}

			}

		},

		listCentros: function () {
			// Parámetros (Agrega filtros a la consulta)******                
			var oFilters = [];
			var filter = null;
			var vthis = this;

			var TabSur = new JSONModel({
				DATA: []
			});
			var TabNorte = new JSONModel({
				DATA: []
			});
			var TabCentro = new JSONModel({
				DATA: []
			});

			//Id Catalogo
			filter = new sap.ui.model.Filter({
				path: "Pcatalogo",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: ""
			});
			oFilters.push(filter);
			//Id Promocion

			if (vValNumPromo !== undefined) {
				filter = new sap.ui.model.Filter({
					path: "PPromo",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: ""
				});
				oFilters.push(filter);
			}

			function fSuccess(oEvent) {

				// llena tabla en Zona Norte 

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

				var TabCabFragment = sap.ui.getCore().byId("cabFrag");

				var TabNorteT = sap.ui.getCore().byId("table0");
				var TabCentroT = sap.ui.getCore().byId("table1");
				var TabSurT = sap.ui.getCore().byId("table2");

				// asignar el modelo a la vista Norte
				TabNorteT.setModel(TabNorte, "TabNorte");
				// asignar el modelo a la vista centro
				TabCentroT.setModel(TabCentro, "TabCentro");
				// asignar el modelo a la vista Sur
				TabSurT.setModel(TabSur, "TabSur");
				bDialog.close();

			}

			function fError(oEvent) {
				sap.m.MessageToast.show("Error al cargar Centros");
				bDialog.close();
			}

			// consulta centros
			bDialog.open();
			Modelo.read("/ConsultaZonaCentroSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

		},

		onDesPangui: function () {

			var vthis = this;

			// Parámetros (Agrega filtros a la consulta)****** 
			var oFilters = [];
			var filter = null;

			//Fecha desde
			filter = new sap.ui.model.Filter({
				path: "Tipocat",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: vValorTipoLista
			});
			oFilters.push(filter);
			//Fecha desde
			filter = new sap.ui.model.Filter({
				path: "Fechaini",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "20000101"
			});
			oFilters.push(filter);
			//Fecha Hasta
			filter = new sap.ui.model.Filter({
				path: "Fechafin",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "99991231"
			});
			oFilters.push(filter);

			// Función OK
			function fSuccess(oEvent) {

				// descarga archivo en excel 
				bDialog.close();
				if (oEvent.results.length > 0) {
					vthis.bajarExcelPangui(oEvent.results);
				} else {
					sap.m.MessageToast.show("No existen datos para descargar");
				}

			}

			// Función de error
			function fError(oEvent) {

				bDialog.close();
				sap.m.MessageToast.show("Error al extraer datos");
			}

			// consulta centros
			bDialog.open();

			Modelo.read("/ListExtraePanguiSet", {
				success: fSuccess,
				error: fError,
				filters: oFilters
			});

		},
		////////// funciones del Fragment NuevaAccionPro///////////////
		onCrearPromo: function () {
			var vthis = this;

			// crea Acción promocional 
			var oEntrada = {
				"IdCatalogo": "",
				"NomCatalogo": "",
				"FechaDesde": "",
				"FechaHasta": "",
				"Check1": "I",
				"Centros": ""
			};
			//Nombre de la acción 
			oEntrada.NomCatalogo = sap.ui.getCore().byId("NombreCat").getAccessibilityInfo().description;
			//Fecha de la acción 
			var vFechaFormato = sap.ui.getCore().byId("RangoPromo").getAccessibilityInfo().description.replace(/[/\s]/g, '');
			oEntrada.FechaDesde = vFechaFormato.substr(0, 8);
			oEntrada.FechaHasta = vFechaFormato.substr(10, 8);

			var sCentroSel = sap.ui.getCore().byId("table0").getSelectedItems().length;
			var sCentroSel1 = sap.ui.getCore().byId("table1").getSelectedItems().length;
			var sCentroSel2 = sap.ui.getCore().byId("table2").getSelectedItems().length;

			if (sCentroSel === 0 && sCentroSel1 === 0 && sCentroSel2 === 0) {
				sap.m.MessageToast.show("Debe seleccionar al menos un centro.");
				return;
			}

			// verifica que los campos no se encuenten vacios
			if (oEntrada.NomCatalogo === "") {
				sap.m.MessageToast.show("Complete todos los datos");
				return;
			}

			if (vFechaFormato === "" || vFechaFormato === "yyyyMMdd--yyyyMMddFecha") {
				sap.m.MessageToast.show("Complete todos los datos");
				return;
			}

			// verifica que la fecha de creación de la accion promocional no este en el pasado
			var vFechaPp1 = new Date().toJSON().slice(0, 10).replace(/-/g, '/'); // Fecha de Hoy
			var vFechaPp2 = sap.ui.getCore().byId("RangoPromo").getValue().slice(14, 24);
			if (vFechaPp2 <= vFechaPp1) {

				sap.m.MessageToast.show("La fecha de Culminación debe ser mayor a la del Dia");
				return;
			}

			//Arma String de Centro
			var vTab1Resul = sap.ui.getCore().byId("table0").getSelectedItems();
			var vTab1Resul2 = sap.ui.getCore().byId("table1").getSelectedItems();
			var vTab1Resul3 = sap.ui.getCore().byId("table2").getSelectedItems();
			var vSCentro = "";

			for (var i = 0; i < vTab1Resul.length; i++) {
				var item = vTab1Resul[i];
				var Cells = item.getCells();
				vSCentro = vSCentro + Cells[2].getText() + "," + Cells[0].getText() + "|"
			}

			for (var i = 0; i < vTab1Resul2.length; i++) {
				var item2 = vTab1Resul2[i];
				var Cells2 = item2.getCells();
				vSCentro = vSCentro + Cells2[2].getText() + "," + Cells2[0].getText() + "|"
			}

			for (var i = 0; i < vTab1Resul3.length; i++) {
				var item3 = vTab1Resul3[i];
				var Cells3 = item3.getCells();
				vSCentro = vSCentro + Cells3[2].getText() + "," + Cells3[0].getText() + "|"
			}

			oEntrada.Centros = vSCentro;

			// Función de éxito
			function fSuccess(oEvent) {

				var vModelAccionP = {
					"IdCatalogo": oEvent.IdCatalogo,
					"NomCatalogo": oEvent.NomCatalogo,
					"FechaDesde": oEvent.FechaDesde,
					"FechaHasta": oEvent.FechaHasta
				};
				// exporta el modelo en el core 

				sap.ui.getCore().setModel(vModelAccionP, "vModelAccionP");

				vthis.getOwnerComponent().getTargets().display("CatalogoMain");
				vthis._Dialog.destroy(true);
				vthis._Dialog.close();
			}

			function fError(oEvent) {

				sap.m.MessageToast.show("Error al Guardar Registro ");

			}

			// Consume servicio para grabar catalogo CyP

			Modelo.create("/GrabarAccionProSet", oEntrada, {
				success: fSuccess,
				error: fError

			});

		},

		onClosePromo: function () {

			this._Dialog.destroy(true);
			this._Dialog.close();

		}

	});

});