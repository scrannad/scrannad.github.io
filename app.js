//set url, read in json
const url="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data){
    console.log(data)
});

//dashboard start up
function init(){

    //initialize dropdown menu
    let dropDown=d3.select("#selDataset");

    d3.json(url).then((data)=>{
        let names=data.names;
        names.forEach((id)=> {
            console.log(id);

            dropDown.append("option")
            .text(id)
            .property("value",id);        
        });

        //set first sample to display when page loads
        let sample_one=names[0];
        console.log(sample_one);

        //initial plots for first page load, functions below
        metadata(sample_one);
        barChart(sample_one);
        bubbleChart(sample_one);
    });
};

//create function to populate metadata in Demographic Info key
function metadata(sample) {
    d3.json(url).then((data) => {
        let metadata=data.metadata;
        let value=metadata.filter(result=>result.id==sample);
        console.log(value)

        let valueOne=value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(valueOne).forEach(([key,value])=>{
            console.log (key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);
        });
    });
};

// create function to build bar chart
function barChart(sample) {

    // Use D3 to retrieve all of the data, then filter
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        // show top 10 in descending order
        let xvalues = sample_values.slice(0,10).reverse();
        let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // set up bar chart trace
        let trace1 = {
            x: xvalues,
            y: yvalues,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top Ten OTUs"
        };

        Plotly.newPlot("bar", [trace1], layout)
    });
};


// create function to build bubble chart
function bubbleChart(sample) {

    d3.json(url).then((data) => {
        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
        
        //set up bubble chart trace
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Jet"
            }
        };

        // set layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace2], layout)
    });
};

// update dashboard when dropdown option is changed
function optionChanged(value) { 
    console.log(value); 

    //call functions
    metadata(value);
    barChart(value);
    bubbleChart(value);
};

init();