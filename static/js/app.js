d3.json("Samples.json").then(data => {

    var names = data.names;
    
    var dropdownMenu = d3.select("#selDataset1");

    names.forEach(item => {
        var optionTag = dropdownMenu.append("option");
        optionTag.text(item);
        optionTag.attr(item);
    })

    init()
});

d3.selectAll("#selDataset1").on("change", updatePlotly);

function init() {
    var dropdownMenu1 = d3.select("#selDataset1");
    var dataset = dropdownMenu1.property("value");

    updatePlotly(dataset)
}

function updatePlotly() {
    var dropdownMenu = d3.select("#selDataset1");

    var dataset = dropdownMenu.property("value");
    //console.log("DATA SET: ", dataset)

    d3.json("Samples.json").then(data => {

        ///// demographic display
        var demo_filt = data.metadata.filter(data => { return data.id == dataset })
          //Display the sample metadata - individual demographic information
          // create a demographics object to add to panel body
          var dem = [
            `id: ${demo_filt[0].id}`,
            `ethnicity: ${demo_filt[0].ethnicity}`,
            `gender: ${demo_filt[0].gender}`,
            `age: ${demo_filt[0].age}`,
            `location: ${demo_filt[0].location}`,
            `bbtype: ${demo_filt[0].bbtype}`,
            `wfreq: ${demo_filt[0].wfreq}`
        ]
        //select the id to append the key value pair under demographics panel
        panelBody = d3.select("#sample-metadata")

        // remove the current demographic info to make way for new currentID
        panelBody.html("")
        
        //append the key value pairs from demographics into the demographics panel
        panelBody.append("body").html(dem.join("<br>"))
        
        /////

        ////// horzontal bar graph
        var filteredID = data.samples.filter(data => {return data.id == dataset})
        //console.log(filteredID)

        var trace1 = {
            x: filteredID[0].sample_values.slice(0,10).reverse(),
            y: filteredID[0].otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString()),
            text: filteredID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h'
        };

        var data2 = [trace1];
        // Layout
        var layout = {
            title : 'Top 10 OTU samples',
            margin: {
                l: 75,
                r: 75,
                t: 60,
                b: 60
            }

        };

        Plotly.newPlot("bar", data2, layout);

        //////
        console.log(filteredID[0].otu_ids)
        //////
        var trace2 = {
            x: filteredID[0].otu_ids,
            y: filteredID[0].sample_values,
            text: filteredID[0].otu_labels,
            mode: 'markers',
            marker: {
              color: filteredID[0].otu_ids,
              size: filteredID[0].sample_values
            }
          };
          
          var data = [trace2];
          console.log(data)
          var layout = {
            title: `Results for test subject ID ${dataset}`,
            showlegend: false,
            height: 600,
            width: 1200
          };
          console.log(data)
          Plotly.newPlot('bubble', data, layout);
        /////

       

    })
};