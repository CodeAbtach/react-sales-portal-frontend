

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

function Dashboard() {
  
 const Columns = [
  { Header: "author", accessor: "author", width: "45%", align: "left" },
  { Header: "function", accessor: "function", align: "left" },
  { Header: "status", accessor: "status", align: "center" },
  { Header: "employed", accessor: "employed", align: "center" },
  { Header: "action", accessor: "action", align: "center" },
]

const Rows = [
  {
    author: "ASjad" ,
    function: "RIzvi",
    status: "False",
    employed: "yes",
    action: "hell"
  },
  
]
  const [report, setReportData] = useState()
  const [time, setDate] = useState(1);

  const handleChange = (event) => {
    setDate(event.target.value);
  };
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
  useEffect(() => {
    const date = new Date();
    const day = ("0" + (date.getDate() - 1)).slice(-2);
    const week = ("0" + (date.getDate() - 8)).slice(-2);
    const starting = '01'
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    const startDate =time===1 ? year + '-' + month + '-' + day + 'T' + '00:00' : time === 2 ? year + '-' + month + '-' + week + 'T' + '00:00' :year + '-' +  month + '-' + starting + 'T' + '00:00'
    const endDate = time===1 ? year + '-' +  month + '-' + day + 'T' + '23:59' : time === 2 ? year + '-' +  month + '-' + day + 'T' + '23:59' : year + '-' +  month + '-' + day + 'T' + '23:59'

    axios.post('https://insight.roheex.com/getReport', { startDate: startDate, endDate: endDate}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((res) => setReportData(res.data)).catch((error) => console.log("error", error))
  }, [time])
  const { sales, tasks } = reportsLineChartData;

  if(Array.isArray(report) && report.length > 0){
  var sanmarcost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Sanmar Ship Cost']); }, 0);
  var alphacost = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Alpha Ship Cost']); }, 0);
  var result = report[0].reduce(function (acc, obj) { return acc + parseInt(obj['Total Orders']); }, 0);
  var totalSales =  report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Sales']); }, 0);
  var cost = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Cost']); }, 0);
  var profit = report[0].reduce(function (acc, obj) { return acc + parseFloat(obj['Profit']); }, 0);
  }
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl fullWidth style={{marginLeft:'10px', marginTop: '20px', marginBottom:'20px'}}>
        <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={time}
          label="Select Time"
          onChange={handleChange}
          style={{width:'150px', height:'45px'}}
          
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
                count={result}
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
                count={totalSales ? '$' + parseFloat(totalSales.toString().match(re)[0]).toLocaleString() : "$0"}
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
                count={cost ? '$' + parseFloat(cost.toString().match(re)[0]).toLocaleString() : "$0"}
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
                count={profit ? '$' + parseFloat(profit.toString().match(re)[0]).toLocaleString() : "$0"}
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
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Week Sales"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  Authors Table
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
          </Grid>
          <Grid item xs={12}>
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
                  Projects Table
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
          </Grid>
        </Grid>
      </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
