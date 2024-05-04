// ******* DATA LOADING *******
// We took care of that for you
async function loadData () {
    const blsData = await d3.csv('data/BLS Data.csv');
    const cdcData = await d3.csv('data/CDC Data.csv');
    const cdcModifiedData = await d3.csv('data/cdc-modified.csv');
    const mapData = await d3.json('data/states-albers-10m.json');
    const utahData = await d3.json('data/utah.geojson');
    const utahTabData = await d3.csv('data/utah-final.csv');
    return { blsData, cdcData, mapData, utahData, utahTabData, cdcModifiedData };
  }
  
  
  // ******* STATE MANAGEMENT *******
  // This should be all you need, but feel free to add to this if you need to 
  // communicate across the visualizations
  const globalApplicationState = {
    blsData: null,
    cdcData: null,
    barChart: null,
    usMap: null,
    mapData: null,
    utahData: null,
    utahMap: null,
    utahTabData: null,
    utahMortalityMap: null,
    barCdcChart: null,
    cdcModifiedData: null,
    mapCdc: null
  };
  
  
  //******* APPLICATION MOUNTING *******
  loadData().then((loadedData) => {
    console.log('Here is the imported data:', loadedData.blsData);
  
    // Store the loaded data ainto the globalApplicationState
    globalApplicationState.blsData = loadedData.blsData;
    globalApplicationState.cdcData = loadedData.cdcData;
    globalApplicationState.mapData = loadedData.mapData;
    globalApplicationState.utahData = loadedData.utahData;
    globalApplicationState.utahTabData = loadedData.utahTabData;
    globalApplicationState.cdcModifiedData = loadedData.cdcModifiedData;

    const barChart = new BarChart(globalApplicationState);
    const usMap = new MapVis(globalApplicationState);
    const utahMap = new MapUtahVis(globalApplicationState);
    const utahMortalityMap = new MapUtahMortalityVis(globalApplicationState);
    const barCdcChart = new BarCdcChart(globalApplicationState);
    const mapCdc = new MapCdcVis(globalApplicationState);

    globalApplicationState.barChart = barChart;
    globalApplicationState.worldMap = usMap;
    globalApplicationState.utahMap = utahMap;
    globalApplicationState.utahMortalityMap = utahMortalityMap;
    globalApplicationState.barCdcChart = barCdcChart;
  });
  