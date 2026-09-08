window.CuentaBancoTemplates = {

    crearTablaCuentas: async function(data) {
            if (this.tablaCuentas) {
                try { await this.tablaCuentas.destroy(); } catch (e) {}
                this.tablaCuentas = null;
            }
            this.tablaCuentas = new Tabulator("#cuentas", {
                index: "id",
                data: data,
                columnDefaults: {headerSort:false},
                layout: "fitColumns",
                columns: [
                    { title: "CUENTAS PROPIAS", field: "nombre", widthGrow: 100}
                ]
            });

            return this.tablaCuentas;
    },

    crearTablaBancos: async function(data) {
            if (this.tablaBancos) {
                try { await this.tablaBancos.destroy(); } catch (e) {}
                this.tablaBancos = null;
            }
            this.tablaBancos = new Tabulator("#bancos", {
                index: "id",
                data: data,
                columnDefaults: {headerSort:false},
                layout: "fitColumns",
                columns: [
                    { title: "CUENTAS DE TERCEROS", field: "nombre", widthGrow: 100}
                ]
            });

            return this.tablaBancos;
    }
}