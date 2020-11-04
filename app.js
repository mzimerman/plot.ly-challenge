function getPlot(id) {

    // Get Data from json file
    d3.json("samples.json").then((data)=> {
        console.log(data)

        var washfreq = data.metadata.map(d => d.washfreq)
        console.log(`Washing Frequency: ${washfreq}`)

        // Filter values by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples)

        // Get the Top 10
        var svalues = samples.sample_values.slice(0,10).reverse();

        var OTU_top = (samples.otu_ids.slice(0,10)).reverse();

        var OTU_id = OTU_top.map(d=> "OTU" + d)

        // Top 10 labels
        var labels = samples.otu_labels.slice(0,10);

        // Trace variables needed for plot
        var trace = {
            x: svalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'rgb(26,188,156)'},
            type:"bar",
            orientation: "h"
        };

        // Data variable
        var data = [trace];

        // Layout for plot
        var layout = {
            title:"Top 10 OTU",
            yaxis: {
                tickmode:"linear"
            },
            margin: {
                l:100,
                r:100,
                t:100,
                b:30
            }
        };

        // Create Bar Plot
        Plotly.newPlot("bar",data,layout);

        // Bubble Chart
        var trace_bub = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // Layout for Bubble plot
        var layout_bub = {
            xaxis:{title:"OTU ID"},
            height: 600,
            width: 1000,
        };

        // Data Variable
        var data_bub = [trace_bub];

        // Create Bubble Plot
        Plotly.newPlot("bubble", data_bub, layout_bub)

    });
}

function getInfo(id) {

    // Read Data
    d3.json("samples.json").then((data) =>{

        var metadata = data.metadata;
        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() == id)[0]

        var demoinfo = d3.select("#sample-metadata");

        demoinfo.html("");

        Object.entries(result).forEach((key)=>{
            demoinfo.append("h5").text(key[0].toUpperCase() + ": " + key[1]+ "\n");
        });
    });
}

function init() {

    var dropdown = d3.select("#selDataset");

    // Read Data
    d3.json("samples.json").then((data)=>{
        console.log(data)

        data.names.forEach(function(name){
            dropdown.append("option").text(name).property("value");
        });
    
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

init();