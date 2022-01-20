async function showChart() {

  // Get the data from CSV file, wait for it to load
  const data = await getData();
  console.log(data);

  const ctx = document.getElementById("chart").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.xYears,
      datasets: [
        {
          label: "Global",
          data: data.yTemps,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "India",
          data: data.indiaTemp,
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
        }
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback: function (value, index, ticks) {
              return value + "°"
            }
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Combined Land-Surface Air and Sea-Surface Water Temperature"
        }
      }
    }
  });

}

showChart();

async function getData() {
  const res = await fetch("GLB.Ts+dSST.csv");
  const data = await res.text();
  // console.log(data);

  // manually parsing
  const table = data.split(/\n/).slice(1);
  // console.log(table);

  // 13th J-D

  const xYears = [];
  const yTemps = [];
  const indiaTemp = []

  table.forEach(row => {
    const columns = row.trim().split(",");
    // year, difference from global average
    const year = columns[0];
    xYears.push(year);
    const temp = columns[13];
    const altTemp = columns[17];
    // 14°C is the global average temperature
    yTemps.push(parseFloat(temp) + 14);
    indiaTemp.push(parseFloat(altTemp) + 14)
  });

  // console.log(xYears, yTemps);

  return { xYears, yTemps, indiaTemp };
}