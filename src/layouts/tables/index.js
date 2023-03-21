import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import MDTypography from "components/MDTypography";

// Amazon Sales ReportReact example components
import Footer from "../../examples/Footer";
import axios from "axios";
import DataTable from "../../examples/Tables/DataTable";
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'
import html2canvas from 'html2canvas';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Dna, InfinitySpin } from 'react-loader-spinner'
function Tables() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, onChange] = useState();
  const [value2, onChange2] = useState();
  const [report, setReportData] = useState([])
  const [tags, setTags] = useState([]);
  const [order, setOrderData] = useState([])
  const [shipment, setShipmentData] = useState([])
  const [products, setProductsData] = useState([])
  const [loader, setLoader] = useState(false)
  const [reportLoader, setReportLoader] = useState(false)
  console.log("value", value)
  console.log("value2", value2)
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');

  const Columns = [
    { Header: "Orders", accessor: "Orders", width: "35%", align: "left" },
    { Header: "Sales", accessor: "Sales", align: "left" },
    { Header: "Cost", accessor: "Cost", align: "left" },
    { Header: "Profit", accessor: "Profit", align: "left" },
  ]


  var Row = []



  const Columns2 = [
    { Header: "Order No", accessor: "Order No", width: "35%", align: "left" },
    { Header: "Price", accessor: "Price", align: "left" },
    { Header: "Date", accessor: "Date", align: "left" },
    { Header: "Tax Amount", accessor: "Tax Amount", align: "left" },
    { Header: "Amazon Fees", accessor: "Amazon Fees", align: "left" },
  ]

  const Rows = order

  const shipmentColumns = [
    { Header: "Order No", accessor: "Order No", width: "35%", align: "left" },
    { Header: "Cost", accessor: "Cost", align: "left" },
    { Header: "Date", accessor: "Date", align: "left" },
  ]

  const shpmentRows = shipment

  const productColumns = [
    { Header: "Items", accessor: "Items", width: "35%", align: "left" },
    { Header: "Price", accessor: "Price", align: "left" },
    { Header: "Quantity", accessor: "Quantity", align: "left" },
    { Header: "Total", accessor: "Total", align: "left" },
    { Header: "Vendor", accessor: "Vendor", align: "left" },
  ]

  const productRows = products

  const geReport = () => {
    setLoader(true)
    closeLoaderIn5Seconds()
    axios.post('https://insight.roheex.com/getReport', { startDate: value + 'T' + '00:00', endDate: value2 + 'T' + '23:59' }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => setReportData(res.data)).catch((error) => console.log("error", error))


    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;

    const headers = {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`
    };

    axios.get(`https://ssapi.shipstation.com/orders?storeId=683661&orderDateStart=${value + 'T' + '00:00'}&orderDateEnd=${value2 + 'T' + '23:59'}`, { headers })
      .then(async response => {
        let orderData = await response.data.orders.map((x) => {
          const dateTime = new Date(x.orderDate);
          const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          };

          const formatter = new Intl.DateTimeFormat('en-US', options);
          const readableDateTime = formatter.format(dateTime);
          return {
            "Order No": x.orderNumber,
            Price: `${'$' + x.amountPaid}`,
            Date: readableDateTime,
            "Tax Amount": `${'$' + x.taxAmount}`,
            "Amazon Fees": `${'$' + ((x.amountPaid - x.taxAmount) - ((x.amountPaid - x.taxAmount) * 0.83)).toString().match(re)[0]}`
          }
        })

        setOrderData(orderData)
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`https://ssapi.shipstation.com/shipments?storeId=683661&createDateStart=${value + 'T' + '00:00'}&createDateEnd=${value2 + 'T' + '23:59'}`, { headers })
      .then(async response => {
        console.log("shipments", response.data.shipments)
        let shipmentData = await response.data.shipments.map((x) => {
          const dateTime = new Date(x.createDate);
          const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          };

          const formatter = new Intl.DateTimeFormat('en-US', options);
          const readableDateTime = formatter.format(dateTime);
          return {
            "Order No": x.orderNumber,
            "Cost": x.shipmentCost,
            "Date": readableDateTime
          }
        })

        setShipmentData(shipmentData)
      })
      .catch(error => {
        console.error(error);
      });

    axios.post('https://insight.roheex.com/getProducts', { startDate: value + 'T' + '00:00', endDate: value2 + 'T' + '00:00' }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(async res => {
      let productData = await res.data[0].map((x) => {
        return {
          "Items": x.Items,
          "Price": x.Price,
          "Quantity": x.Quantity,
          "Total": (x.Quantity * x.Price).toString().match(re)[0],
          "Vendor": x.Vendor
        }
      })

      setProductsData(productData)
    })
  }

  const closeLoaderIn5Seconds = () => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  };


  if (Array.isArray(report) && report.length > 0) {
    var sanmarcost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Sanmar Ship Cost']); }, 0);
    var alphacost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Alpha Ship Cost']); }, 0);
    var result = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Total Orders']); }, 0);
    var totalSales = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Sales']); }, 0);
    var cost = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Cost']); }, 0);
    var profit = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Profit']); }, 0);
    Row = [{
      "Orders": result,
      "Sales": '$' + parseFloat(totalSales.toString().match(re)[0]).toLocaleString(),
      "Cost": '$' + parseFloat(cost.toString().match(re)[0]).toLocaleString(),
      "Profit": '$' + parseFloat(profit.toString().match(re)[0]).toLocaleString()
    }];
  }

  const sendReport = async () => {
    setReportLoader(true)
    console.log("tags", tags)
    console.log("working")
    const table = `<div class="image-container" style="height:100%; max-width: 1200px;
    margin: 0 auto;  background-color: lightgray;"><h1 class="report-date hide-text" style="background-color: lightgray;
    border: 1px solid grey;
    margin-bottom: -3px !important;
    margin-top: 0 !important;
    border-bottom: 0px !important;
    padding-bottom: 10px;
    padding-top: 10px;
    text-align:center;
    font-family: 'Poppins', sans-serif;
    font-weight:bold;
    font-size:24px;"><span class="fr"> Amazon </span> <span class="fr"> sales </span> <span class="fr"> report </span> <span class="fr"> from </span> <span class="fr">${value}</span> to <span class="to">${value2}</span>
    </h1>
    <table id="customers" style="height:100%; border-collapse: collapse;
      width: 100%;">
        <tr>
            <th style="font-family: 'Poppins', sans-serif; font-weight:bold; padding-top: 15px !important;
            padding-bottom: 15px !important;
            text-align: left;
            background-color: #4779c4;
            color: white;
            font-size: 24px;border: 1px solid #ddd;
            padding: 8px;">NO. OF ORDERS</th>
            <th style="font-family: 'Poppins', sans-serif; font-weight:bold; padding-top: 15px !important;
            padding-bottom: 15px !important;
            text-align: left;
            background-color: #4779c4;
            color: white;
            font-size: 24px;border: 1px solid #ddd;
            padding: 8px;">SALES</th>
            <th style="font-family: 'Poppins', sans-serif; font-weight:bold; padding-top: 15px !important;
            padding-bottom: 15px !important;
            text-align: left;
            background-color: #4779c4;
            color: white;
            font-size: 24px;border: 1px solid #ddd;
            padding: 8px;">COST</th>
            <th style="font-family: 'Poppins', sans-serif; font-weight:bold; padding-top: 15px !important;
            padding-bottom: 15px !important;
            text-align: left;
            background-color: #4779c4;
            color: white;
            font-size: 24px; border: 1px solid #ddd;
            padding: 8px;">GROSS PROFIT</th>
        </tr>

        <tr>
        <td style="font-family: 'Poppins', sans-serif; border-bottom:0 !important; background-color: #fff; padding-top: 15px !important;
        padding-bottom: 15px !important;
        font-size: 24px; border: 1px solid #ddd;
        padding: 8px;" id="order">${result}</td>
        <td style="font-family: 'Poppins', sans-serif; border-bottom:0 !important; background-color: #fff; padding-top: 15px !important;
        padding-bottom: 15px !important;
        font-size: 24px; border: 1px solid #ddd;
        padding: 8px;" id="sales">$${parseFloat(totalSales.toString().match(re)[0]).toLocaleString()}</td>
        <td style="font-family: 'Poppins', sans-serif; border-bottom:0 !important; background-color: #fff; padding-top: 15px !important;
        padding-bottom: 15px !important;
        font-size: 24px; border: 1px solid #ddd;
        padding: 8px;" id="cost">$${parseFloat(cost.toString().match(re)[0]).toLocaleString()}</td>
        <td style="font-family: 'Poppins', sans-serif; border-bottom:0 !important; background-color: #fff; padding-top: 15px !important;
        padding-bottom: 15px !important;
        font-size: 24px; border: 1px solid #ddd;
        padding: 8px;" id="gross">$${parseFloat(profit.toString().match(re)[0]).toLocaleString()}</td>
        </tr>
    </table></div>`;

    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframeWindow.document;

    iframe.style.width = '800px'
    iframe.style.border = 'none'
    iframeDocument.open();

    iframeDocument.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0px;
          }
        </style>
      </head>
      <body>
        ${table}
      </body>
    </html>
  `);
    iframeDocument.body.style.margin = '0';
    iframeDocument.close();

    console.log("", iframeDocument)

    html2canvas(iframeDocument.body).then(async function (canvas) {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();
      console.log("data", dataURL)

      await makeFetchRequests(dataURL, tags, iframe)
    }).catch((error) => console.log("error", error));

  }


  async function makeFetchRequests(image, numbers, iframe) {
    const response = await fetch('https://insight.roheex.com/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`

      },
      body: JSON.stringify({ "image": image, "filename": "report.png", "numbers": numbers })
    });

    if (response.status === 200) {
      alert("message sent")
      console.log("here")
      setReportLoader(false)
      setOpen(false)
      iframe.style.display = 'none';
    }
    else {
      setOpen(false)
      setReportLoader(false)
      alert("error sending message")
    }
  }

  const handleTags = (tags) => {
    setTags(tags);
  };

  const validate = (tag) => {
    return /^\d+$/.test(tag);
  };

  const shipmentCostColumn = [
    { Header: "Vendor", accessor: "Vendor", width: "35%", align: "left" },
    { Header: "Cost", accessor: "Cost", align: "left" },
  ]

  const shipmentCostRow = [
    {
      "Vendor": "Sanmar",
      "Cost": '$' + (sanmarcost !== undefined ? sanmarcost : "0"),
    },
    {
      "Vendor": "Alpha",
      "Cost": '$' + (alphacost !== undefined ? alphacost : "0"),
    },
  ]

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>

          <Grid item xs={12}>


            <Card className='custom-card-style'>
              <div className='flex'>

                <MDTypography variant="h5" color="white">
                  From:
                </MDTypography>
                {/* <Calendar onChange={onChange} value={value} /> */}
                <input type="date" onChange={(e) => onChange(e.target.value)} value={value} />
              </div>

              <div className='flex'>
                <MDTypography variant="h5" color="white">
                  To:
                </MDTypography>
                {/* <Calendar onChange={onChange2} value={value2} /> */}
                <input type="date" onChange={(e) => onChange2(e.target.value)} value={value2} />
              </div>

              <div>
                <button className='custom-btn' onClick={() => geReport()}><MDTypography variant="h6" color="white">
                  Get Report
                </MDTypography></button>
              </div>

              <div>
                <button className='custom-btn' onClick={() => handleOpen()}><MDTypography variant="h6" color="white">
                  Send Report
                </MDTypography></button>
              </div>
            </Card>
          </Grid>
        </Grid>

        {loader ? <div className="modal-cont"><Dna
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        /> </div>: <>
          {Array.isArray(Row) && Row.length > 0 ?
            <Grid item xs={12} md={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Report
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: Columns, rows: Row }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid> : null}



          {Array.isArray(Rows) && Rows.length > 0 ? <Grid item xs={12} md={12} mt={7}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Shipstation Order Data
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable

                  table={{ columns: Columns2, rows: Rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> : null}

          {Array.isArray(shpmentRows) && shpmentRows.length > 0 ? <Grid item xs={12} md={12} mt={7}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Shipstation Shipment Data
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable

                  table={{ columns: shipmentColumns, rows: shpmentRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> : null}

          {Array.isArray(productRows) && productRows.length > 0 ? <Grid item xs={12} md={12} mt={7}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Products Data
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable

                  table={{ columns: productColumns, rows: productRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> : null}




          {sanmarcost || alphacost ?
            <Grid item xs={12} md={12} mt={5}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Shipment Cost
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: shipmentCostColumn, rows: shipmentCostRow }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid> : null}</>}
      </MDBox>
      {/* <Footer /> */}

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}   className="modal-cont">
            <MDTypography variant="h5" color="black">
              Add numbers to send report
            </MDTypography>

            <MDTypography variant="p" className="custom-p" color="black">
              Note : Press enter after every number
            </MDTypography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} className="modal-cont">
              <TagsInput value={tags} onChange={handleTags} inputProps={{ placeholder: 'Add number' }} validate={validate} />
              <button className='custom-btn custom-btn-send' onClick={() => sendReport()}><MDTypography variant="h6" color="white">
                {reportLoader ? <Dna
                  visible={true}
                  height="26"
                  width="36"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                /> : "Send"}
              </MDTypography></button>
            </Typography>
          </Box>
        </Modal>
      </div>


    </DashboardLayout>
  );
}

export default Tables;
