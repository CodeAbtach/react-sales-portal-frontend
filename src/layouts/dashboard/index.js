

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
// Amazon Sales ReportReact components
import MDBox from "components/MDBox";

// Amazon Sales ReportReact example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Modal from '@mui/material/Modal';
// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DataTable from "examples/Tables/DataTable";
import { Dna } from 'react-loader-spinner'
import Typography from '@mui/material/Typography';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import html2canvas from 'html2canvas';
import MDSnackbar from "components/MDSnackbar";

function Dashboard() {
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
  const [report, setReportData] = useState()
  const [time, setDate] = useState(1);
  const [order, setOrderData] = useState([])
  const [shipment, setShipmentData] = useState([])
  const [products, setProductsData] = useState([])
  const [loader, setLoader] = useState(false)
  const [snackbar, setSnackbar] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, onChange] = useState();
  const [value2, onChange2] = useState();
  const [tags, setTags] = useState([]);
  const [reportLoader, setReportLoader] = useState(false)

  const closeSuccessSB = () => setSnackbar(false)

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Message"
      content="Message Sent Successfully"
      open={snackbar}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );



  const date = new Date();
  const day = ("0" + (date.getDate() - 2)).slice(-2);
  const week = ("0" + (date.getDate() - 8)).slice(-2);
  const starting = '01'
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  var startDate = time === 1 ? year + '-' + month + '-' + day + 'T' + '00:00' : time === 2 ? year + '-' + month + '-' + week + 'T' + '00:00' : year + '-' + month + '-' + starting + 'T' + '00:00'
  var endDate = time === 1 ? year + '-' + month + '-' + day + 'T' + '23:59' : time === 2 ? year + '-' + month + '-' + day + 'T' + '23:59' : year + '-' + month + '-' + day + 'T' + '23:59'


  const geReport = () => {
    setLoader(true)
    axios.post('https://insight.roheex.com/getReport', { startDate: value + 'T' + '00:00', endDate: value2 + 'T' + '23:59' }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
      }
    }).then((res) => {
      setReportData(res.data)
      setLoader(false)
    }).catch((error) => {
      console.log("error", error)
      setLoader(false);
    })


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
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
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


  const sendReport = async () => {
    setReportLoader(true)
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
    font-size:24px;"><span class="fr"> Amazon </span> <span class="fr"> sales </span> <span class="fr"> report </span> <span class="fr"> from </span> <span class="fr">${value === undefined ? startDate.split("T")[0] : value}</span> to <span class="to">${value2 === undefined ? endDate.split("T")[0] : value2}</span>
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



    html2canvas(iframeDocument.body).then(async function (canvas) {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();


      await makeFetchRequests(dataURL, tags, iframe)
    }).catch((error) => console.log("error", error));

  }


  async function makeFetchRequests(image, numbers, iframe) {
    const response = await fetch('https://insight.roheex.com/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('Token')}`

      },
      body: JSON.stringify({ "image": image, "filename": "report.png", "numbers": numbers })
    });

    if (response.status === 200) {
      setSnackbar(true)
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

  const Columns = [
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



  const handleChange = (event) => {
    setLoader(true)
    setDate(event.target.value);
    closeLoaderIn5Seconds()
  };

  const closeLoaderIn5Seconds = () => {
    setTimeout(() => {
      setLoader(false);
    }, 1800);
  };
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
  useEffect(() => {
    axios.post('https://insight.roheex.com/getReport', { startDate: startDate, endDate: endDate }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
      }
    }).then((res) => setReportData(res.data)).catch((error) => console.log("error", error))

    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;

    const headers = {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`
    };

    axios.get(`https://ssapi.shipstation.com/orders?storeId=683661&orderDateStart=${startDate}&orderDateEnd=${endDate}`, { headers })
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


    axios.get(`https://ssapi.shipstation.com/shipments?storeId=683661&createDateStart=${startDate}&createDateEnd=${endDate}`, { headers })
      .then(async response => {

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


    axios.post('https://insight.roheex.com/getProducts', { startDate: startDate, endDate: endDate }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
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
  }, [time])

  const { sales, tasks } = reportsLineChartData;

  if (Array.isArray(report) && report.length > 0) {
    var sanmarcost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Sanmar Ship Cost']); }, 0);
    var alphacost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Alpha Ship Cost']); }, 0);
    var result = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Total Orders']); }, 0);
    var totalSales = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Sales']); }, 0);
    var cost = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Cost']); }, 0);
    var profit = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Profit']); }, 0);
  }

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

      <Grid container spacing={6}>

        <Grid item xs={12}>
            <div>
              <FormControl fullWidth style={{ marginLeft: '10px', marginTop: '20px', marginBottom: '20px' }}>
                <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={time}
                  label="Select Time"
                  onChange={handleChange}
                  style={{ width: '150px', height: '45px' }}

                >
                  <MenuItem value={1}>Today</MenuItem>
                  <MenuItem value={2}>Week</MenuItem>
                  <MenuItem value={3}>Month</MenuItem>
                </Select>
              </FormControl>
            </div>
          <Card className='custom-card-style'>
            <div className="flex">
            <div className="flex">
              <div className='flex margin-right'>

                <MDTypography variant="h5" >
                  From:
                </MDTypography>
                {/* <Calendar onChange={onChange} value={value} /> */}
                <input type="date" onChange={(e) => onChange(e.target.value)} value={value} />
              </div>
            
            <div className='flex margin-right'>
              <MDTypography variant="h5" >
                To:
              </MDTypography>
              {/* <Calendar onChange={onChange2} value={value2} /> */}
              <input type="date" onChange={(e) => onChange2(e.target.value)} value={value2} />
            </div>
            </div>
            <div className="flex">
              <div>
                <button className='custom-btn' onClick={() => geReport()}><MDTypography variant="h6" color="white">
                  Get Report
                </MDTypography></button>
              </div>

              <div>
                <button className='custom-btn no-margin' onClick={() => handleOpen()}><MDTypography variant="h6" color="white">
                  Send Report
                </MDTypography></button>
              </div>
            </div>
            </div>
          </Card>
        </Grid>
      </Grid>

      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="shopping_basket"
                title="Orders"
                count={loader ? <Dna
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                /> : result}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />

            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="trending_up"
                title="Sales"
                count={loader ? <Dna
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                /> : totalSales ? '$' + parseFloat(totalSales.toString().match(re)[0]).toLocaleString() : "$0"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="trending_down"
                title="Cost"
                count={loader ? <Dna
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                /> : cost ? '$' + parseFloat(cost.toString().match(re)[0]).toLocaleString() : "$0"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="attach_money"
                title="Profit"
                count={loader ? <Dna
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                /> : profit ? '$' + parseFloat(profit.toString().match(re)[0]).toLocaleString() : "$0"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
          </Grid>
        </MDBox>
        {loader ? <div className="modal-cont"><Dna
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        /></div> :
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              {Array.isArray(Rows) && Rows.length > 0 ? <Grid item xs={12} md={12}>
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

                      table={{ columns: Columns, rows: Rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid> : null}

              {Array.isArray(shpmentRows) && shpmentRows.length > 0 ? <Grid item xs={12} md={12}>
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

              {Array.isArray(productRows) && productRows.length > 0 ? <Grid item xs={12} md={12}>
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
              </Grid>
            </Grid>
          </MDBox>}
      </MDBox>
      {/* <Footer /> */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="modal-cont">
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

      {renderSuccessSB}

    </DashboardLayout>
  );
}

export default Dashboard;
