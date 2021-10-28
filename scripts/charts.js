var data = {
  // A labels array that can contain any sort of values
  labels: ["juan", "pedro", "sara", "fer", "maria"],
  // Our series array that contains series objects or in this case series data arrays
  series: [[3, 2, 4, 2, 3]],
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
new Chartist.Line(".ct-chart", data);
