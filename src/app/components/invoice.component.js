import nem from "nem-sdk";

class InvoiceCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet, $scope, QR) {
        'ngInject';

        // Initialize when component is ready
        this.$onInit = () => {

            //// Component dependencies region ////

            this._Wallet = Wallet;
            this._QR = QR;

            //// End dependencies region ////

            //// Component properties region ///

            // Invoice model for QR
            this.invoiceData = {
                "v": this._Wallet.network === nem.model.network.data.testnet.id ? 1 : 2,
                "type": 2,
                "data": {
                    "addr": "",
                    "amount": 0,
                    "msg": "",
                    "name": "NEM Wallet XEM invoice"
                }
            };

            //// End properties region ////

            // Watch selected market
            $scope.$watch(() => this.formData, (val) => {
                if (!val) return;
                this.updateInvoiceQR();
            }, true);
        }

    }

    //// Component methods region ////

    /**
     * Create the QR according to invoice data
     */
    updateInvoiceQR() {
        if (this.formData.type === nem.model.transactionTypes.multisigTransaction) return;
        // Clean input address
        this.invoiceData.data.addr = this.formData.recipient.toUpperCase().replace(/-/g, '');
        // Convert user input to micro XEM
        this.invoiceData.data.amount = this.formData.amount;
        this.invoiceData.data.msg = nem.utils.format.hexMessage(this.formData.message);
        this.invoiceString = JSON.stringify(this.invoiceData);
        // Generate the QR
        this._QR.generateQR(this.invoiceString, 256, $('#invoiceQR'));
    }


    //// End methods region ////

}

// Invoice config
let Invoice = {
    controller: InvoiceCtrl,
    templateUrl: 'layout/partials/invoice.html',
    bindings: {
        formData: '=formData'
    }
};

export default Invoice;