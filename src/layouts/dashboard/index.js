

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
// Amazon Sales ReportReact components
import MDBox from "components/MDBox";

// Amazon Sales ReportReact example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DataTable from "examples/Tables/DataTable";
import { Dna, InfinitySpin } from 'react-loader-spinner'

function Dashboard() {

  const [report, setReportData] = useState()
  const [time, setDate] = useState(1);
  const [order, setOrderData] = useState([])
  const [shipment, setShipmentData] = useState([])
  const [products, setProductsData] = useState([])
  const [loader, setLoader] = useState(false)
  


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
    }, 1500);
  };
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
  useEffect(() => {
    const date = new Date();
    const day = ("0" + (date.getDate() - 2)).slice(-2);
    const week = ("0" + (date.getDate() - 8)).slice(-2);
    const starting = '01'
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    const startDate = time === 1 ? year + '-' + month + '-' + day + 'T' + '00:00' : time === 2 ? year + '-' + month + '-' + week + 'T' + '00:00' : year + '-' + month + '-' + starting + 'T' + '00:00'
    const endDate = time === 1 ? year + '-' + month + '-' + day + 'T' + '23:59' : time === 2 ? year + '-' + month + '-' + day + 'T' + '23:59' : year + '-' + month + '-' + day + 'T' + '23:59'

    axios.post('https://insight.roheex.com/getReport', { startDate: startDate, endDate: endDate }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            "Amazon Fees": `${'$' + (x.amountPaid - (x.amountPaid * 0.83)).toString().match(re)[0]}`
          }
        })

        setOrderData(orderData)
      })
      .catch(error => {
        console.error(error);
      });


    axios.get(`https://ssapi.shipstation.com/shipments?storeId=683661&createDateStart=${startDate}&createDateEnd=${endDate}`, { headers })
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


    axios.post('https://insight.roheex.com/getProducts', { startDate: startDate, endDate: endDate }, {
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
    </DashboardLayout>
  );
}

export default Dashboard;
