import { Chart } from 'chart.js';
import './brewChart.html';
import { Coffees } from '../../api/collections/coffees.js';

//Populate Chart - ID = myChart onRendered

Template.canvas.onCreated(() => {
  var template = Template.instance()
  let brew = template.data.CoffeeName;
  template.chartData = new ReactiveVar();
  template.chart = new ReactiveVar();
  template.autorun(() =>{
    updateChartData();
    template.subscribe('brew.averageChartData',brew)

  })
});
Template.canvas.onRendered (function() {
  Template.instance().chart.set(CreateBlankChart());
  updateChartData();
});

Template.canvas.helpers({
  brew(){
    return Coffees.find();
  }
})

function chartDataSet(){
  let data = Template.instance().data;
  return [parseFloat(data.AverageAroma), parseFloat(data.AverageBody), parseFloat(data.AverageAcidity), parseFloat(data.AverageFlavour), parseFloat(data.AverageBalance)]
}

function updateChartData(){
  let template = Template.instance();
  let coffee = Coffees.findOne();
  try{
    template.chart.get().config.data.datasets[0].data[0] = coffee.AverageAroma;// = chartDataSet(coffee);
    template.chart.get().config.data.datasets[0].data[1] = coffee.AverageBody;// = chartDataSet(coffee);
    template.chart.get().config.data.datasets[0].data[2] = coffee.AverageAcidity;// = chartDataSet(coffee);
    template.chart.get().config.data.datasets[0].data[3] = coffee.AverageFlavour;// = chartDataSet(coffee);
    template.chart.get().config.data.datasets[0].data[4] = coffee.AverageBalance;// = chartDataSet(coffee);
    template.chart.get().update();
  }
  catch(e){
      //console.log(e);
  }
}

function CreateBlankChart(){
  let data2 = {
    labels: ["Aroma", "Body", "Acidity", "Flavour", "Balance"],
    datasets: [
      {
        label: "Average Review",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: chartDataSet()
      }
    ]
  };

  return new Chart(document.getElementById('myChart'), {
    responsive: true,
    type: 'radar',
    data: data2,
    options: {
      title: {
          display: true,
          text: 'Brew Profile'
        },
        backgroundColor: "rgba(0,0,0,0)",
        fontSize: 16,
        scale: {
          ticks:{
            min:0,
            max: 10,
            stepSize: 2
          }
        }
      }
    });
}
