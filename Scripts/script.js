Dynamsoft.DWT.AutoLoad = false;
Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

var DWObject, extrFieldsCount = 0,
    CurrentPathName = unescape(location.pathname),
    CurrentPath = CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1),
    strHTTPServer = location.hostname,
    Barcode_text, driverLicenseFields = [];

    var BarcodeInfo =
		[
			{ desc: "All", val: -32505857, bf:1 },
			{ desc: "1D Barcodes", val: 2047, bf:1  },
			{ desc: "QR Code", val: 67108864, bf:1  },
			{ desc: "PDF417", val: 33554432, bf:1  },
			{ desc: "DATAMATRIX", val: 134217728 , bf:1 },
			{ desc: "Aztec Code", val: 268435456, bf:1  },
			{ desc: "GS1 Databar", val: 260096, bf:1  },
			{ desc: "Maxicode", val: 536870912, bf:1  },
			{ desc: "Patch Code", val: 262144, bf:1  },
			{ desc: "GS1 COMPOSITE", val: -2147483648, bf:1 },
			{ desc: "Postal Code", val: 32505856, bf:2 },
			{ desc: "DotCode", val: 2, bf:2 },
			{ desc: "CODE_39", val: 1, bf:1 },
			{ desc: "CODE_128", val: 2, bf:1  },
			{ desc: "CODE_93", val: 4, bf:1  },
			{ desc: "CODABAR", val: 8, bf:1  },
			{ desc: "EAN_13", val: 32, bf:1  },
			{ desc: "EAN_8", val: 64, bf:1  },
			{ desc: "UPC_A", val: 128, bf:1  },
			{ desc: "UPC_E", val: 256, bf:1  },
			{ desc: "Interleaved 2 of 5", val: 16, bf:1  },
			{ desc: "Industrial 2 of 5", val: 512, bf:1  },
			{ desc: "CODE 39 EXTENDED", val: 1024, bf:1  }
		],
    driverLicenseFields = [
        { 'abbreviation': 'DAA', 'description': 'Full Name' },
        { 'abbreviation': 'DAB', 'description': 'Last Name' },
        { 'abbreviation': 'DAB', 'description': 'Family Name' },
        { 'abbreviation': 'DAC', 'description': 'First Name' },
        { 'abbreviation': 'DAC', 'description': 'Given Name' },
        { 'abbreviation': 'DAD', 'description': 'Middle Name or Initial' },
        { 'abbreviation': 'DAD', 'description': 'Middle Name' },
        { 'abbreviation': 'DAE', 'description': 'Name Suffix' },
        { 'abbreviation': 'DAF', 'description': 'Name Prefix' },
        { 'abbreviation': 'DAG', 'description': 'Mailing Street Address1' },
        { 'abbreviation': 'DAH', 'description': 'Mailing Street Address2' },
        { 'abbreviation': 'DAI', 'description': 'Mailing City' },
        { 'abbreviation': 'DAJ', 'description': 'Mailing Jurisdiction Code' },
        { 'abbreviation': 'DAK', 'description': 'Mailing Postal Code' },
        { 'abbreviation': 'DAL', 'description': 'Residence Street Address1' },
        { 'abbreviation': 'DAM', 'description': 'Residence Street Address2' },
        { 'abbreviation': 'DAN', 'description': 'Residence City' },
        { 'abbreviation': 'DAO', 'description': 'Residence Jurisdiction Code' },
        { 'abbreviation': 'DAP', 'description': 'Residence Postal Code' },
        { 'abbreviation': 'DAQ', 'description': 'License or ID Number' },
        { 'abbreviation': 'DAR', 'description': 'License Classification Code' },
        { 'abbreviation': 'DAS', 'description': 'License Restriction Code' },
        { 'abbreviation': 'DAT', 'description': 'License Endorsements Code' },
        { 'abbreviation': 'DAU', 'description': 'Height in FT_IN' },
        { 'abbreviation': 'DAV', 'description': 'Height in CM' },
        { 'abbreviation': 'DAW', 'description': 'Weight in LBS' },
        { 'abbreviation': 'DAX', 'description': 'Weight in KG' },
        { 'abbreviation': 'DAY', 'description': 'Eye Color' },
        { 'abbreviation': 'DAZ', 'description': 'Hair Color' },
        { 'abbreviation': 'DBA', 'description': 'License Expiration Date' },
        { 'abbreviation': 'DBB', 'description': 'Date of Birth' },
        { 'abbreviation': 'DBC', 'description': 'Sex' },
        { 'abbreviation': 'DBD', 'description': 'License or ID Document Issue Date' },
        { 'abbreviation': 'DBE', 'description': 'Issue Timestamp' },
        { 'abbreviation': 'DBF', 'description': 'Number of Duplicates' },
        { 'abbreviation': 'DBG', 'description': 'Medical Indicator Codes' },
        { 'abbreviation': 'DBH', 'description': 'Organ Donor' },
        { 'abbreviation': 'DBI', 'description': 'Non-Resident Indicator' },
        { 'abbreviation': 'DBJ', 'description': 'Unique Customer Identifier' },
        { 'abbreviation': 'DBK', 'description': 'Social Security Number' },
        { 'abbreviation': 'DBL', 'description': 'Date Of Birth' },
        { 'abbreviation': 'DBM', 'description': 'Social Security Number' },
        { 'abbreviation': 'DBN', 'description': 'Full Name' },
        { 'abbreviation': 'DBO', 'description': 'Last Name' },
        { 'abbreviation': 'DBO', 'description': 'Family Name' },
        { 'abbreviation': 'DBP', 'description': 'First Name' },
        { 'abbreviation': 'DBP', 'description': 'Given Name' },
        { 'abbreviation': 'DBQ', 'description': 'Middle Name' },
        { 'abbreviation': 'DBQ', 'description': 'Middle Name or Initial' },
        { 'abbreviation': 'DBR', 'description': 'Suffix' },
        { 'abbreviation': 'DBS', 'description': 'Prefix' },
        { 'abbreviation': 'DCA', 'description': 'Virginia Specific Class' },
        { 'abbreviation': 'DCB', 'description': 'Virginia Specific Restrictions' },
        { 'abbreviation': 'DCD', 'description': 'Virginia Specific Endorsements' },
        { 'abbreviation': 'DCE', 'description': 'Physical Description Weight Range' },
        { 'abbreviation': 'DCF', 'description': 'Document Discriminator' },
        { 'abbreviation': 'DCG', 'description': 'Country territory of issuance' },
        { 'abbreviation': 'DCH', 'description': 'Federal Commercial Vehicle Codes' },
        { 'abbreviation': 'DCI', 'description': 'Place of birth' },
        { 'abbreviation': 'DCJ', 'description': 'Audit information' },
        { 'abbreviation': 'DCK', 'description': 'Inventory Control Number' },
        { 'abbreviation': 'DCL', 'description': 'Race Ethnicity' },
        { 'abbreviation': 'DCM', 'description': 'Standard vehicle classification' },
        { 'abbreviation': 'DCN', 'description': 'Standard endorsement code' },
        { 'abbreviation': 'DCO', 'description': 'Standard restriction code' },
        { 'abbreviation': 'DCP', 'description': 'Jurisdiction specific vehicle classification description' },
        { 'abbreviation': 'DCQ', 'description': 'Jurisdiction-specific' },
        { 'abbreviation': 'DCR', 'description': 'Jurisdiction specific restriction code description' },
        { 'abbreviation': 'DCS', 'description': 'Family Name' },
        { 'abbreviation': 'DCS', 'description': 'Last Name' },
        { 'abbreviation': 'DCT', 'description': 'Given Name' },
        { 'abbreviation': 'DCT', 'description': 'First Name' },
        { 'abbreviation': 'DCU', 'description': 'Suffix' },
        { 'abbreviation': 'DDA', 'description': 'Compliance Type' },
        { 'abbreviation': 'DDB', 'description': 'Card Revision Date' },
        { 'abbreviation': 'DDC', 'description': 'HazMat Endorsement Expiry Date' },
        { 'abbreviation': 'DDD', 'description': 'Limited Duration Document Indicator' },
        { 'abbreviation': 'DDE', 'description': 'Family Name Truncation' },
        { 'abbreviation': 'DDF', 'description': 'First Names Truncation' },
        { 'abbreviation': 'DDG', 'description': 'Middle Names Truncation' },
        { 'abbreviation': 'DDH', 'description': 'Under 18 Until' },
        { 'abbreviation': 'DDI', 'description': 'Under 19 Until' },
        { 'abbreviation': 'DDJ', 'description': 'Under 21 Until' },
        { 'abbreviation': 'DDK', 'description': 'Organ Donor Indicator' },
        { 'abbreviation': 'DDL', 'description': 'Veteran Indicator' },
        { 'abbreviation': 'PAA', 'description': 'Permit Classification Code' },
        { 'abbreviation': 'PAB', 'description': 'Permit Expiration Date' },
        { 'abbreviation': 'PAC', 'description': 'Permit Identifier' },
        { 'abbreviation': 'PAD', 'description': 'Permit IssueDate' },
        { 'abbreviation': 'PAE', 'description': 'Permit Restriction Code' },
        { 'abbreviation': 'PAF', 'description': 'Permit Endorsement Code' },
        { 'abbreviation': 'ZVA', 'description': 'Court Restriction Code' }
    ];

