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
    // updateChartData();
    template.subscribe('brew.averageChartData',brew)

  })
});
Template.canvas.onRendered (function() {
  Template.instance().chart.set(CreateBlankChart());
  // updateChartData();
  });

Template.canvas.helpers({
  brew(){
    return Coffees.find();
  }
})

function render(){

}

function chartDataSet(){
  let data = Template.instance().data;
  return [parseFloat(data.AverageAroma), parseFloat(data.AverageBody), parseFloat(data.AverageAcidity), parseFloat(data.AverageFlavour), parseFloat(data.AverageBalance)]
}

function updateChartData(){
  let template = Template.instance();
  let coffee = Coffees.findOne();
  if(!!template.chart.get()){
    try{
    template.chart.get().chart.config.data.datasets.data[0] = 1;
    template.chart.get().reset();
    template.chart.get().update();
    }
    catch(e){
      console.log(e);
    }
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
    type: 'radar',
    data: data2,
    options: {
      title: {
          display: true,
          text: 'Brew Profile'
        },
        backgroundColor: "rgba(0,0,0,0)",
        fontSize: 16
      }
    });
}
