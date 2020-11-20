sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
	"use strict";
	var modelo = null;
	var vTipoAccion = ""; // I = insertar, M = Modificar , C = consultar

	var vSku = "";
	var vDescrip = "";
	var vPrecio = "";
	var vPrecioantes = "";
	var vPrecioref = "";
	var vPorcdcto = "";
	var vCantx = "";
	var vCantcuot = "";
	var vValorcuota = "";
	var vCcae = "";
	var vCctc = "";
	var vCond = "";
	var vFechav = "";
	var vFvd = "";
	var vFvh = "";

	var voEvent1 = "";
	var vValNumCatalogo = "";
	var vValNumPromo = "";
	var vValOrigen = "";
	var vpanel = null;
	var vGParte = "";
	var vExistePromo = "";
	var VfechaDesde = "";

	var vInComple = ""; //Complemento
	var vInPrecioMas = ""; //Precio +
	var vInCanty = ""; //Cantidad Y 
	var vInPuntos = ""; //Puntos
	var vInExcepcion = ""; //Excepcion

	return Controller.extend("ZCatalogoMesa.zcatalogo.controller.CargaCarteleria", {

		onInit: function () {

			// var _oSF2 = this.getView().byId("hbox0");
			// _oSF2.addContent(new sap.m.Input(this.getView().createId("idExtensionInput1"), {
			//         text : "text",
			//         enabled: false
			//     }));

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("CargaCarteleria").attachDisplay(null, this.onDisplay, this);
		},

		onDisplay: function () {

			//accedo a las variables globales N° de catalog, N° de promo 
			vValNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");
			vValNumPromo = sap.ui.getCore().getModel("vValNumPromo");
			vValOrigen = sap.ui.getCore().getModel("vValOrigen"); // Origen del ciclo
			VfechaDesde = sap.ui.getCore().getModel("VfechaDesde"); // fecha inicio de la promoción

			vExistePromo = sap.ui.getCore().getModel("vExistePromo");

			// N° de parte 
			vGParte = sap.ui.getCore().getModel("vGParte");

			// accedo a la variable  tipo de accion 
			vTipoAccion = sap.ui.getCore().getModel("vTipoAccion");

			// si la promocion no existe  variable vTipoAccion pasa a I = insetar
			if (vExistePromo === "X") {
				vTipoAccion = "I";
			}

			var vTextCatalogo = this.byId("IdtextCata");
			var vTextPromo = this.byId("IdtextPromo");
			vpanel = this.byId("panel0");

			// oculta boton de guradar si es una consulta
			var vBotonGuardar = this.byId("Guardar");
			if (vTipoAccion === "C") {
				vBotonGuardar.setVisible(false);
			} else {
				vBotonGuardar.setVisible(true);

			}

			vTextCatalogo.setText(vValNumCatalogo);
			vTextPromo.setText(vValNumPromo);

			// Se crea el modelo DEL SERVICIO
			modelo = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGSB_CATALOGO_CONFIO_SRV");
			modelo.setUseBatch(false); // se puede desactivar el uso de batch

			// verifica si es consulta o modificación de la información
			if (vTipoAccion === "C" || vTipoAccion === "M") {
				// busca data asociada 
				this.buscarData();

			} else {
				//habilita campos deacuerdo a la promocion sellecionada
				this.habilitarCampos();
			}

		},

		buscarData: function () {

			var vthis = this;
			// creo modelo json para manejar los datos
			var modelo2 = new JSONModel();
			// asignar el modelo a la vista
			this.getView().setModel(modelo2);

			// Función de éxito
			function fSuccess(oEvent) {
				
				voEvent1 = "";
				voEvent1 = oEvent;

				// busco estructura para desplegar campos 
				// Parámetros (Agrega filtros a la consulta)******                
				var oFilters = [];
				var filter = null;
				//Id tipo de promocion 
				filter = new sap.ui.model.Filter({
					path: "Typepromo",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: oEvent.Tipopromoc
				});
				oFilters.push(filter);

				// Función de éxito
				function fSuccess2(oEvent2) {

					var vPromoCyP = {};
					for (var i = 0; i < oEvent2.results.length; i++) {
						vPromoCyP = oEvent2.results[i];
					}
					sap.ui.getCore().setModel(vPromoCyP, "vGlobalPromoCyP");

					//habilita campos deacuerdo a la promocion sellecionada
					vthis.habilitarCampos();

					// lleno contedido 
					vSku.setValue(voEvent1.Sku);
					vDescrip.setValue(voEvent1.Descrip);
					vPrecio.setValue(voEvent1.Precio);
					vPrecioantes.setValue(voEvent1.Precioantes);
					vPrecioref.setValue(voEvent1.Precioref);
					vPorcdcto.setValue(voEvent1.Porcdcto);
					vCantx.setValue(voEvent1.Cantx);
					vCantcuot.setValue(voEvent1.Cantcuot);
					vValorcuota.setValue(voEvent1.Valorcuota);
					vCcae.setValue(voEvent1.Ccae);
					vCctc.setValue(voEvent1.Cctc);
					vCond.setValue(voEvent1.Condi);

					vInComple.setValue(voEvent1.Complemento);
					vInPrecioMas.setValue(voEvent1.Preciomas);
					vInCanty.setValue(voEvent1.Canty);
					vInPuntos.setValue(voEvent1.Puntos);
					vInExcepcion.setValue(voEvent1.Excepcion);
					vpanel.setBusy(false);

				}

				// Función de error
				function fError2(oEvent2) {

					sap.m.MessageToast.show("Error al Buscar datos");
					vpanel.setBusy(false);
				}

				// consulta centros
				modelo.read("/ListadoPromoCYPSet", {
					success: fSuccess2,
					error: fError2,
					filters: oFilters

				});
			}

			// Función de error
			function fError(oEvent) {
				sap.m.MessageToast.show("Error al Buscar datos");
				vpanel.setBusy(false);
			}

			// Lectura del servicio
			var vFilter = "/ConsultaPromoCYPSet(Idcatalogo='" + vValNumCatalogo +
				"',Idpromo='" + vValNumPromo + "',Idparte='1',Check1='C')";

			modelo.read(vFilter, {
				success: fSuccess,
				error: fError
					//filters: oFilters
			});
			vpanel.setBusy(true);
		},

		habilitarCampos: function () {

			var vthis = this;
			vSku = vthis.getView().byId("InSku");
			vDescrip = vthis.getView().byId("InDescrip");
			vPrecio = vthis.getView().byId("InPrecio");
			vPrecioantes = vthis.getView().byId("InPrecioantes");
			vPrecioref = vthis.getView().byId("InPrecioref");
			vPorcdcto = vthis.getView().byId("InPorcdcto");
			vCantx = vthis.getView().byId("InCantx");
			vCantcuot = vthis.getView().byId("InCantcuot");
			vValorcuota = vthis.getView().byId("InValorcuota");
			vCcae = vthis.getView().byId("InCcae");
			vCctc = vthis.getView().byId("InCctc");
			vCond = vthis.getView().byId("InCond");

			vInComple = vthis.getView().byId("InComple");
			vInPrecioMas = vthis.getView().byId("InPrecioMas");
			vInCanty = vthis.getView().byId("InCanty");
			vInPuntos = vthis.getView().byId("InPuntos");
			vInExcepcion = vthis.getView().byId("InExcepcion");
			//vFechav = vthis.getView().byId("DRS1");
			// vFvd = vthis.getView().byId("InFvd");
			// vFvh = vthis.getView().byId("InFvh");

			//Inicializa los campos = False

			vSku.setVisible(false);
			vDescrip.setVisible(false);
			vPrecio.setVisible(false);
			vPrecioantes.setVisible(false);
			vPrecioref.setVisible(false);
			vPorcdcto.setVisible(false);
			vCantx.setVisible(false);
			vCantcuot.setVisible(false);
			vValorcuota.setVisible(false);
			vCcae.setVisible(false);
			vCctc.setVisible(false);
			vCond.setVisible(false);

			vInComple.setVisible(false);
			vInPrecioMas.setVisible(false);
			vInCanty.setVisible(false);
			vInPuntos.setVisible(false);
			vInExcepcion.setVisible(false);
			// vFvd.setVisible(false);
			// vFvh.setVisible(false);

			// accedo a las variables  del core

			var vPromoCyP = sap.ui.getCore().getModel("vGlobalPromoCyP");
			// Muestra los campos dependiendo de la opcion Tomada
			// SKU
			if (vPromoCyP.Sku === "X") {
				vSku.setVisible(true);
			}
			//Descripcion
			if (vPromoCyP.Descrip === "X") {
				vDescrip.setVisible(true);
			}
			//Precio
			if (vPromoCyP.Precio === "X") {
				vPrecio.setVisible(true);
			}
			//Precio antes
			if (vPromoCyP.Precioantes === "X") {
				vPrecioantes.setVisible(true);
			}
			//Precio Ref
			if (vPromoCyP.Precioref === "X") {
				vPrecioref.setVisible(true);
			}
			//Producto desc
			if (vPromoCyP.Porcdcto === "X") {
				vPorcdcto.setVisible(true);
			}
			//Cantidad x
			if (vPromoCyP.Cantx === "X") {
				vCantx.setVisible(true);
			}
			//CAntidad Cuota 
			if (vPromoCyP.Cantcuot === "X") {
				vCantcuot.setVisible(true);
			}
			//Valor Cuota 
			if (vPromoCyP.Valorcuota === "X") {
				vValorcuota.setVisible(true);
			}
			//Ccae 
			if (vPromoCyP.Ccae === "X") {
				vCcae.setVisible(true);
			}
			//Cctc 
			if (vPromoCyP.Cctc === "X") {
				vCctc.setVisible(true);
			}
			//Cond 
			if (vPromoCyP.Cond === "X") {
				vCond.setVisible(true);
			}
			//Complemento 
			if (vPromoCyP.Complemento === "X") {
				vInComple.setVisible(true);
			}
			//Precio + 
			if (vPromoCyP.Preciomas === "X") {
				vInPrecioMas.setVisible(true);
			}
			//Cantidad Y 
			if (vPromoCyP.Canty === "X") {
				vInCanty.setVisible(true);
			}
			//Puntos 
			if (vPromoCyP.Puntos === "X") {
				vInPuntos.setVisible(true);
			}
			//Excepcion
			if (vPromoCyP.Excepcion === "X") {
				vInExcepcion.setVisible(true);
			}
			//Fecha vigencia desde
			// if (vPromoCyP.Fvd === "X") {
			// 	vFvd.setVisible(true);
			// }
			// //Fecha vigencia hasta
			// if (vPromoCyP.Fvh === "X") {
			// 	Fvh.setVisible(true);
			// }

			//cambio titulo del panel

			var vTituloPromo = this.getView().byId("textpromo");
			vTituloPromo.setText("PROMO" + " " + vPromoCyP.Denompromoc);

			// habilita o no los campos Text  depediendo de la dispocision 

			if (vTipoAccion === "C") {

				vSku.setEnabled(false);
				vDescrip.setEnabled(false);
				vPrecio.setEnabled(false);
				vPrecioantes.setEnabled(false);
				vPrecioref.setEnabled(false);
				vPorcdcto.setEnabled(false);
				vCantx.setEnabled(false);
				vCantcuot.setEnabled(false);
				vValorcuota.setEnabled(false);
				vCcae.setEnabled(false);
				vCctc.setEnabled(false);
				vCond.setEnabled(false);
				vInComple.setEnabled(false);
				vInPrecioMas.setEnabled(false);
				vInCanty.setEnabled(false);
				vInPuntos.setEnabled(false);
				vInExcepcion.setEnabled(false);
				//vFechav.setEnabled(false);
				// vFvd.setEnabled(false);
				// vFvh.setEnabled(false);
			} else {
				vSku.setEnabled(true);
				vDescrip.setEnabled(true);
				vPrecio.setEnabled(true);
				vPrecioantes.setEnabled(true);
				vPrecioref.setEnabled(true);
				vPorcdcto.setEnabled(true);
				vCantx.setEnabled(true);
				vCantcuot.setEnabled(true);
				vValorcuota.setEnabled(true);
				vCcae.setEnabled(true);
				vCctc.setEnabled(true);
				vCond.setEnabled(true);
				vInComple.setEnabled(true);
				vInPrecioMas.setEnabled(true);
				vInCanty.setEnabled(true);
				vInPuntos.setEnabled(true);
				vInExcepcion.setEnabled(true);
				//vFechav.setEnabled(true);
				// vFvd.setEnabled(true);
				// vFvh.setEnabled(true);

			}

			// inhabilita campos  para clculo del Tir

			if (vPromoCyP.Tipopromoc === "2" || vPromoCyP.Tipopromoc === "4") {
				vCantcuot.setEnabled(false);
				vValorcuota.setEnabled(false);
				vCcae.setEnabled(false);
				vCctc.setEnabled(false);
			}

		},
		onClick: function () {
			var vthis = this;
			var vreturn = "";

			////// valida entrada de los datos //////	

			if (this.ValidaEntrada(vSku, "N", "Debe Ingresar un SKU", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vDescrip, "N", "Debe Ingresar una Descripción", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vPrecio, "S", "Debe Ingresar el Precio", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vPrecioantes, "S", "Debe Ingresar el Precio Antes", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vPrecioref, "S", "Debe Ingresar el Precio Referencia", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vPorcdcto, "N", "Debe Ingresar el % de descuento", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vCantx, "S", "Debe Ingresar la Cantidad X", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vCantcuot, "S", "Debe Ingresar la Cantidad Cuota", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vValorcuota, "S", "Debe Ingresar el Valor Cuota", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vCcae, "S", "Debe Ingresar el Valor CAE", vreturn) === "X") {
				return;
			}

			if (this.ValidaEntrada(vCctc, "S", "Debe Ingresar el Valor CTC", vreturn) === "X") {
				return;
			}
			
			if (this.ValidaEntrada(vInPuntos, "S", "Debe Ingresar el Valor en Puntos", vreturn) === "X") {
				return;
			}
			//Excepcion
			// if (this.ValidaEntrada(vInExcepcion, "N", "Debe Ingresar el Valor en Excepcion", vreturn) === "X") {
			// 	return;
			// }
			
			//valida que la Descripcion y el complemento no exceda los 40 caracteres
			
			if (vDescrip.getValue().length > 40) {
				sap.m.MessageToast.show("La Descripción debe contener hasta 40 Caracteres");
				return;
			}

			if (vInComple.getValue().length > 40) {
				sap.m.MessageToast.show("El Complemento debe contener hasta 40 Caracteres");
				return;
			}
			
			if (vCond.getValue().length > 20) {
				sap.m.MessageToast.show("la Condición debe contener hasta 20 Caracteres");
				return;
			}
			
			// if (vInExcepcion.getValue().length > 80) {
			// 	sap.m.MessageToast.show("la Excepción debe contener hasta 80 Caracteres");
			// 	return;
			// }

			// if (this.ValidaEntrada(vCond, "S", "Debe Ingresar de la condición", vreturn) === "X") {
			// 	return;
			// }

			/////////////////////////////////////////
			//envia de mensaje de confirmación de guardado 
			MessageBox.confirm("¿Desea Guardar la información?", {
				title: "Confirmar",
				initialFocus: sap.m.MessageBox.Action.CANCEL,
				onClose: function (sButton) {
					if (sButton === MessageBox.Action.OK) {
						//llama Funcion de liberar eventos
						vthis.onClickAcep();
					} else if (sButton === MessageBox.Action.CANCEL) {

					}

				}
			});

		},

		onClickAcep: function () {

			var vthis = this;
			var vpanel4 = this.byId("panel4");
			vpanel4.setBusy(true);

			// guarda registros
			var oentrada = {
				"Idcatalogo": "",
				"Idpromo": "",
				"Idparte": vGParte,
				"Idcluster": "",
				"Tipopromoc": "",
				"Sku": "",
				"Descrip": "",
				"Precio": "",
				"Precioantes": "",
				"Precioref": "",
				"Porcdcto": "",
				"Cantx": "",
				"Cantcuot": "",
				"Valorcuota": "",
				"Ccae": "",
				"Cctc": "",
				"Pmensaje1": "",
				"Pmensaje2": "",
				"Check1": "I",
				"Condi": "",
				"Complemento": "",
				"Preciomas": "",
				"Canty": "",
				"Puntos": "",
				"Excepcion": ""
			};
			// accedo a las variables  del core
			var vNumCatalogo = sap.ui.getCore().getModel("vValNumCatalogo");
			var VNumPromo = sap.ui.getCore().getModel("vValNumPromo");
			var vSelectPromoCyP = sap.ui.getCore().getModel("vGlobalPromoCyP");

			// asigna valores al modelo 
			oentrada.Idcatalogo = vNumCatalogo;
			oentrada.Idpromo = VNumPromo;
			oentrada.Tipopromoc = vSelectPromoCyP.Tipopromoc;
			oentrada.Sku = vthis.getView().byId("InSku").getValue();
			oentrada.Descrip = vthis.getView().byId("InDescrip").getValue();
			oentrada.Precio = vthis.getView().byId("InPrecio").getValue();
			oentrada.Precioantes = vthis.getView().byId("InPrecioantes").getValue();
			oentrada.Precioref = vthis.getView().byId("InPrecioref").getValue();
			oentrada.Porcdcto = vthis.getView().byId("InPorcdcto").getValue();
			oentrada.Cantx = vthis.getView().byId("InCantx").getValue();
			oentrada.Cantcuot = vthis.getView().byId("InCantcuot").getValue();
			oentrada.Valorcuota = vthis.getView().byId("InValorcuota").getValue();
			oentrada.Ccae = vthis.getView().byId("InCcae").getValue();
			oentrada.Cctc = vthis.getView().byId("InCctc").getValue();
			oentrada.Condi = vthis.getView().byId("InCond").getValue();

			oentrada.Complemento = vthis.getView().byId("InComple").getValue();
			oentrada.Preciomas = vthis.getView().byId("InPrecioMas").getValue();
			oentrada.Canty = vthis.getView().byId("InCanty").getValue();
			oentrada.Puntos = vthis.getView().byId("InPuntos").getValue();
			oentrada.Excepcion = vthis.getView().byId("InExcepcion").getValue();

			// Función de éxito
			function fSuccess(oEvent) {

				sap.m.MessageToast.show("Registro Guardado");
				vpanel4.setBusy(false);
				vthis.LimpiaCampos();
				// vuelve a la pantalla Inicial
				//vthis.getOwnerComponent().getTargets().display("CatalogoMain");

				// if (vValOrigen === "Cata") {
				// 	vthis.getOwnerComponent().getTargets().display("CatalogoMain");
				// }
				// if (vValOrigen === "Lista") {
				vthis.getOwnerComponent().getTargets().display("ListadoPromoMain");
				// }
			}

			function fError(oEvent) {
				sap.m.MessageToast.show("Error al Guardar Registro ");
				vpanel4.setBusy(false);
			}

			// Consume servicio para grabar catalogo CyP

			modelo.create("/GrabarPromoCyPSet", oentrada, {
				success: fSuccess,
				error: fError

			});

		},

		ValidaEntrada: function (text, val1, mgs, vreturn) {
			//val1 (N=no valida valor numerico, S=si valida valor numerico  )

			if (text.getVisible() === true) {
				if (text.getValue() === "") {
					sap.m.MessageToast.show(mgs);
					vreturn = "X";
				}
				if (val1 === "S") {
					//text.getValue().replace(/[.,]/g, ""); // elimina puntos en los montos 
					if (isNaN(text.getValue().replace(/[.,]/g, ""))) {
						sap.m.MessageToast.show("Ingrese solo Numeros");
						text.setValue("");
						vreturn = "X";
					}

				}
				return vreturn;

			}
		},

		onBack: function () {
			this.LimpiaCampos();
			this.getOwnerComponent().getTargets().display("ZNuevaPromo");
		},

		LimpiaCampos: function () {

			vSku.setValue("");
			vDescrip.setValue("");
			vPrecio.setValue("");
			vPrecioantes.setValue("");
			vPrecioref.setValue("");
			vPorcdcto.setValue("");
			vCantx.setValue("");
			vCantcuot.setValue("");
			vValorcuota.setValue("");
			vCcae.setValue("");
			vCctc.setValue("");
			vCond.setValue("");

			vInComple.setValue("");
			vInPrecioMas.setValue("");
			vInCanty.setValue("");
			vInPuntos.setValue("");
			vInExcepcion.setValue("");
			// vFvd.setValue("");
			// vFvh.setValue("");
		},
		onFormat: function (input) {

			var num = input.getSource().getValue();
			num = this.onFormatoPrecio(num);
			input.getSource().setValue(num);

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
		onEnterTir: function (oEvent) {
			//Realiza el calculo de la Tir

			//obtiene el precio
			var vPrecio = this.getView().byId("InPrecio").getValue();
			if (vPrecio !== "") {
				var vpanel4 = this.byId("panel4");
				vpanel4.setBusy(true);

				vPrecio = vPrecio.replace(/[.,]/g, "");
				var vEntrada = "/CalculadoraTirSet(Monto='" + vPrecio +
					"',Pfecha='" + VfechaDesde + "')";

				// Función de error
				function fSuccess(Event) {

					if (Event.Pmensaje1 === "0") {

						vCantcuot.setValue(Event.Cuotas.trim());
						vValorcuota.setValue(Event.Valorcuo.trim());
						vCcae.setValue(Event.Valorcae.trim());
						vCctc.setValue(Event.Costotot.trim());
						vpanel4.setBusy(false);
					} else {

						sap.m.MessageToast.show(Event.Pmensaje2);
						vCantcuot.setValue("0");
						vValorcuota.setValue("0");
						vCcae.setValue("0");
						vCctc.setValue("0");

						vpanel4.setBusy(false);
					}

				}

				// Función de error
				function fError(Event) {

					sap.m.MessageToast.show("Error al Calcular Tir");
					vCantcuot.setValue("0");
					vValorcuota.setValue("0");
					vCcae.setValue("0");
					vCctc.setValue("0");
					vpanel4.setBusy(false);

				}

				modelo.read(vEntrada, {
					success: fSuccess,
					error: fError

				});

			}

		}

	});

});