window.onload = function () {
    if (Dynamsoft && (!Dynamsoft.Lib.env.bWin)) {
        var ObjString = [];
        ObjString.push('<div class="p15">');
        ObjString.push("Please note your OS is not supported.");
        ObjString.push('</div>');
        Dynamsoft.DWT.ShowDialog(400, 180, ObjString.join(''));
        if (document.getElementsByClassName("dynamsoft-dialog-close"))
            document.getElementsByClassName("dynamsoft-dialog-close")[0].style.display = "none";
    } else {
        Dynamsoft.DWT.Load();
    }
};

function Dynamsoft_OnReady() {
    DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
    if (DWObject) {
        DWObject.Viewer.width = 505;
        DWObject.Viewer.height = 600;
        DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
        var _strPort = location.port == "" ? 80 : location.port;
        if (Dynamsoft.Lib.detect.ssl == true)
            _strPort = location.port == "" ? 443 : location.port;
        DWObject.HTTPPort = _strPort;
        DWObject.HTTPDownload(strHTTPServer, CurrentPath + "SampleDriverImage.jpg", function () {},
            function () {
                console.log('failed to download the sample image!');
            }
        );
        if (DWObject.Addon.PDF.IsModuleInstalled()) {
            /** PDFR already installed */
        }
		
		document.getElementById("btnReadBarcode").style.visibility = "visible";
        document.getElementById("DWTcontainerBtm").style.visibility = "visible";
    }
}

function GetField(keyword) {
    var k = Barcode_text.search("\n" + keyword);
    if (k == -1)
        return false;
    var m = Barcode_text.indexOf("\n", k + 1);
    var subtext = Barcode_text.substring(k + 4, m);
    return subtext;
}

function extractInformation() {
    var aryTextToShow = [];
    for (var i = 0; i < driverLicenseFields.length; i++) {
        var __item = driverLicenseFields[i];
        var _fieldValue = GetField(__item.abbreviation);
        if (_fieldValue != false) {
            aryTextToShow.push(__item.description + "<br /><strong>" + _fieldValue + "</strong><br />");
            aryTextToShow.push("------------------------------<br />");
        }
    }
    aryTextToShow.splice(0, 0, '<p style="padding:5px; margin:0;">');
    aryTextToShow.push('</p>');
    document.getElementById('divNoteMessage').innerHTML = aryTextToShow.join('');
}

function ReadBarcode() {
    if (DWObject) {
        if (DWObject.HowManyImagesInBuffer == 0) {
            alert("Please scan or load an image first.");
            return;
        } else {
			var index = DWObject.CurrentImageIndexInBuffer;
            DWObject.Addon.BarcodeReader.getRuntimeSettings().then(function(settings){
                if (DWObject.GetImageBitDepth(index) == 1)
                    settings.scaleDownThreshold = 214748347;
                else
                    settings.scaleDownThreshold = 2300;
                settings.barcodeFormatIds = BarcodeInfo[3].val; //PDF417
				
                DWObject.Addon.BarcodeReader.updateRuntimeSettings(settings).then(function(){

					DWObject.Addon.BarcodeReader.decode(index).then(function (results) { //This is the function called when barcode is read successfully
						//Retrieve barcode details
						if (results.length == 0) {
							alert("The barcode for the selected format is not found.");
							return;
						} else {
							for (var i = 0; i < results.length; i++) {
								var result = results[i];
								Barcode_text = result.barcodeText;
								var format = result.barcodeFormatString;
									if(result.barcodeFormat == 0)
										format = result.barcodeFormatString_2;
								var barcodeText = ("barcode[" + (i + 1) + "]: " + "\n" + Barcode_text + "\n");
								extractInformation();
							}
						}
					}, function (ex) {
						console.log(ex.message || ex);
					});
				});
			});
        }
    }
}

function AcquireImage() {
    if (DWObject) {
        DWObject.SelectSource(function () {
            var OnAcquireImageSuccess, OnAcquireImageFailure;
            OnAcquireImageSuccess = OnAcquireImageFailure = function () {
                DWObject.CloseSource();
            };
            DWObject.OpenSource();
            DWObject.IfDisableSourceAfterAcquire = true;
            DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);
        }, function () {
            console.log('SelectSource failed!');
        });
    }
}

function LoadImages() {
    if (DWObject) {
        if (DWObject.Addon && DWObject.Addon.PDF) {
            DWObject.Addon.PDF.SetResolution(300);
            DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
        }
        DWObject.LoadImageEx('', 5,
            function () {},
            function (errorCode, errorString) {
                alert('Load Image:' + errorString);
            }
        );
    }
}